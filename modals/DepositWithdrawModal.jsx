import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function DepositWithdrawModal({ type, setModal, balance, setBalance, goals, handleSaveToGoal, handleTransactionAdd }) {
  const isDeposit = type === 'deposit';
  const [amount, setAmount] = useState('');
  const [goalId, setGoalId] = useState('');

  return (
    <div className="absolute inset-0 bg-white p-6 z-30 overflow-y-auto">
      <button onClick={()=>setModal(null)} className="mb-4 p-2"><X className="w-6 h-6"/></button>
      <h2 className="text-2xl font-bold mb-4">{isDeposit ? 'Deposit Funds' : 'Withdraw Funds'}</h2>
      <input type="number" placeholder="Enter amount" value={amount} onChange={e=>setAmount(Number(e.target.value))} className="w-full p-3.5 border rounded-2xl mb-4 outline-none"/>
      {isDeposit && goals.length > 0 && (
        <select value={goalId} onChange={e=>setGoalId(Number(e.target.value))} className="w-full mb-4 p-3.5 border rounded-2xl outline-none">
          <option value="">Select Goal to Save To (Optional)</option>
          {goals.map(g=><option key={g.id} value={g.id}>{g.title}</option>)}
        </select>
      )}
      <button onClick={()=>{
        if(amount>0){
          if(goalId) handleSaveToGoal(goalId, amount);
          else handleTransactionAdd(isDeposit ? 'deposit' : 'withdrawal', amount, isDeposit ? 'Deposit' : 'Withdrawal');
          setModal(null);
        }
      }} className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold">{isDeposit ? 'Deposit' : 'Withdraw'}</button>
    </div>
  );
}
