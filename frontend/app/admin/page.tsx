"use client";

import { useState } from 'react';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    question: '',
    option_a: '',
    option_b: ''
  });
  const [status, setStatus] = useState('');

  // BURAYA AWS API LINKINI YAPIŞTIR (Sonunda /Prod olsun)
  const BASE_API_URL = "https://5gw5ve21p7.execute-api.eu-central-1.amazonaws.com/Prod"; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Kaydediliyor...');

    try {
      const res = await fetch(`${BASE_API_URL}/poll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('✅ Anket başarıyla oluşturuldu! Ana sayfaya gidip bakabilirsin.');
        setFormData({ question: '', option_a: '', option_b: '' }); // Formu temizle
      } else {
        setStatus('❌ Bir hata oluştu.');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Bağlantı hatası.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Yeni Anket Oluştur</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Soru</label>
            <input 
              type="text" 
              required
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="Örn: Hangi dil daha hızlı?"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Seçenek A</label>
              <input 
                type="text" 
                required
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                placeholder="Örn: Go"
                value={formData.option_a}
                onChange={(e) => setFormData({...formData, option_a: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Seçenek B</label>
              <input 
                type="text" 
                required
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                placeholder="Örn: Rust"
                value={formData.option_b}
                onChange={(e) => setFormData({...formData, option_b: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition transform hover:scale-105"
          >
            Anketi Yayınla 🚀
          </button>
        </form>

        {status && <p className="mt-6 text-center text-yellow-400 animate-pulse">{status}</p>}
        
        <div className="mt-8 text-center">
            <a href="/" className="text-slate-400 hover:text-white underline text-sm">← Ana Sayfaya Dön</a>
        </div>
      </div>
    </div>
  );
}