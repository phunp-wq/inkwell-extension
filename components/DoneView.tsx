import { useState } from 'react';
import browser from 'webextension-polyfill';
import { dark } from '@/lib/theme';
import ExtUrlBar from './ExtUrlBar';
import { toggleFavorite } from '@/lib/pipeline';
import { getSettings } from '@/lib/storage';

type Result = {
  id: string;
  url: string;
  title: string;
  summary: string;
  tags: string[];
  category: string;
};

export default function DoneView({ result }: { result: Result }) {
  const [starred, setStarred] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleStar = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const r = await toggleFavorite(result.id);
      setStarred(r.favorite);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const handleOpen = async () => {
    const { apiUrl } = await getSettings();
    await browser.tabs.create({ url: `${apiUrl}/article/${result.id}` });
    window.close();
  };

  return (
    <>
      <ExtUrlBar url={result.url} status="done" />
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
          borderRadius: 6, marginBottom: 14,
          background: dark.successBg, border: `1px solid ${dark.successBorder}`,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke={dark.success} strokeWidth="1.3"/>
            <path d="M5.5 8l1.8 1.8L10.5 6" stroke={dark.success} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 12, fontWeight: 500, color: dark.success }}>
            Saved to your knowledge base
          </span>
        </div>

        <h3 style={{
          fontSize: 15, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.35,
          letterSpacing: '-.01em', margin: '0 0 10px',
        }}>{result.title}</h3>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
          padding: 14, marginBottom: 14,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
            fontSize: 11, fontWeight: 600, color: dark.primary,
            textTransform: 'uppercase', letterSpacing: '.03em',
          }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <rect x="1.5" y="1.5" width="11" height="11" rx="2.5" stroke={dark.primary} strokeWidth="1.2"/>
              <path d="M4.5 5h5M4.5 7h3.5M4.5 9h4" stroke={dark.primary} strokeWidth="1" strokeLinecap="round"/>
            </svg>
            AI Summary
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-2)', margin: 0 }}>
            {result.summary}
          </p>
        </div>

        {result.tags.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {result.tags.map(t => (
              <span key={t} style={{
                fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 4,
                background: 'var(--tag-bg)', color: 'var(--text-2)',
              }}>{t}</span>
            ))}
          </div>
        )}

        {result.category && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', padding: '4px 10px',
            borderRadius: 4, fontSize: 11, fontWeight: 600, color: dark.categoryText,
            background: dark.categoryBg, border: `1px solid ${dark.categoryBorder}`,
          }}>{result.category}</div>
        )}

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button onClick={handleOpen} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '9px 14px', borderRadius: 6,
            background: dark.primary, border: 'none', color: '#fff',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            Open in Inkwell
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M10.5 7.5v3a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h3M8 2h4v4M6 8l6-6" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={handleStar} disabled={busy} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: 6,
            background: starred ? 'rgba(234,179,8,.1)' : 'transparent',
            cursor: busy ? 'wait' : 'pointer',
            border: `1px solid ${starred ? 'rgba(234,179,8,.3)' : 'var(--border)'}`,
            color: starred ? dark.warning : 'var(--text-3)',
          }} aria-label={starred ? 'Unstar' : 'Star'}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill={starred ? 'currentColor' : 'none'}>
              <path d="M8 2.5l1.65 3.35 3.7.54-2.68 2.6.63 3.7L8 10.87l-3.3 1.82.63-3.7-2.68-2.6 3.7-.54z"
                    stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
