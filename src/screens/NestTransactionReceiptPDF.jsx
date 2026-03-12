import React from "react";
import {
  CheckCircle2,
  ArrowDownLeft,
  Wallet,
  ShieldCheck,
  QrCode,
  Printer,
} from "lucide-react";

const NairaSign = ({ className = "" }) => (
  <span className={`relative inline-flex items-center ${className}`}>
    N
    <span className="absolute left-[-1px] right-[-1px] top-[42%] h-[1px] bg-current" />
    <span className="absolute left-[-1px] right-[-1px] top-[58%] h-[1px] bg-current" />
  </span>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
      {label}
    </span>
    <span className="text-sm font-bold text-slate-900">{value}</span>
  </div>
);

export default function NestTransactionReceiptPDF({ transaction }) {
  if (!transaction) return null;


  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center font-['Plus_Jakarta_Sans',_sans-serif]">
      <div className="w-full max-w-[620px] mb-6 flex justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-emerald-800 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg hover:bg-emerald-700 active:scale-95 transition"
        >
          <Printer size={18} />
          Print Receipt
        </button>
      </div>
      <div className="w-full max-w-[620px] bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-[0_20px_60px_-15px_rgba(6,78,59,0.15)] print:shadow-none print:border-none">
        <div className="relative px-10 py-12 bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-500 text-white">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex justify-between items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[10px] font-extrabold tracking-widest mb-4">
                <CheckCircle2 size={12} strokeWidth={3} />
                SUCCESSFUL
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Nest Savings Receipt
              </h1>
              <p className="text-xs mt-2 text-white/70 font-medium">
                Ref: {transaction.id}
              </p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
              <ArrowDownLeft size={22} />
            </div>
          </div>
        </div>
        <div className="px-10 py-12">
          <div className="text-center mb-10 pb-10 border-b border-slate-100">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">
              Amount Saved
            </p>
            <h2 className="text-5xl font-black tracking-tight text-emerald-800 flex items-center justify-center gap-1">
              <NairaSign className="scale-90" />
              {transaction.amount.toLocaleString()}
            </h2>
            <div className="inline-flex mt-4 px-4 py-1 rounded-full bg-slate-100 text-black text-xs font-bold uppercase tracking-wider">
              Savings Deposit
            </div>
          </div>
          <div className="space-y-6 mb-10">
            <DetailRow label="Account" value="Nest Savings Wallet" />
            <DetailRow label="Date" value={new Date(transaction.date).toLocaleString()} />
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600">
                  <Wallet size={16} />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  New Balance
                </span>
              </div>
              <span className="text-lg font-black text-slate-900 flex items-center gap-1">
                <NairaSign className="scale-75 origin-right" />
                {transaction.balanceAfter?.toLocaleString() || "—"}
              </span>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <QrCode size={42} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Transaction Verification
                </p>
                <p className="text-[9px] text-slate-400 leading-tight mt-1">
                  Scan to verify this receipt on
                  <br />
                  the Nest secure ledger
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-black/40">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black tracking-[0.25em] uppercase">
                Secured by Nest
              </span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap");
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
