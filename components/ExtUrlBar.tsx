import { dark } from '@/lib/theme';

type Status = 'extracting' | 'done' | undefined;

const STATUS_COLOR: Record<NonNullable<Status>, { bg: string; text: string; label: string }> = {
  extracting: { bg: dark.warningBg, text: dark.warning, label: 'Extracting…' },
  done:       { bg: dark.successBg, text: dark.success, label: 'Saved' },
};

export default function ExtUrlBar({ url, status }: { url: string; status?: Status }) {
  const s = status ? STATUS_COLOR[status] : null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, margin: '12px 16px',
      padding: '8px 10px', borderRadius: 6,
      background: 'var(--input-bg)',
      border: '1px solid var(--border)',
    }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--text-3)' }}>
        <path d="M6.5 9.5a3 3 0 004.24 0l2-2a3 3 0 00-4.24-4.24l-1 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M9.5 6.5a3 3 0 00-4.24 0l-2 2a3 3 0 004.24 4.24l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
      <span style={{
        flex: 1, fontSize: 12, color: 'var(--text-2)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{url}</span>
      {s && (
        <span style={{
          fontSize: 10, fontWeight: 600, color: s.text, background: s.bg,
          padding: '2px 7px', borderRadius: 4, flexShrink: 0, letterSpacing: '.02em',
        }}>{s.label}</span>
      )}
    </div>
  );
}
