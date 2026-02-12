import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function TakeLoanModal({ setModal, loans, setLoans, balance, setBalance, handleTransactionAdd }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <div className="absolute inset-0 bg-white p-6 z-30">
      <button onClick={()=>setModal(null)} className="mb-4 p-2"><X className="w-6 h-6"/></button>
      <h2 className="text-2xl font-bold mb-4">Take Loan</h2>
      <input placeholder="Loan Title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-3.5 border rounded-2xl mb-4 outline-none"/>
      <input type="number" placeholder="Amount" value={amount} onChange={e=>setAmount(Number(e.target.value))} className="w-full p-3.5 border rounded-2xl mb-4 outline-none"/>
      <button onClick={()=>{
        if(title && amount>0){
          setLoans([{id:Date.now(), title, amount, repaid:0, totalDue:amount*1.1, dueDate:new Date(new Date().setMonth(new Date().getMonth()+1)).toLocaleDateString(), status:'active', taken:new Date().toLocaleDateString()}, ...loans]);
          setBalance(balance + amount);
          handleTransactionAdd('loan', amount, title);
          setModal(null);
        }
      }} className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold">Take Loan</button>
    </div>
  );
}
