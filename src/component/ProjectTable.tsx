import { useState, useRef, useEffect } from 'react'
import { data } from '../utils/data'

/* ─── tiny inline icon components ─── */
const ChevronDown = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const SortIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" />
  </svg>
)
const FilterIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
  </svg>
)
const DotsIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
)
const ChevronLeft = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ChevronRight = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ─── status config ─── */
const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  Completed:   { bg: '#0d2918', text: '#4ade80', dot: '#22c55e' },
  'In Progress': { bg: '#1a1a07', text: '#fde047', dot: '#eab308' },
  Pending:     { bg: '#1a0d0d', text: '#f87171', dot: '#ef4444' },
  default:     { bg: '#141414', text: '#888',    dot: '#555'    },
}
const getStatus = (s: string) => STATUS_CONFIG[s] ?? STATUS_CONFIG.default

/* ─── dropdown hook ─── */
function useOutsideClick(ref: React.RefObject<HTMLElement>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, cb])
}

/* ─── shared button style ─── */
const btnStyle = (active = false): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  background: active ? '#1a1a1a' : 'transparent',
  border: `1px solid ${active ? '#333' : '#222'}`,
  borderRadius: '6px',
  color: active ? '#e8ff47' : '#666',
  fontSize: '12px',
  letterSpacing: '0.05em',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  whiteSpace: 'nowrap' as const,
})

