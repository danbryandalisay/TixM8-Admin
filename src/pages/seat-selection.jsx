import { useState, useMemo, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// ── Cinema zone config ────────────────────────────────────
// In a movie theater: middle rows = best view = most expensive
const ZONES = [
  { id: 'front',   label: 'Front',   rows: ['A', 'B', 'C'],   price: 250, color: '#9b8ea8' }, // too close — cheapest
  { id: 'regular', label: 'Regular', rows: ['D', 'E', 'F'],   price: 400, color: '#52c48a' }, // decent view
  { id: 'premium', label: 'Premium', rows: ['G', 'H'],        price: 600, color: '#6c8ef5' }, // best viewing angle
  { id: 'gold',    label: 'Gold',    rows: ['I', 'J'],        price: 800, color: '#f5a623' }, // back — recliner/gold class
]

const ALL_ROWS      = ZONES.flatMap(z => z.rows)
const COLS_PER_SIDE = 7    // 1–7 | aisle | 8–14  → 14 seats per row (cinema style)
const TOTAL_COLS    = COLS_PER_SIDE * 2
const COUPLES       = new Set(['J7', 'J8'])   // couple seats in last row center

function seedOccupied(seed = 1) {
  let s = seed
  const rng = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 4294967296 }
  const occupied = new Set()
  ALL_ROWS.forEach(row => {
    for (let col = 1; col <= TOTAL_COLS; col++) {
      if (rng() < 0.42) occupied.add(`${row}${col}`)
    }
  })
  return occupied
}

function buildSeats(occupiedSet) {
  const seats = {}
  ZONES.forEach(zone => {
    zone.rows.forEach(row => {
      for (let col = 1; col <= TOTAL_COLS; col++) {
        const id = `${row}${col}`
        seats[id] = {
          id, row, col,
          zone:    zone.id,
          price:   zone.price,
          color:   zone.color,
          status:  occupiedSet.has(id) ? 'occupied' : 'available',
          couple:  COUPLES.has(id),
        }
      }
    })
  })
  return seats
}

const currency = (n) => `₱${n.toLocaleString()}`

// ══════════════════════════════════════════════════════════
function SeatSelection() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  const event = state?.event ?? {
    id: 0, name: 'Sample Movie', date: 'TBD', time: 'TBD', venue: 'TBD',
  }

  const occupiedSet  = useMemo(() => seedOccupied(event.id ?? 1), [event.id])
  const seats        = useMemo(() => buildSeats(occupiedSet), [occupiedSet])

  const [selected,    setSelected]    = useState(new Set())
  const [hoveredZone, setHoveredZone] = useState(null)

  const toggleSeat = useCallback((seatId) => {
    const seat = seats[seatId]
    if (!seat || seat.status === 'occupied') return
    setSelected(prev => {
      const next = new Set(prev)
      next.has(seatId) ? next.delete(seatId) : next.add(seatId)
      return next
    })
  }, [seats])

  const selectedList = useMemo(() =>
    [...selected]
      .map(id => seats[id])
      .sort((a, b) => a.row.localeCompare(b.row) || a.col - b.col),
    [selected, seats]
  )

  const total = selectedList.reduce((s, seat) => s + seat.price, 0)

  const byZone = useMemo(() => {
    const map = {}
    selectedList.forEach(seat => {
      if (!map[seat.zone]) map[seat.zone] = { zone: ZONES.find(z => z.id === seat.zone), seats: [] }
      map[seat.zone].seats.push(seat)
    })
    return Object.values(map)
  }, [selectedList])

  const getSeatStyle = (seat) => {
    const isSelected  = selected.has(seat.id)
    const isOccupied  = seat.status === 'occupied'
    const isHighlight = hoveredZone === seat.zone && !isOccupied

    if (isOccupied) return {
      background: 'var(--surface2, #2a2a35)',
      border: '1px solid var(--border, #3a3a4a)',
      cursor: 'not-allowed', opacity: 0.35,
    }
    if (isSelected) return {
      background: seat.color,
      border: '2px solid white',
      boxShadow: `0 0 0 2px ${seat.color}`,
      transform: 'scale(1.18)',
      cursor: 'pointer',
    }
    if (isHighlight) return {
      background: seat.color + '55',
      border: `1px solid ${seat.color}`,
      cursor: 'pointer',
    }
    return {
      background: seat.color + '1a',
      border: `1px solid ${seat.color}55`,
      cursor: 'pointer',
    }
  }

  // ── Render ─────────────────────────────────────────────
  return (
    <div style={{ color: 'var(--text)' }}>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        {[
          { n: 1, label: 'Select Seats' },
          { n: 2, label: 'Payment'      },
          { n: 3, label: 'Confirmation' },
        ].map((step, i) => (
          <div key={step.n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14,
                background: step.n === 1 ? 'var(--accent, #f5a623)' : 'var(--surface2, #2a2a35)',
                color:      step.n === 1 ? '#1a1200' : 'var(--text-2, #888)',
                border:     step.n === 1 ? 'none' : '1px solid var(--border, #444)',
              }}>{step.n}</div>
              <span style={{
                fontSize: 13, fontWeight: step.n === 1 ? 600 : 400,
                color: step.n === 1 ? 'var(--accent, #f5a623)' : 'var(--text-2, #888)',
              }}>{step.label}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1, margin: '0 12px', background: 'var(--border, #333)' }} />}
          </div>
        ))}
      </div>

      {/* Event info */}
      <div style={{
        padding: '12px 16px', marginBottom: 20, borderRadius: 10,
        background: 'var(--surface, #24243a)', border: '1px solid var(--border, #333)',
        display: 'flex', flexWrap: 'wrap', gap: '8px 24px', alignItems: 'center',
      }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--accent, #f5a623)' }}>
          🎬 {event.name}
        </span>
        <span style={{ fontSize: 13, color: 'var(--text-2, #aaa)' }}>📅 {event.date}</span>
        <span style={{ fontSize: 13, color: 'var(--text-2, #aaa)' }}>🕐 {event.time}</span>
        <span style={{ fontSize: 13, color: 'var(--text-2, #aaa)' }}>📍 {event.venue}</span>
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ── Seat map ───────────────────────────────────── */}
        <div style={{
          flex: '1 1 480px', borderRadius: 14, padding: '24px 20px',
          background: 'var(--surface, #24243a)', border: '1px solid var(--border, #333)',
          overflowX: 'auto',
        }}>

          {/* Screen */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            {/* Screen curve effect */}
            <div style={{
              display: 'inline-block', position: 'relative',
              width: '80%', maxWidth: 360,
            }}>
              <div style={{
                height: 6, borderRadius: '0 0 50% 50%',
                background: 'linear-gradient(90deg, transparent 2%, var(--accent,#f5a623)88 20%, var(--accent,#f5a623) 50%, var(--accent,#f5a623)88 80%, transparent 98%)',
                boxShadow: '0 2px 20px var(--accent,#f5a623)44',
              }} />
              <div style={{
                marginTop: 6, fontSize: 10, fontWeight: 700, letterSpacing: 4,
                color: 'var(--accent, #f5a623)', textTransform: 'uppercase', opacity: 0.7,
              }}>SCREEN</div>
            </div>
          </div>

          {/* Zone pricing banner */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 6,
            marginBottom: 20, flexWrap: 'wrap',
          }}>
            {ZONES.map(zone => (
              <div
                key={zone.id}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                style={{
                  padding: '3px 10px', borderRadius: 20,
                  background: hoveredZone === zone.id ? zone.color + '44' : zone.color + '18',
                  border: `1px solid ${zone.color}${hoveredZone === zone.id ? '' : '55'}`,
                  color: zone.color,
                  fontSize: 11, fontWeight: 700, cursor: 'default',
                  transition: 'all 0.15s',
                }}
              >
                {zone.label} · {currency(zone.price)}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div style={{ minWidth: 440 }}>
            {ZONES.map(zone => (
              <div
                key={zone.id}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
              >
                {zone.rows.map(row => (
                  <div key={row} style={{
                    display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5,
                  }}>
                    {/* Row label */}
                    <div style={{
                      width: 20, height: 20, flexShrink: 0, borderRadius: 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700,
                      color: zone.color, background: zone.color + '22',
                    }}>{row}</div>

                    {/* Left block */}
                    <div style={{ display: 'flex', gap: 3 }}>
                      {Array.from({ length: COLS_PER_SIDE }, (_, i) => {
                        const seat = seats[`${row}${i + 1}`]
                        return <SeatBtn key={seat.id} seat={seat} selected={selected} onClick={toggleSeat} getStyle={getSeatStyle} />
                      })}
                    </div>

                    {/* Aisle */}
                    <div style={{ width: 24, flexShrink: 0, textAlign: 'center' }}>
                      {/* Aisle column numbers hint */}
                    </div>

                    {/* Right block */}
                    <div style={{ display: 'flex', gap: 3 }}>
                      {Array.from({ length: COLS_PER_SIDE }, (_, i) => {
                        const seat = seats[`${row}${COLS_PER_SIDE + i + 1}`]
                        return <SeatBtn key={seat.id} seat={seat} selected={selected} onClick={toggleSeat} getStyle={getSeatStyle} />
                      })}
                    </div>

                    {/* Row label right side */}
                    <div style={{
                      width: 20, height: 20, flexShrink: 0, borderRadius: 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700,
                      color: zone.color, background: zone.color + '22',
                    }}>{row}</div>
                  </div>
                ))}

                {/* Zone separator */}
                <div style={{
                  height: 1, margin: '6px 0 10px',
                  background: `linear-gradient(90deg, transparent, ${zone.color}33, transparent)`,
                }} />
              </div>
            ))}
          </div>

          {/* Col numbers */}
          <div style={{ display: 'flex', gap: 5, marginTop: 4, paddingLeft: 25 }}>
            {Array.from({ length: COLS_PER_SIDE }, (_, i) => (
              <div key={i} style={{
                width: 22, textAlign: 'center',
                fontSize: 9, color: 'var(--text-3, #555)',
              }}>{i + 1}</div>
            ))}
            <div style={{ width: 24 }} />
            {Array.from({ length: COLS_PER_SIDE }, (_, i) => (
              <div key={i} style={{
                width: 22, textAlign: 'center',
                fontSize: 9, color: 'var(--text-3, #555)',
              }}>{COLS_PER_SIDE + i + 1}</div>
            ))}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '8px 20px',
            marginTop: 16, paddingTop: 14,
            borderTop: '1px solid var(--border, #333)',
          }}>
            {[
              { label: 'Available', bg: '#52c48a1a', border: '#52c48a55' },
              { label: 'Selected',  bg: '#f5a623',   border: 'white'     },
              { label: 'Occupied',  bg: 'var(--surface2,#2a2a35)', border: '#3a3a4a', opacity: 0.35 },
              { label: 'Couple 💑', bg: '#f5a62322', border: '#f5a62388' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 3,
                  background: item.bg, border: `1px solid ${item.border}`,
                  opacity: item.opacity ?? 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8,
                }} />
                <span style={{ fontSize: 11, color: 'var(--text-2, #888)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Booking summary ─────────────────────────────── */}
        <div style={{
          flex: '0 0 240px', borderRadius: 14, overflow: 'hidden',
          background: 'var(--surface, #24243a)', border: '1px solid var(--border, #333)',
          position: 'sticky', top: 16,
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid var(--border, #333)',
            background: 'var(--surface2, #1e1e2e)',
          }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Booking Summary</div>
            <div style={{ fontSize: 12, color: 'var(--text-2, #888)', marginTop: 2 }}>
              {selected.size} seat{selected.size !== 1 ? 's' : ''} selected
            </div>
          </div>

          {/* Seats */}
          <div style={{ padding: '12px 16px', minHeight: 100 }}>
            {selected.size === 0 ? (
              <div style={{
                textAlign: 'center', color: 'var(--text-2,#666)',
                fontSize: 12, padding: '20px 0',
              }}>
                Click a seat to select it
              </div>
            ) : (
              byZone.map(({ zone, seats: zSeats }) => (
                <div key={zone.id} style={{ marginBottom: 10 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 11, fontWeight: 700, color: zone.color, marginBottom: 4,
                  }}>
                    <span>{zone.label}</span>
                    <span>{currency(zone.price)} × {zSeats.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {zSeats.map(seat => (
                      <button
                        key={seat.id}
                        onClick={() => toggleSeat(seat.id)}
                        title="Remove"
                        style={{
                          padding: '2px 7px', borderRadius: 4, cursor: 'pointer',
                          background: zone.color + '22', border: `1px solid ${zone.color}66`,
                          color: zone.color, fontSize: 11, fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}
                      >
                        {seat.row}{seat.col}
                        <span style={{ opacity: 0.6, fontSize: 9 }}>✕</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid var(--border,#333)',
            background: 'var(--surface2, #1e1e2e)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-2,#aaa)' }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent,#f5a623)' }}>
                {currency(total)}
              </span>
            </div>
            {selected.size > 0 && (
              <div style={{ fontSize: 11, color: 'var(--text-2,#666)', marginTop: 4, textAlign: 'right' }}>
                {selected.size} ticket{selected.size !== 1 ? 's' : ''} · avg {currency(Math.round(total / selected.size))} ea.
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => {
                if (selected.size === 0) return
                navigate('/payment', { state: { event, selectedSeats: selectedList, total } })
              }}
              disabled={selected.size === 0}
              style={{
                width: '100%', padding: '10px', borderRadius: 8, border: 'none',
                fontWeight: 700, fontSize: 14, cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
                background: selected.size > 0 ? 'var(--accent,#f5a623)' : 'var(--surface2,#333)',
                color:      selected.size > 0 ? '#1a1200' : 'var(--text-2,#666)',
              }}
            >
              Proceed to Payment →
            </button>
            <button
              onClick={() => setSelected(new Set())}
              disabled={selected.size === 0}
              style={{
                width: '100%', padding: '8px', borderRadius: 8,
                border: '1px solid var(--border,#444)',
                fontWeight: 500, fontSize: 13,
                cursor: selected.size > 0 ? 'pointer' : 'default',
                background: 'transparent',
                color: 'var(--text-2,#aaa)',
                opacity: selected.size > 0 ? 1 : 0.4,
              }}
            >
              Clear Selection
            </button>
            <button
              onClick={() => navigate('/events')}
              style={{
                width: '100%', padding: '8px', borderRadius: 8,
                border: '1px solid var(--border,#333)',
                fontWeight: 500, fontSize: 13,
                cursor: 'pointer', background: 'transparent',
                color: 'var(--text-2,#888)',
              }}
            >
              ← Back to Events
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Seat button ────────────────────────────────────────────
function SeatBtn({ seat, selected, onClick, getStyle }) {
  const isCouple = seat.couple
  return (
    <button
      onClick={() => onClick(seat.id)}
      disabled={seat.status === 'occupied'}
      title={
        seat.status === 'occupied'
          ? `${seat.row}${seat.col} — Occupied`
          : `${seat.row}${seat.col}${isCouple ? ' 💑 Couple' : ''} · ${seat.zone} · ₱${seat.price}`
      }
      style={{
        width: 22, height: 22,
        borderRadius: isCouple ? 6 : 4,
        padding: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 7, fontWeight: 700,
        userSelect: 'none',
        transition: 'transform 0.1s, box-shadow 0.1s',
        outline: isCouple && !selected.has(seat.id) && seat.status !== 'occupied'
          ? '1px dashed var(--accent,#f5a623)88'
          : 'none',
        outlineOffset: 1,
        ...getStyle(seat),
      }}
    >
      {selected.has(seat.id) ? '✓' : (isCouple ? '♥' : '')}
    </button>
  )
}

export default SeatSelection