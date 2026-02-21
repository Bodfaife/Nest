import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../helpers/apiClient';
import { debug } from '../helpers/debug';

export default function StripePaymentForm({ amount = 0, user = null, onSuccess = null, onError = null }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await api.createIntent({ amount: Math.round(amount), currency: 'usd', metadata: { userId: user?.id } });
        // support different key spellings from server
        const secret = resp?.clientSecret || resp?.client_secret || resp?.client_secret;
        if (mounted) setClientSecret(secret);
      } catch (e) {
        debug.log('⚠️ StripePaymentForm: createIntent failed', e?.message || e);
        onError && onError('Unable to initialize payment.');
      }
    })();
    return () => { mounted = false; };
  }, [amount, user]);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!stripe || !elements) return onError && onError('Stripe not loaded');
    if (!clientSecret) return onError && onError('Payment not initialised');

    setLoading(true);
    const card = elements.getElement(CardElement);
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card }
      });
      if (result.error) {
        debug.log('⚠️ confirmCardPayment error', result.error.message);
        onError && onError(result.error.message);
      } else if (result.paymentIntent) {
        debug.log('✅ Payment succeeded', result.paymentIntent.id);
        onSuccess && onSuccess(result.paymentIntent);
      }
    } catch (err) {
      debug.log('⚠️ confirmCardPayment exception', err);
      onError && onError(err?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <label className="block text-sm text-gray-600 mb-2">Card details</label>
        <div className="p-3 border rounded">
          <CardElement options={{ hidePostalCode: true }} />
        </div>

        <div className="mt-4 text-right">
          <button
            type="submit"
            disabled={!stripe || loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Processing…' : `Pay ${amount ? `$${(amount/100).toFixed(2)}` : ''}`}
          </button>
        </div>
      </div>
    </form>
  );
}
