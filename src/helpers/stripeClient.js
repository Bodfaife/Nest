import { loadStripe } from '@stripe/stripe-js';

// Use REACT_APP_STRIPE_PUBLISHABLE_KEY in your environment for the publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "");

export default stripePromise;
