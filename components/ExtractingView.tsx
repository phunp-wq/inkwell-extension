import { dark } from '@/lib/theme';
import ExtUrlBar from './ExtUrlBar';

export default function ExtractingView({
  url, stage, summaryText,
}: {
  url: string;
  stage: 'fetching' | 'ai';
  summaryText: string;
}) {
  const extracted = stage === 'ai';
  return (
    <>
      <ExtUrlBar url={url} status="extracting" />
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {extracted ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5" stroke={dark.success} strokeWidth="1.3"/>
                <path d="M4.5 7l1.8 1.8L9.5 5.5" stroke={dark.success} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <div style={{ width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: dark.primary,
                  animation: 'extPulse 1.4s ease infinite',
                }} />
              </div>
            )}
            <span style={{
              fontSize: 12,
              color: extracted ? 'var(--text-2)' : 'var(--text-1)',
              fontWeight: extracted ? 400 : 500,
            }}>Page content loaded</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {extracted ? (
              <div style={{ width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: dark.primary,
                  animation: 'extPulse 1.4s ease infinite',
                }} />
              </div>
            ) : (
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                border: '1.3px solid var(--border)',
              }} />
            )}
            <span style={{
              fontSize: 12,
              color: extracted ? 'var(--text-1)' : 'var(--text-3)',
              fontWeight: extracted ? 500 : 400,
            }}>Generating summary…</span>
          </div>
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
          padding: 14,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
            fontSize: 11, fontWeight: 600, color: dark.primary,
            textTransform: 'uppercase', letterSpacing: '.03em',
          }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <rect x="1.5" y="1.5" width="11" height="11" rx="2.5" stroke={dark.primary} strokeWidth="1.2"/>
              <path d="M4.5 5h5M4.5 7h3.5" stroke={dark.primary} strokeWidth="1" strokeLinecap="round"/>
            </svg>
            AI Summary
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-2)', margin: 0, minHeight: 19 }}>
            {summaryText}
            {extracted && (
              <span style={{
                display: 'inline-block', width: 2, height: 13, background: dark.primary,
                verticalAlign: 'text-bottom', marginLeft: 1,
                animation: 'extBlink .7s step-end infinite',
              }} />
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          {[52, 72, 60].map((w, i) => (
            <div key={i} style={{
              width: w, height: 22, borderRadius: 4,
              background: 'var(--shimmer-bg)',
              animation: `extShimmer 1.5s ease ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>
    </>
  );
}
