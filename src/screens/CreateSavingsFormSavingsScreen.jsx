import React, { useState, useEffect } from "react";
import { Target, Calendar, DollarSign, Clock, Bell, TrendingUp } from "lucide-react";

const savingsTypes = [
  { id: 'goal', label: 'Goal-Based Savings', desc: 'Save for a specific target amount', icon: Target },
  { id: 'regular', label: 'Regular Savings', desc: 'Save a fixed amount regularly', icon: Calendar },
  { id: 'flexible', label: 'Flexible Savings', desc: 'Save what you can, when you can', icon: TrendingUp }
];

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

const safeParse = (raw, fallback) => {
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch (e) { return fallback; }
};

const getUserStorageKey = (baseKey, user) => {
  const identifier = (user?.email || user?.accountNumber || user?.phone || '').toString().trim().toLowerCase();
  return identifier ? `${baseKey}:${identifier}` : baseKey;
};

export default function CreateSavingsFormSavingsScreen({ onSubmit, user }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    type: '',
    goal: '',
    targetAmount: '',
    amount: '',
    frequency: '',
    duration: '',
    reminder: true,
    autoSave: false
  });

  useEffect(() => {
    const key = getUserStorageKey('savedSavingsForm', user);
    const existing = localStorage.getItem(key);
    if (existing) {
      const parsed = safeParse(existing, null);
      if (parsed) setForm(parsed);
    }
    localStorage.setItem(getUserStorageKey('savingsFlowScreen', user), 'CreateSavingsDetails');
  }, [user]);

  useEffect(() => {
    const key = getUserStorageKey('savedSavingsForm', user);
    localStorage.setItem(key, JSON.stringify(form));
  }, [form, user]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function selectType(type) {
    setForm(prev => ({ ...prev, type }));
    setStep(2);
  }

  function handleSubmit() {
    if (form.type === 'goal' && (!form.goal || !form.targetAmount || !form.amount || !form.frequency)) return;
    if (form.type === 'regular' && (!form.amount || !form.frequency || !form.duration)) return;
    if (form.type === 'flexible' && (!form.goal || !form.targetAmount)) return;
    onSubmit(form);
    const key = getUserStorageKey('savedSavingsForm', user);
    localStorage.removeItem(key);
  }

  const isValid = () => {
    if (form.type === 'goal') return form.goal && form.targetAmount && form.amount && form.frequency;
    if (form.type === 'regular') return form.amount && form.frequency && form.duration;
    if (form.type === 'flexible') return form.goal && form.targetAmount;
    return false;
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col">
        <div className="flex-1 pt-12">
          <div className="text-center mb-8">
            <img src="/Nest logo.png" alt="Nest Logo" className="w-12 h-12 mx-auto mb-4 rounded-xl" />
            <h2 className="text-3xl font-black text-emerald-900 mb-2">Choose Your Savings Type</h2>
            <p className="text-gray-500">Select the type of savings plan that fits your goals</p>
          </div>

          <div className="space-y-4">
            {savingsTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => selectType(type.id)}
                className="w-full p-6 bg-gray-50 rounded-2xl border border-gray-100 text-left hover:border-emerald-200 hover:bg-emerald-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <type.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{type.label}</h3>
                    <p className="text-sm text-gray-500">{type.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="flex-1 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep(1)} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-black text-emerald-900">Set Up Your Savings</h2>
        </div>

        <div className="space-y-6">
          {form.type === 'goal' && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  What&apos;s your savings goal?
                </label>
                <input type="text" name="goal" value={form.goal} onChange={handleChange} placeholder="e.g. Buy a new phone, Emergency fund" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-300" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  Target amount
                </label>
                <input type="number" name="targetAmount" value={form.targetAmount} onChange={handleChange} placeholder="0.00" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-300" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  How often will you save?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {frequencies.map((freq) => (
                    <button key={freq.value} onClick={() => setForm(prev => ({ ...prev, frequency: freq.value }))} className={`p-3 rounded-xl border text-center transition-all ${form.frequency === freq.value ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'}`}>
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  Amount per {form.frequency || 'period'}
                </label>
                <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder={`0.00`} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-300" />
              </div>
            </>
          )}

          {form.type === 'regular' && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  How often will you save?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {frequencies.map((freq) => (
                    <button key={freq.value} onClick={() => setForm(prev => ({ ...prev, frequency: freq.value }))} className={`p-3 rounded-xl border text-center transition-all ${form.frequency === freq.value ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'}`}>
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  Amount per {form.frequency || 'period'}
                </label>
                <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder={`0.00`} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-300" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  How long do you want to save? (months)
                </label>
                <input type="number" name="duration" value={form.duration} onChange={handleChange} min="1" max="120" placeholder="e.g. 12 months" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-300" />
              </div>
            </>
          )}

          {form.type === 'flexible' && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  What is your initial target?
                </label>
                <input type="text" name="goal" value={form.goal} onChange={handleChange} placeholder="e.g. Build emergency fund" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-300" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  Proposed total amount
                </label>
                <input type="number" name="targetAmount" value={form.targetAmount} onChange={handleChange} placeholder="Target you&apos;d like to reach" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-300" />
              </div>
            </>
          )}

          {(form.type === 'goal' || form.type === 'regular' || form.type === 'flexible') && (
            <>
              <div className="flex items-center gap-2">
                <input id="autoSave" type="checkbox" name="autoSave" checked={form.autoSave} onChange={handleChange} className="w-4 h-4" />
                <label htmlFor="autoSave" className="text-sm font-medium text-gray-700">Enable auto top-up</label>
              </div>
              <div className="flex items-center gap-2">
                <input id="reminder" type="checkbox" name="reminder" checked={form.reminder} onChange={handleChange} className="w-4 h-4" />
                <label htmlFor="reminder" className="text-sm font-medium text-gray-700">Remind me about top-up schedule</label>
              </div>

              <button onClick={handleSubmit} disabled={!isValid()} className={`w-full py-3 rounded-xl font-bold ${isValid() ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                Continue to Savings
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
