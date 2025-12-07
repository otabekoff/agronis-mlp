import React, { useState } from 'react';
import { Terminal, Send } from 'lucide-react';

export const Demo: React.FC = () => {
  const [question, setQuestion] = useState('What does your project do?');
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setResponseText(null);
    setError(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.details || data?.error || 'Request failed');
      } else {
        setResponseText(data.answer || JSON.stringify(data));
      }
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">API Demo & Documentation</h2>

      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <p className="mb-2">This demo page explains the POST <code>/api/ask</code> endpoint and lets you test it live.</p>

        <h3 className="font-semibold mt-3">Endpoint</h3>
        <p className="text-sm text-slate-600 mb-2"><code>POST /api/ask</code></p>

        <h3 className="font-semibold mt-3">Request body (JSON)</h3>
        <pre className="bg-slate-50 p-2 rounded text-sm">{`{ "question": "How does your project use AI?" }`}</pre>

        <h3 className="font-semibold mt-3">Example curl</h3>
        <pre className="bg-slate-50 p-2 rounded text-sm">{`curl -X POST https://agronis.netlify.app/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"What does your project do?"}'`}</pre>

        <p className="text-xs text-slate-500 mt-3">Note: If the backend quota is exceeded the function returns a helpful fallback message.</p>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <form onSubmit={handleSend} className="space-y-3">
          <label className="block text-sm font-medium">Ask the API</label>
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
              {loading ? 'Sending...' : 'Send'}
            </button>

            <button
              type="button"
              onClick={() => { setQuestion('What does your project do?'); setResponseText(null); setError(null); }}
              className="inline-flex items-center gap-2 px-3 py-2 border rounded"
            >
              <Terminal className="w-4 h-4" />
              Reset
            </button>
          </div>
        </form>

        <div className="mt-4">
          <h4 className="font-semibold">Response</h4>
          {loading && <p className="text-sm text-slate-500">Waiting for response…</p>}
          {error && <pre className="bg-rose-50 text-rose-700 p-2 rounded mt-2">{error}</pre>}
          {responseText && <pre className="bg-slate-50 p-2 rounded mt-2">{responseText}</pre>}
        </div>
      </div>
    </div>
  );
};

export default Demo;
