import { useEffect, useState } from 'react';
import { dark } from '@/lib/theme';
import { fetchRecent, type RecentItem } from '@/lib/pipeline';

const CATEGORY_DOT: Record<string, string> = {
  Development: '#3B82F6',
  Design:      '#22C55E',
  Product:     '#F97316',
  'AI-ML':     '#A855F7',
  Business:    '#EAB308',
  Research:    '#06B6D4',
  Science:     '#14B8A6',
  Other:       '#5C5C5F',
};

export default function IdleView({ initialUrl, onSave, onOpenArticle }: {
  initialUrl?: string;
  onSave: (url: string) => void;
  onOpenArticle: (id: string) => void;
}) {
  const [pasted, setPasted] = useState(initialUrl || '');
  const [recent, setRecent] = useState<RecentItem[]>([]);

  useEffect(() => {
    if (initialUrl) setPasted(initialUrl);
  }, [initialUrl]);

  useEffect(() => {
    fetchRecent(3).then(setRecent).catch(() => setRecent([]));
  }, []);

  const trySave = () => {
    const v = pasted.trim();
    if (!v) return;
    onSave(v);
  };

  return (
    <div>
      <div style={{
        padding: '40px 32px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, marginBottom: 16,
          background: 'var(--input-bg)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-3)',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 14.5a4.5 4.5 0 006.36 0l3-3a4.5 4.5 0 00-6.36-6.36l-1.5 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M15 9.5a4.5 4.5 0 00-6.36 0l-3 3a4.5 4.5 0 006.36 6.36l1.5-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>

        <h3 style={{
          fontSize: 14, fontWeight: 600, color: 'var(--text-1)', margin: '0 0 6px',
          letterSpacing: '-.01em',
        }}>No page to save</h3>
        <p style={{
          fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, maxWidth: 220, margin: '0 0 20px',
        }}>Navigate to an article or blog post, then click Inkwell to save it.</p>

        <div style={{ width: '100%', display: 'flex', gap: 8 }}>
          <input
            value={pasted}
            onChange={e => setPasted(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') trySave(); }}
            placeholder="Paste a URL…"
            style={{
              flex: 1, fontSize: 12, color: 'var(--text-1)',
              padding: '8px 10px', borderRadius: 6,
              background: 'var(--input-bg)', border: '1px solid var(--border)',
            }}
          />
          <button onClick={trySave} style={{
            padding: '8px 14px', borderRadius: 6,
            background: dark.primary, border: 'none', color: '#fff',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>Save</button>
        </div>
      </div>

      {recent.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--border)', padding: '10px 16px',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase',
            letterSpacing: '.04em', marginBottom: 8,
          }}>Recent</div>
          {recent.map((r) => (
            <div key={r.id} onClick={() => onOpenArticle(r.id)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
              cursor: 'pointer',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: CATEGORY_DOT[r.category || 'Other'] || 'var(--text-3)',
              }} />
              <span style={{
                fontSize: 12, color: 'var(--text-2)', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
              }}>{r.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