/* ─── main component ─── */
const ProjectTable = () => {
  const [projects, setProjects] = useState(data)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ name: '', country: '', email: '', project: '', status: '' })
  const [statusDropdownVisible, setStatusDropdownVisible] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 7

  const sortRef = useRef<HTMLDivElement>(null!)
  const filterRef = useRef<HTMLDivElement>(null!)
  useOutsideClick(sortRef, () => setDropdownVisible(false))
  useOutsideClick(filterRef, () => setFiltersVisible(false))

  /* ─── sort ─── */
  const sortProjects = (key: string) => {
    const dir = sortConfig?.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
    const sorted = [...projects].sort((a, b) => {
      const av = a[key] ?? ''
      const bv = b[key] ?? ''
      return dir === 'ascending' ? (av > bv ? 1 : -1) : (av > bv ? -1 : 1)
    })
    setProjects(sorted)
    setSortConfig({ key, direction: dir })
    setDropdownVisible(false)
    setCurrentPage(1)
  }

  /* ─── filter ─── */
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
    setCurrentPage(1)
  }

  /* ─── status change ─── */
  const handleStatusChange = (index: number, newStatus: string) => {
    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index
    const updated = filteredProjects.map((p, i) =>
      i === globalIndex
        ? { ...p, status: newStatus, progress: newStatus === 'Completed' ? '100%' : p.progress }
        : p
    )
    // re-apply to full data
    const ids = updated.map((p) => p.email)
    setProjects((prev) =>
      prev.map((p) => {
        const match = updated.find((u) => u.email === p.email)
        return match ?? p
      })
    )
    setStatusDropdownVisible(null)
  }

  /* ─── filtered set ─── */
  const filteredProjects = projects.filter(
    (p) =>
      (searchQuery === '' ||
        Object.values(p).some((v) => String(v).toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (filters.name === '' || p.client?.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.country === '' || p.country?.toLowerCase().includes(filters.country.toLowerCase())) &&
      (filters.email === '' || p.email?.toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.project === '' || p.project?.toLowerCase().includes(filters.project.toLowerCase())) &&
      (filters.status === '' || p.status?.toLowerCase().includes(filters.status.toLowerCase()))
  )

  /* ─── pagination ─── */
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  /* ─── progress parse ─── */
  const parseProgress = (p: string) => parseInt(p?.replace('%', '') ?? '0', 10)

  /* ─── col header ─── */
  const ColHeader = ({ label, sortKey }: { label: string; sortKey?: string }) => (
    <th
      onClick={sortKey ? () => sortProjects(sortKey) : undefined}
      style={{
        padding: '10px 16px',
        textAlign: 'left',
        fontSize: '11px',
        letterSpacing: '0.1em',
        color: sortConfig?.key === sortKey ? '#e8ff47' : '#444',
        fontWeight: 500,
        cursor: sortKey ? 'pointer' : 'default',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #1a1a1a',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {label.toUpperCase()}
        {sortConfig?.key === sortKey && (
          <span style={{ opacity: 0.7, fontSize: '10px' }}>
            {sortConfig?.direction === 'ascending' ? '↑' : '↓'}
          </span>
        )}
      </span>
    </th>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Toolbar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <svg
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#444' }}
            width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            style={{
              width: '100%',
              paddingLeft: '32px',
              paddingRight: '12px',
              paddingTop: '7px',
              paddingBottom: '7px',
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: '6px',
              color: '#ccc',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ flex: 1 }} />

        {/* Sort dropdown */}
        <div ref={sortRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownVisible(!dropdownVisible)}
            style={btnStyle(dropdownVisible)}
            onMouseEnter={(e) => { if (!dropdownVisible) (e.currentTarget as HTMLButtonElement).style.borderColor = '#333' }}
            onMouseLeave={(e) => { if (!dropdownVisible) (e.currentTarget as HTMLButtonElement).style.borderColor = '#222' }}
          >
            <SortIcon />
            SORT
            <ChevronDown />
          </button>
          {dropdownVisible && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              background: '#111', border: '1px solid #222', borderRadius: '8px',
              minWidth: '140px', zIndex: 50, overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}>
              {[['client', 'Name'], ['country', 'Country'], ['date', 'Date'], ['status', 'Status']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => sortProjects(key)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '9px 14px', background: 'transparent',
                    border: 'none', cursor: 'pointer',
                    color: sortConfig?.key === key ? '#e8ff47' : '#888',
                    fontSize: '12px', letterSpacing: '0.06em',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {label.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter dropdown */}
        <div ref={filterRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setFiltersVisible(!filtersVisible)}
            style={btnStyle(filtersVisible || activeFiltersCount > 0)}
            onMouseEnter={(e) => { if (!filtersVisible) (e.currentTarget as HTMLButtonElement).style.borderColor = '#333' }}
            onMouseLeave={(e) => { if (!filtersVisible) (e.currentTarget as HTMLButtonElement).style.borderColor = activeFiltersCount > 0 ? '#333' : '#222' }}
          >
            <FilterIcon />
            FILTER
            {activeFiltersCount > 0 && (
              <span style={{
                background: '#e8ff47', color: '#0a0a0a', borderRadius: '4px',
                padding: '1px 5px', fontSize: '10px', fontWeight: 700, lineHeight: 1.4,
              }}>
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown />
          </button>
          {filtersVisible && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              background: '#111', border: '1px solid #222', borderRadius: '8px',
              padding: '16px', zIndex: 50, minWidth: '220px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              {[
                { key: 'name', label: 'Name' },
                { key: 'country', label: 'Country' },
                { key: 'email', label: 'Email' },
                { key: 'project', label: 'Project' },
                { key: 'status', label: 'Status' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={{ display: 'block', color: '#444', fontSize: '10px', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    {label.toUpperCase()}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={filters[key as keyof typeof filters]}
                    onChange={handleFilterChange}
                    style={{
                      width: '100%', padding: '6px 10px',
                      background: '#0a0a0a', border: '1px solid #222',
                      borderRadius: '5px', color: '#ccc', fontSize: '12px',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => setFilters({ name: '', country: '', email: '', project: '', status: '' })}
                  style={{
                    marginTop: '4px', padding: '6px', background: '#1a1a1a',
                    border: '1px solid #333', borderRadius: '5px', color: '#888',
                    fontSize: '11px', cursor: 'pointer', letterSpacing: '0.06em',
                  }}
                >
                  CLEAR ALL
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ display: 'flex', gap: '1px', overflow: 'hidden', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
        {[
          { label: 'TOTAL', value: filteredProjects.length },
          { label: 'COMPLETED', value: filteredProjects.filter((p) => p.status === 'Completed').length },
          { label: 'IN PROGRESS', value: filteredProjects.filter((p) => p.status === 'In Progress').length },
          { label: 'OTHER', value: filteredProjects.filter((p) => p.status !== 'Completed' && p.status !== 'In Progress').length },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: 1, padding: '10px 16px',
              background: '#0f0f0f',
              display: 'flex', flexDirection: 'column', gap: '2px',
            }}
          >
            <span style={{ color: '#333', fontSize: '10px', letterSpacing: '0.12em' }}>{stat.label}</span>
            <span style={{ color: '#e0e0e0', fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div
        style={{
          border: '1px solid #1a1a1a',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#0a0a0a' }}>
                <th style={{ padding: '10px 16px', width: '40px', borderBottom: '1px solid #1a1a1a' }}>
                  <input type="checkbox" style={{ accentColor: '#e8ff47' }} />
                </th>
                <ColHeader label="Client" sortKey="client" />
                <ColHeader label="Country" sortKey="country" />
                <ColHeader label="Email" />
                <ColHeader label="Project" sortKey="project" />
                <ColHeader label="Progress" />
                <ColHeader label="Status" sortKey="status" />
                <ColHeader label="Date" sortKey="date" />
                <th style={{ padding: '10px 16px', borderBottom: '1px solid #1a1a1a', width: '40px' }} />
              </tr>
            </thead>
            <tbody>
              {currentProjects.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '48px', textAlign: 'center', color: '#333', fontSize: '13px', letterSpacing: '0.1em' }}>
                    NO RECORDS FOUND
                  </td>
                </tr>
              ) : (
                currentProjects.map((project, index) => {
                  const progress = parseProgress(project.progress)
                  const st = getStatus(project.status)
                  return (
                    <tr
                      key={index}
                      style={{
                        borderBottom: '1px solid #141414',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#0f0f0f')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: '12px 16px' }}>
                        <input type="checkbox" style={{ accentColor: '#e8ff47' }} />
                      </td>

                      {/* Client */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px', height: '32px', borderRadius: '50%',
                              overflow: 'hidden', flexShrink: 0,
                              border: '1px solid #222',
                              background: '#1a1a1a',
                            }}
                          >
                            {project.image ? (
                              <img src={project.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{
                                width: '100%', height: '100%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#555', fontSize: '12px', fontWeight: 600,
                              }}>
                                {project.client?.[0]?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span style={{ color: '#d0d0d0', fontSize: '13px', fontWeight: 500 }}>
                            {project.client}
                          </span>
                        </div>
                      </td>

                      {/* Country */}
                      <td style={{ padding: '12px 16px', color: '#666', fontSize: '12px', letterSpacing: '0.04em' }}>
                        {project.country}
                      </td>

                      {/* Email */}
                      <td style={{ padding: '12px 16px', color: '#555', fontSize: '12px', letterSpacing: '0.02em' }}>
                        {project.email}
                      </td>

                      {/* Project */}
                      <td style={{ padding: '12px 16px', color: '#bbb', fontSize: '12px', maxWidth: '160px' }}>
                        <span style={{
                          display: 'block', overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {project.project}
                        </span>
                      </td>

                      {/* Progress */}
                      <td style={{ padding: '12px 16px', minWidth: '120px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#333', fontSize: '10px', letterSpacing: '0.05em' }}>
                              {progress}%
                            </span>
                          </div>
                          <div style={{ height: '3px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${progress}%`,
                                height: '100%',
                                background: progress === 100 ? '#22c55e' : progress > 60 ? '#e8ff47' : '#888',
                                borderRadius: '2px',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '3px 9px', borderRadius: '4px',
                          background: st.bg, color: st.text,
                          fontSize: '11px', letterSpacing: '0.06em', fontWeight: 500,
                        }}>
                          <span style={{
                            width: '5px', height: '5px', borderRadius: '50%',
                            background: st.dot, flexShrink: 0,
                          }} />
                          {project.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '12px 16px', color: '#444', fontSize: '11px', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                        {project.date}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px', position: 'relative' }}>
                        <button
                          onClick={() => setStatusDropdownVisible(statusDropdownVisible === index ? null : index)}
                          style={{
                            background: 'transparent', border: 'none',
                            color: '#444', cursor: 'pointer', padding: '4px',
                            borderRadius: '4px', display: 'flex', alignItems: 'center',
                            transition: 'color 0.1s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#888')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
                        >
                          <DotsIcon />
                        </button>
                        {statusDropdownVisible === index && (
                          <div style={{
                            position: 'absolute', top: 'calc(100% - 8px)', right: '8px',
                            background: '#111', border: '1px solid #222',
                            borderRadius: '8px', zIndex: 50, overflow: 'hidden', minWidth: '140px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                          }}>
                            <div style={{ padding: '6px 10px', borderBottom: '1px solid #1a1a1a' }}>
                              <span style={{ color: '#333', fontSize: '10px', letterSpacing: '0.1em' }}>SET STATUS</span>
                            </div>
                            {['In Progress', 'Completed', 'Pending'].map((s) => {
                              const sc = getStatus(s)
                              return (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(index, s)}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    width: '100%', textAlign: 'left', padding: '9px 12px',
                                    background: 'transparent', border: 'none',
                                    cursor: 'pointer', color: '#888', fontSize: '12px',
                                    transition: 'background 0.1s',
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')}
                                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                  <span style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    background: sc.dot, flexShrink: 0,
                                  }} />
                                  {s}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 16px', borderTop: '1px solid #141414', background: '#0a0a0a',
          }}
        >
          <span style={{ color: '#333', fontSize: '11px', letterSpacing: '0.06em' }}>
            {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredProjects.length)} of {filteredProjects.length}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={{
                width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: '1px solid #222', borderRadius: '5px',
                color: currentPage === 1 ? '#2a2a2a' : '#666', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.1s',
              }}
            >
              <ChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce<(number | '…')[]>((acc, p, i, arr) => {
                if (i > 0 && typeof arr[i - 1] === 'number' && (arr[i - 1] as number) < p - 1) acc.push('…')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '…' ? (
                  <span key={`ellipsis-${i}`} style={{ color: '#333', fontSize: '12px', padding: '0 4px' }}>…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    style={{
                      width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: currentPage === p ? '#e8ff47' : 'transparent',
                      border: `1px solid ${currentPage === p ? '#e8ff47' : '#222'}`,
                      borderRadius: '5px',
                      color: currentPage === p ? '#0a0a0a' : '#666',
                      fontSize: '12px', cursor: 'pointer',
                      fontWeight: currentPage === p ? 700 : 400,
                      transition: 'all 0.1s',
                    }}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={{
                width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: '1px solid #222', borderRadius: '5px',
                color: currentPage === totalPages ? '#2a2a2a' : '#666', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.1s',
              }}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectTable