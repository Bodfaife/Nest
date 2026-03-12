import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddGoalModal({ setModal, goals, setGoals }) {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');

  return (
    <div className="absolute inset-0 bg-white p-6 z-30">
      <button onClick={()=>setModal(null)} className="mb-4 p-2"><X className="w-6 h-6"/></button>
      <h2 className="text-2xl font-bold mb-4">Add Goal</h2>
      <input placeholder="Goal Title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-3.5 border rounded-2xl mb-4 outline-none"/>
      <input type="number" placeholder="Target Amount" value={target} onChange={e=>setTarget(Number(e.target.value))} className="w-full p-3.5 border rounded-2xl mb-4 outline-none"/>
      <button onClick={()=>{
        if(title && target>0){
          setGoals([{id:Date.now(), title, target, current:0, color:'bg-blue-500', icon:'🎯', lastSaved:'-', nextSave:'-', started:new Date().toLocaleDateString()}, ...goals]);
          setModal(null);
        }
      }} className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold">Add Goal</button>
    </div>
  );
}
