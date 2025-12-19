"use client";

import { useState, useEffect } from 'react';

type Poll = {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
};

export default function Home() {
  const [status, setStatus] = useState<string>("");
  const [results, setResults] = useState<Record<string, number>>({});
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false); // Kullanıcı oy verdi mi?

  const BASE_API_URL = "https://5gw5ve21p7.execute-api.eu-central-1.amazonaws.com/Prod"; 

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/poll`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const currentPoll = data[0];
          setActivePoll(currentPoll);
          
          // TARAYICI HAFIZASINI KONTROL ET
          // Kullanıcı bu ankete daha önce oy vermiş mi?
          const localVote = localStorage.getItem(`voted_${currentPoll.id}`);
          if (localVote) {
            setHasVoted(true);
            fetchResults(currentPoll.id); // Oy verdiyse sonuçları getir
          }
        }
      } catch (error) {
        console.error("Veri yüklenemedi:", error);
      }
    };
    init();
  }, []);

  const fetchResults = async (pollId: string) => {
    try {
      const res = await fetch(`${BASE_API_URL}/results?poll_id=${pollId}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Sonuçlar alınamadı:", error);
    }
  };

  const handleVote = async (option: string) => {
    if (!activePoll) return;

    setStatus("Oy gönderiliyor...");

    try {
      const response = await fetch(`${BASE_API_URL}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          poll_id: activePoll.id, 
          option: option 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`✅ "${option}" seçeneği için oy verdiniz!`);
        
        // 1. Oy verildi bilgisini kaydet
        setHasVoted(true);
        localStorage.setItem(`voted_${activePoll.id}`, 'true');
        
        // 2. Sonuçları getir
        fetchResults(activePoll.id); 
      } else if (response.status === 403) {
        // Zaten oy vermiş ama localstorage temizlenmiş olabilir, yine de sonuçları açalım
        setStatus(`⚠️ ${data.message}`);
        setHasVoted(true);
        fetchResults(activePoll.id);
      } else {
        setStatus("❌ Bir hata oluştu.");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Bağlantı hatası.");
    }
  };

  // Yüzdelik Hesaplama Yardımcısı
  const calculatePercentage = (voteCount: number) => {
    const total = (results['A'] || 0) + (results['B'] || 0);
    if (total === 0) return 0;
    return Math.round((voteCount / total) * 100);
  };

  if (!activePoll) {
    return <div className="flex min-h-screen items-center justify-center text-white bg-slate-900 animate-pulse">Anket Yükleniyor...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-900 text-white">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Geleceği Oyla 🚀</h1>
        <p className="text-slate-400 mb-10 text-sm">Bulut tabanlı, güvenli oylama sistemi.</p>
        
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
          <h2 className="text-2xl text-white mb-8 font-semibold">
            {activePoll.question}
          </h2>
          
          {/* OY VERME ALANI */}
          {!hasVoted ? (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => handleVote("A")}
                className="flex-1 px-8 py-4 bg-blue-600 rounded-xl hover:bg-blue-500 transition font-bold text-xl shadow-lg shadow-blue-900/50 border border-blue-400"
              >
                {activePoll.option_a}
              </button>

              <button 
                onClick={() => handleVote("B")}
                className="flex-1 px-8 py-4 bg-green-600 rounded-xl hover:bg-green-500 transition font-bold text-xl shadow-lg shadow-green-900/50 border border-green-400"
              >
                {activePoll.option_b}
              </button>
            </div>
          ) : (
            /* SONUÇ ALANI (Sadece oy verdiyse görünür) */
            <div className="space-y-6 animate-in fade-in duration-700">
              
              {/* Seçenek A Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-blue-400">{activePoll.option_a}</span>
                  <span className="text-slate-300">{results['A'] || 0} Oy ({calculatePercentage(results['A'] || 0)}%)</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-4 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${calculatePercentage(results['A'] || 0)}%` }}
                  ></div>
                </div>
              </div>

              {/* Seçenek B Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-green-400">{activePoll.option_b}</span>
                  <span className="text-slate-300">{results['B'] || 0} Oy ({calculatePercentage(results['B'] || 0)}%)</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${calculatePercentage(results['B'] || 0)}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-sm text-slate-500 mt-4 italic">Oyunuz başarıyla kaydedildi.</p>
            </div>
          )}

          {/* Durum Mesajı */}
          {status && !hasVoted && <p className="mt-6 text-yellow-400 font-medium animate-pulse">{status}</p>}
        </div>
      </div>
    </main>
  );
}