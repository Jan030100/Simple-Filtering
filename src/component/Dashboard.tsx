import React from 'react'
import SideBar from './SideBar'
import ProjectTable from './ProjectTable'

const Dashboard = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#0d0d0d',
        fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",
        overflow: 'hidden',
      }}
    >
      <SideBar />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {/* Top header bar */}
        <header
          style={{
            height: '56px',
            borderBottom: '1px solid #1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#333', fontSize: '13px', letterSpacing: '0.05em' }}>WORKSPACE</span>
            <span style={{ color: '#333' }}>/</span>
            <span style={{ color: '#e8ff47', fontSize: '13px', letterSpacing: '0.05em', fontWeight: 500 }}>
              PROJECTS
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 6px #22c55e88',
              }}
            />
            <span style={{ color: '#444', fontSize: '12px', letterSpacing: '0.08em' }}>LIVE</span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              JD
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '28px 24px',
          }}
        >
          {/* Page title row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '28px',
            }}
          >
            <div>
              <p style={{ color: '#444', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '4px' }}>
                PROJECT TRACKER
              </p>
              <h1
                style={{
                  color: '#f0f0f0',
                  fontSize: '26px',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                }}
              >
                Client Projects
              </h1>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#444', fontSize: '11px', letterSpacing: '0.1em' }}>
                {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
              </span>
            </div>
          </div>

          <ProjectTable />
        </main>
      </div>
    </div>
  )
}

export default Dashboard