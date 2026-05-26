import React, { useState } from 'react'

const NAV_ITEMS = [
  {
    id: 'dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    label: 'Dashboard',
  },
  {
    id: 'projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" />
      </svg>
    ),
    label: 'Projects',
  },
  {
    id: 'clients',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-1a6 6 0 0 1 6-6h0" strokeLinecap="round" />
        <circle cx="17" cy="11" r="3" />
        <path d="M21 21v-1a4 4 0 0 0-4-4h0" strokeLinecap="round" />
      </svg>
    ),
    label: 'Clients',
  },
  {
    id: 'analytics',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path d="M4 20L8 14l4 3 4-6 4 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Analytics',
  },
]

const SideBar = () => {
  const [active, setActive] = useState('projects')

  return (
    <aside
      style={{
        width: '60px',
        minHeight: '100vh',
        background: '#0a0a0a',
        borderRight: '1px solid #1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
        paddingBottom: '20px',
        gap: '4px',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: '32px',
          height: '32px',
          background: '#e8ff47',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          flexShrink: 0,
        }}
      >
        <svg viewBox="0 0 24 24" fill="#0a0a0a" className="w-4 h-4" style={{ width: '16px', height: '16px' }}>
          <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
        </svg>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            title={item.label}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: active === item.id ? '#1a1a1a' : 'transparent',
              color: active === item.id ? '#e8ff47' : '#555',
              transition: 'all 0.15s ease',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (active !== item.id) {
                ;(e.currentTarget as HTMLButtonElement).style.color = '#aaa'
                ;(e.currentTarget as HTMLButtonElement).style.background = '#111'
              }
            }}
            onMouseLeave={(e) => {
              if (active !== item.id) {
                ;(e.currentTarget as HTMLButtonElement).style.color = '#555'
                ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              }
            }}
          >
            {item.icon}
            {active === item.id && (
              <span
                style={{
                  position: 'absolute',
                  right: '-1px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '2px',
                  height: '20px',
                  background: '#e8ff47',
                  borderRadius: '2px 0 0 2px',
                }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom: settings */}
      <button
        title="Settings"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          color: '#444',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.color = '#aaa'
          ;(e.currentTarget as HTMLButtonElement).style.background = '#111'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.color = '#444'
          ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: '18px', height: '18px' }}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
    </aside>
  )
}

export default SideBar