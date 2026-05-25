export default function ExtHeader({ darkMode, toggleDark }: { darkMode: boolean; toggleDark: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src="/logo.svg" width={18} height={18} style={{ borderRadius: 5, flexShrink: 0, display: 'block' }} alt="Inkwell" />
        <span style={{
          fontSize: 13, fontWeight: 600, color: 'var(--text-1)',
          letterSpacing: '-.01em',
        }}>Inkwell</span>
      </div>
      <button
        onClick={toggleDark}
        style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          color: 'var(--text-3)', display: 'flex', padding: 2,
        }}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2.8" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M8 2.5v1.2M8 12.3v1.2M2.5 8h1.2M12.3 8h1.2M4.3 4.3l.85.85M10.85 10.85l.85.85M11.7 4.3l-.85.85M5.15 10.85l-.85.85" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 9.2A5.5 5.5 0 016.8 2.5a5.5 5.5 0 106.7 6.7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
}
