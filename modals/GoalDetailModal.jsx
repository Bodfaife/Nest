import React, { useState } from 'react';
import { X } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import { formatCurrency } from '../helpers/helpers';

export default function GoalDetailModal({ selectedGoal, setModal, handleSaveToGoal }) {
  const [saveAmount, setSaveAmount] = useState('');

  return (
    <div className="absolute inset-0 bg-white p-6 z-30 overflow-y-auto">
      <button onClick={()=>setModal(null)} className="mb-4 p-2"><X className="w-6 h-6"/></button>
      <h2 className="text-2xl font-bold mb-4">{selectedGoal.title}</h2>
      <p className="text-gray-500 text-sm mb-2">Started: {selectedGoal.started}</p>
      <p className="text-gray-500 text-sm mb-2">Last Saved: {selectedGoal.lastSaved}</p>
      <p className="text-gray-500 text-sm mb-4">Next Save: {selectedGoal.nextSave}</p>
      <ProgressBar current={selectedGoal.current} target={selectedGoal.target} color="bg-emerald-600"/>
      <p className="font-bold text-gray-800 mt-2">${formatCurrency(selectedGoal.current)} / ${formatCurrency(selectedGoal.target)}</p>
      <input type="number" placeholder="Amount to Save" value={saveAmount} onChange={e=>setSaveAmount(Number(e.target.value))} className="w-full p-3.5 border rounded-2xl mb-4 mt-4 outline-none"/>
      <button onClick={()=>{
        handleSaveToGoal(selectedGoal.id, saveAmount);
        setSaveAmount('');
      }} className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold">Save to Goal</button>
    </div>
  );
}
