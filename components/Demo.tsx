import React, { useState } from 'react';
import { Terminal, Send } from 'lucide-react';

export const Demo: React.FC = () => {
  const [question, setQuestion] = useState('Loyiha nima qiladi?');
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const endpoint = typeof window !== 'undefined' && window.location.hostname.includes('localhost')
    ? '/.netlify/functions/ask'
    : '/api/ask';

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setResponseText(null);
    setError(null);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      // Read as text first to avoid JSON parse errors on empty/non-JSON responses
      const text = await res.text();
      let data: any = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          // response was not JSON; we'll fall back to raw text below
          data = null;
        }
      }

      if (!res.ok) {
        const msg = data?.details || data?.error || text || `So'rov xatosi: ${res.status}`;
        setError(msg);
      } else {
        const body = data?.answer || data || text || 'Hech qanday javob bo‘lmadi';
        setResponseText(typeof body === 'string' ? body : JSON.stringify(body, null, 2));
      }
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">API Demo va Hujjatlar</h2>

      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <p className="mb-2">Ushbu sahifa <code>POST /api/ask</code> endpointini tushuntiradi va jonli sinovga imkon beradi.</p>

        <h3 className="font-semibold mt-3">Endpoint</h3>
        <p className="text-sm text-slate-600 mb-2"><code>POST /api/ask</code></p>

        <h3 className="font-semibold mt-3">So'rov tanasi (JSON)</h3>
        <pre className="bg-slate-50 p-2 rounded text-sm whitespace-pre-wrap wrap-break-word">{`{ "question": "Loyiha AIdan qanday foydalanadi?" }`}</pre>

        <h3 className="font-semibold mt-3">Misol (curl)</h3>
        <pre className="bg-slate-50 p-2 rounded text-sm whitespace-pre-wrap wrap-break-word">{`curl -X POST https://agronis.netlify.app/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"Loyiha nima qiladi?"}'`}</pre>

        <p className="text-xs mt-3 text-red-600/60 font-semibold">Eslatma: Agar backend kvotasi tugagan bo‘lsa, funksiya muqobil yoki yordamchi javob qaytaradi.</p>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <form onSubmit={handleSend} className="space-y-3">
          <label className="block text-sm font-medium">Savol yuborish</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="w-full border rounded p-2 text-sm"
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              onClick={handleSend}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Yuborilmoqda...' : 'Yuborish'}
            </button>

            <button
              type="button"
              onClick={() => { setQuestion('Loyiha nima qiladi?'); setResponseText(null); setError(null); }}
              className="inline-flex items-center gap-2 px-3 py-2 border rounded"
            >
              <Terminal className="w-4 h-4" />
              Tozalash
            </button>
          </div>
        </form>

        <div className="mt-4">
          <h4 className="font-semibold">Javob</h4>
          {loading && <p className="text-sm text-slate-500">Javob kutilmoqda…</p>}
          {error && <pre className="bg-rose-50 text-rose-700 p-2 rounded mt-2">{error}</pre>}
          {responseText && <pre className="bg-slate-50 p-2 rounded mt-2 whitespace-pre-wrap wrap-break-word">{responseText}</pre>}
        </div>
      </div>
    </div>
  );
};

export default Demo;
