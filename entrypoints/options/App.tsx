import { useEffect, useState } from 'react';
import { dark } from '@/lib/theme';
import { getSettings, saveSettings } from '@/lib/storage';

export default function App() {
  const [apiUrl, setApiUrl] = useState('');
  const [token, setToken] = useState('');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    getSettings().then(s => {
      setApiUrl(s.apiUrl);
      setToken(s.token);
    });
  }, []);

  const handleSave = async () => {
    await saveSettings({ apiUrl, token });
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${apiUrl.replace(/\/+$/, '')}/api/recent?limit=1`, { headers });
      if (res.ok) setTestResult({ ok: true, msg: `Connected (${res.status})` });
      else setTestResult({ ok: false, msg: `HTTP ${res.status}` });
    } catch (e: any) {
      setTestResult({ ok: false, msg: e.message || 'Network error' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{
      maxWidth: 520, margin: '60px auto', padding: '0 24px',
      color: dark.text1,
    }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 4 }}>
        Inkwell Settings
      </h1>
      <p style={{ fontSize: 13, color: dark.text3, marginBottom: 32, marginTop: 0 }}>
        Point the extension at your Inkwell backend.
      </p>

      <Field label="API URL" hint="e.g. http://localhost:3777 or your Railway URL">
        <input
          value={apiUrl} onChange={e => setApiUrl(e.target.value)}
          placeholder="http://localhost:3777"
          style={inputStyle}
        />
      </Field>

      <Field label="API Token" hint="Required only if the server enforces INKWELL_API_TOKEN">
        <input
          value={token} onChange={e => setToken(e.target.value)}
          type="password" placeholder="Leave empty for unauthenticated dev"
          style={inputStyle}
        />
      </Field>

      <div style={{ display: 'flex', gap: 10, marginTop: 28, alignItems: 'center' }}>
        <button onClick={handleSave} style={primaryBtn}>Save</button>
        <button onClick={handleTest} disabled={testing} style={secondaryBtn}>
          {testing ? 'Testing…' : 'Test connection'}
        </button>
        {savedAt && (
          <span style={{ fontSize: 12, color: dark.success }}>Saved</span>
        )}
        {testResult && (
          <span style={{
            fontSize: 12, color: testResult.ok ? dark.success : '#F87171',
          }}>{testResult.msg}</span>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 6,
  background: dark.inputBg, border: `1px solid ${dark.border}`,
  color: dark.text1, fontSize: 13,
};

const primaryBtn: React.CSSProperties = {
  padding: '9px 18px', borderRadius: 6,
  background: dark.primary, color: '#fff', border: 'none',
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
};

const secondaryBtn: React.CSSProperties = {
  padding: '9px 18px', borderRadius: 6,
  background: 'transparent', color: dark.text2,
  border: `1px solid ${dark.border}`,
  fontSize: 13, fontWeight: 500, cursor: 'pointer',
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: dark.text2, textTransform: 'uppercase',
        letterSpacing: '.04em', marginBottom: 8,
      }}>{label}</div>
      {children}
      {hint && (
        <div style={{ fontSize: 11, color: dark.text3, marginTop: 6 }}>{hint}</div>
      )}
    </div>
  );
}
