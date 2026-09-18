const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 13h4v7H3zM10 8h4v12h-4zM17 3h4v17h-4z' },
  { id: 'syllabus', label: 'Mastery', icon: 'M4 4h16v3H4zM4 10.5h16v3H4zM4 17h10v3H4z' },
  { id: 'priority', label: 'Priority', icon: 'M12 2l2.4 7.4H22l-6.2 4.5L18.2 21 12 16.3 5.8 21l2.4-7.1L2 9.4h7.6z' },
  { id: 'studyplan', label: 'Study plan', icon: 'M4 5h16v2H4zM4 11h10v2H4zM4 17h13v2H4z' },
  { id: 'quiz', label: 'Quiz', icon: 'M9 17a3 3 0 106 0 3 3 0 00-6 0zM12 3a5 5 0 00-5 5h2a3 3 0 116 0c0 1.7-1.3 2.4-2.2 3.1-.9.7-1.8 1.5-1.8 3.4h2c0-1 .5-1.5 1.4-2.2C15.4 11.5 17 10.3 17 8a5 5 0 00-5-5z' },
  { id: 'revision', label: 'Revision', icon: 'M12 4a8 8 0 108 8h-2a6 6 0 11-6-6V2L8 6l4 4V4z' },
];

function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside
      style={{
        width: 84,
        flexShrink: 0,
        background: 'var(--dark)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 0',
      }}
    >
      <div
        style={{
          width: 38, height: 38, borderRadius: 10, background: 'var(--lime)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 800, color: 'var(--dark)', marginBottom: 40,
        }}
      >
        B
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={item.label}
              style={{
                width: 48, height: 48, borderRadius: 12, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                background: active ? 'rgba(211,234,118,0.12)' : 'transparent',
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill={active ? 'var(--lime)' : 'rgba(255,255,255,0.45)'}>
                <path d={item.icon} />
              </svg>
              {active && (
                <span style={{ position: 'absolute', left: -12, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, borderRadius: 2, background: 'var(--lime)' }} />
              )}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          width: 40, height: 40, borderRadius: '50%', background: 'var(--blue)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'var(--dark)',
        }}
      >
        RS
      </div>
    </aside>
  );
}

export default Sidebar;