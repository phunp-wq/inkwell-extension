import { dark } from '@/lib/theme';
import browser from 'webextension-polyfill';

export default function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{ padding: '24px 20px' }}>
      <div style={{
        padding: 14, borderRadius: 8,
        background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.18)',
        color: '#F87171', fontSize: 12, lineHeight: 1.5, marginBottom: 14,
      }}>
        {message}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onRetry} style={{
          flex: 1, padding: '9px 14px', borderRadius: 6,
          background: dark.primary, border: 'none', color: '#fff',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>Back</button>
        <button onClick={() => browser.runtime.openOptionsPage()} style={{
          padding: '9px 14px', borderRadius: 6,
          background: 'transparent', color: 'var(--text-2)',
          border: '1px solid var(--border)',
          fontSize: 12, fontWeight: 500, cursor: 'pointer',
        }}>Settings</button>
      </div>
    </div>
  );
}
