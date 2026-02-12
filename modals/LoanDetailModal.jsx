import React, { useState } from 'react';
import { X } from 'lucide-react';
import ProgressBar from '../src/components/ProgressBar';
import { formatCurrency } from '../src/helpers/helpers';

export default function LoanDetailModal({ selectedLoan, setModal, loans, setLoans, balance, setBalance, handleTransactionAdd }) {
  const [repayAmount, setRepayAmount] = useState('');
  const remaining = selectedLoan.totalDue - selectedLoan.repaid;

  return (
    <div className="absolute inset-0 bg-white p-6 z-30 overflow-y-auto">
      <button onClick={()=>setModal(null)} className="mb-4 p-2"><X className="w-6 h-6"/></button>
      <h2 className="text-2xl font-bold mb-4">{selectedLoan.title}</h2>
      <p className="text-gray-500 text-sm mb-2">Taken: {selectedLoan.taken}</p>
      <p className="text-gray-500 text-sm mb-2">Due Date: {selectedLoan.dueDate}</p>
      <ProgressBar current={selectedLoan.repaid} target={selectedLoan.totalDue} color="bg-emerald-600"/>
      <p className="font-bold text-gray-800 mt-2">Repaid: ${formatCurrency(selectedLoan.repaid)} / ${formatCurrency(selectedLoan.totalDue)}</p>
      <p className="text-gray-500 text-sm mb-4">Remaining: ${formatCurrency(remaining)}</p>
      <input type="number" placeholder="Amount to Repay" value={repayAmount} onChange={e=>setRepayAmount(Number(e.target.value))} className="w-full p-3.5 border rounded-2xl mb-4 mt-4 outline-none"/>
      <button onClick={()=>{
        if(repayAmount>0 && repayAmount<=remaining){
          setLoans(loans.map(l=>{
            if(l.id===selectedLoan.id) return {...l, repaid:l.repaid+repayAmount};
            return l;
          }));
          setBalance(balance - repayAmount);
          handleTransactionAdd('withdrawal', repayAmount, `Loan Repayment: ${selectedLoan.title}`);
          setModal(null);
        }
      }} className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold">Repay Loan</button>
    </div>
  );
}
