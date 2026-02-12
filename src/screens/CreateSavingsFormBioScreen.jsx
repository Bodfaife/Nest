import React, { useState, useEffect } from "react";

export default function CreateSavingsFormBioScreen({ onNext }) {
  const [bio, setBio] = useState({
    dob: '',
    gender: '',
    occupation: '',
    address: ''
  });

  // Load saved bio form data on mount
  useEffect(() => {
    const savedBio = localStorage.getItem("savedBioForm");
    if (savedBio) {
      setBio(JSON.parse(savedBio));
    }
    // Save this screen as the current savings flow screen
    localStorage.setItem("savingsFlowScreen", "CreateSavingsBio");
  }, []);

  // Save bio data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("savedBioForm", JSON.stringify(bio));
  }, [bio]);

  function handleChange(e) {
    setBio({ ...bio, [e.target.name]: e.target.value });
  }

  function handleNext() {
    if (!bio.dob || !bio.gender || !bio.occupation || !bio.address) return;
    onNext(bio);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12 font-['Plus_Jakarta_Sans',_sans-serif]">
      <img src="/Nest logo.png" alt="Nest Logo" className="w-12 h-12 mb-6 rounded-xl" />
      <h2 className="text-2xl font-black text-emerald-900 mb-2">Tell us about you</h2>
      <div className="w-full max-w-md space-y-4 mt-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date of Birth</label>
          <input type="date" name="dob" value={bio.dob} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Gender</label>
          <select name="gender" value={bio.gender} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Occupation</label>
          <input type="text" name="occupation" value={bio.occupation} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. Student, Engineer" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Address</label>
          <input type="text" name="address" value={bio.address} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="Your address" />
        </div>
      </div>
      <button onClick={handleNext} className="w-full max-w-md mt-8 py-3 rounded-2xl font-bold text-white bg-[#00875A] shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all">Continue</button>
    </div>
  );
}
