import React, { useState, useEffect } from "react";

const frequencies = ["Daily", "Weekly", "Monthly"];

export default function CreateSavingsFormSavingsScreen({ onSubmit }) {
  const [form, setForm] = useState({
    frequency: '',
    goal: '',
    reminder: false,
    amount: '',
    targetAmount: '',
    duration: ''
  });

  // Load saved savings form data on mount
  useEffect(() => {
    const savedForm = localStorage.getItem("savedSavingsForm");
    if (savedForm) {
      setForm(JSON.parse(savedForm));
    }
    // Save this screen as the current savings flow screen
    localStorage.setItem("savingsFlowScreen", "CreateSavingsDetails");
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("savedSavingsForm", JSON.stringify(form));
  }, [form]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  function handleSubmit() {
    if (!form.frequency || !form.goal || !form.amount || !form.targetAmount || !form.duration) return;
    onSubmit(form);
  }

  return (
   <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12 font-['Plus_Jakarta_Sans',_sans-serif]">
        <img src="/Nest logo.png" alt="Nest Logo" className="w-12 h-12 mb-6 rounded-xl" />
        <h2 className="text-2xl font-black text-emerald-900 mb-2">Your Savings Plan</h2>
      <div className="w-full max-w-md space-y-4 mt-0">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">How often do you want to save?</label>
          <select name="frequency" value={form.frequency} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50">
            <option value="">Select</option>
            {frequencies.map(f => <option key={f} value={f.toLowerCase()}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Goal / Reason for Saving</label>
          <input type="text" name="goal" value={form.goal} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. Buy a laptop" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="reminder" checked={form.reminder} onChange={handleChange} className="accent-emerald-700 w-4 h-4" />
          <label className="text-xs font-bold text-gray-400 uppercase">Remind me to top up</label>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Amount per Interval</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. 5,000" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Target Amount</label>
          <input type="number" name="targetAmount" value={form.targetAmount} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. 200,000" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Savings Duration (months)</label>
          <input type="number" name="duration" value={form.duration} onChange={handleChange} min="1" max="120" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. 12" />
          <p className="text-xs text-gray-500 mt-1">How long you want to lock your savings</p>
        </div>
      </div>
      <button onClick={handleSubmit} className="w-full max-w-md mt-8 py-3 rounded-2xl font-bold text-white bg-[#00875A] shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all">Submit</button>
    </div>
  );
}
