import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Search, Eye, Pencil, Trash2, X,
  CalendarDays, MapPin, Ticket, Tag, Filter
} from 'lucide-react'

// ── SAMPLE DATA ──────────────────────────────────────────
const initialEvents = [
  { id: 1,  name: 'Avengers Finale',        category: 'Movie',   date: '2026-11-05', time: '7:00 PM',  venue: 'SM Mall of Asia Arena',    tickets: 500,  sold: 480, price: 450,   status: 'Active'    },
  { id: 2,  name: 'PBA Finals Game 5',       category: 'Sports',  date: '2026-11-08', time: '6:30 PM',  venue: 'Araneta Coliseum',          tickets: 1200, sold: 950, price: 1200,  status: 'Active'    },
  { id: 3,  name: 'Ben & Ben Concert',       category: 'Concert', date: '2026-11-15', time: '8:00 PM',  venue: 'BGC Open Park',             tickets: 2000, sold: 1800,price: 2500,  status: 'Active'    },
  { id: 4,  name: 'UAAP Finals',             category: 'Sports',  date: '2026-11-20', time: '4:00 PM',  venue: 'SM Mall of Asia Arena',    tickets: 800,  sold: 600, price: 800,   status: 'Upcoming'  },
  { id: 5,  name: 'Star Wars: Episode X',   category: 'Movie',   date: '2026-12-01', time: '9:00 PM',  venue: 'Ayala Cinemas Vertis',      tickets: 300,  sold: 120, price: 550,   status: 'Upcoming'  },
  { id: 6,  name: 'SB19 World Tour MNL',    category: 'Concert', date: '2026-12-10', time: '7:30 PM',  venue: 'Philippine Arena',          tickets: 5000, sold: 4200,price: 3500,  status: 'Active'    },
  { id: 7,  name: 'ONE Championship MNL',   category: 'Sports',  date: '2026-12-18', time: '5:00 PM',  venue: 'Mall of Asia Arena',        tickets: 1500, sold: 980, price: 1500,  status: 'Upcoming'  },
  { id: 8,  name: 'Coldplay Music of Spheres', category: 'Concert', date: '2026-10-01', time: '8:00 PM', venue: 'Philippine Arena',        tickets: 8000, sold: 8000,price: 8000,  status: 'Completed' },
  { id: 9,  name: 'Batman vs Superman',     category: 'Movie',   date: '2026-09-15', time: '6:00 PM',  venue: 'SM Megamall Cinema',        tickets: 400,  sold: 300, price: 480,   status: 'Completed' },
  { id: 10, name: 'OPM Fest 2026',          category: 'Concert', date: '2026-10-25', time: '5:00 PM',  venue: 'Quirino Grandstand',        tickets: 3000, sold: 0,   price: 1200,  status: 'Cancelled' },
]

const CATEGORIES = ['All', 'Movie', 'Sports', 'Concert']
const STATUSES   = ['All', 'Active', 'Upcoming', 'Completed', 'Cancelled']

const statusStyle = {
  Active:    { background: 'var(--green-dim)',  color: 'var(--green)',  border: '1px solid rgba(14,158,82,.25)'  },
  Upcoming:  { background: 'var(--blue-dim)',   color: 'var(--blue)',   border: '1px solid rgba(79,114,216,.25)' },
  Completed: { background: 'var(--surface2)',   color: 'var(--text-2)', border: '1px solid var(--border)'       },
  Cancelled: { background: 'var(--red-dim)',    color: 'var(--red)',    border: '1px solid rgba(214,52,68,.25)'  },
}

const categoryStyle = {
  Movie:   { background: 'var(--purple-dim)', color: 'var(--purple)' },
  Sports:  { background: 'var(--blue-dim)',   color: 'var(--blue)'   },
  Concert: { background: 'var(--accent-dim)', color: 'var(--accent)' },
}

const emptyForm = {
  name: '', category: 'Movie', date: '', time: '',
  venue: '', tickets: '', price: '', status: 'Upcoming'
}

function Events() {

  // ✅ CHANGE 1: useNavigate hook — lets us go to /seat-selection
  const navigate = useNavigate()

  const [events,     setEvents]     = useState(initialEvents)
  const [search,     setSearch]     = useState('')
  const [catFilter,  setCatFilter]  = useState('All')
  const [statFilter, setStatFilter] = useState('All')
  const [modal,      setModal]      = useState(null)
  const [selected,   setSelected]   = useState(null)
  const [form,       setForm]       = useState(emptyForm)

  const filtered = events.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.venue.toLowerCase().includes(search.toLowerCase())
    const matchCat    = catFilter  === 'All' || e.category === catFilter
    const matchStat   = statFilter === 'All' || e.status   === statFilter
    return matchSearch && matchCat && matchStat
  })

  const openAdd    = ()  => { setForm(emptyForm); setModal('add')    }
  const openEdit   = (e) => { setForm({ ...e });  setSelected(e); setModal('edit')   }
  const openView   = (e) => { setSelected(e);     setModal('view')   }
  const openDelete = (e) => { setSelected(e);     setModal('delete') }
  const closeModal = ()  => { setModal(null); setSelected(null)      }

  // ✅ CHANGE 2: navigate to seat selection, passing the event as state
  const openBookSeats = (event) => {
    navigate('/seat-selection', {
      state: {
        event: {
          id:    event.id,
          name:  event.name,
          date:  event.date,
          time:  event.time,
          venue: event.venue,
        }
      }
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAdd = () => {
    if (!form.name || !form.date || !form.venue) return
    const newEvent = {
      ...form,
      id:     events.length + 1,
      sold:   0,
      tickets: Number(form.tickets),
      price:   Number(form.price),
    }
    setEvents(prev => [...prev, newEvent])
    closeModal()
  }

  const handleEdit = () => {
    setEvents(prev =>
      prev.map(e => e.id === selected.id
        ? { ...form, id: selected.id, sold: selected.sold, tickets: Number(form.tickets), price: Number(form.price) }
        : e
      )
    )
    closeModal()
  }

  const handleDelete = () => {
    setEvents(prev => prev.filter(e => e.id !== selected.id))
    closeModal()
  }

  const occupancyColor = (pct) => {
    if (pct >= 90) return 'var(--red)'
    if (pct >= 60) return 'var(--accent)'
    return 'var(--green)'
  }

  return (
    <div className="max-w-full">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-5)' }}>Events</h1>
          <p className="text-base mt-1" style={{ color: 'var(--text-2)' }}>
            Manage all ticketing events — {events.length} total
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)', color: 'var(--text-4)' }}
        >
          <Plus size={16} />
          Add Event
        </button>
      </div>

      {/* ── Search + Filters ── */}
      <div
        className="flex flex-wrap items-center gap-3 p-4 rounded-lg mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div
          className="flex items-center gap-2 px-3 h-9 rounded-lg flex-1 min-w-[200px] max-w-[400px]"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
        >
          <Search size={14} style={{ color: 'var(--text-3)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events or venue…"
            className="bg-transparent text-xs outline-none w-full"
            style={{ color: 'var(--text)' }}
          />
        </div>

        <Filter size={14} style={{ color: 'var(--text-3)' }} />

        <div className="flex items-center gap-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
              style={{
                background: catFilter === c ? 'var(--accent-dim)' : 'transparent',
                color:      catFilter === c ? 'var(--accent)'     : 'var(--text-2)',
                border:     catFilter === c ? '1px solid var(--accent-dim)' : '1px solid transparent',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="w-px h-5" style={{ background: 'var(--border)' }} />

        <div className="flex items-center gap-1 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatFilter(s)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
              style={{
                background: statFilter === s ? 'var(--accent-dim)' : 'transparent',
                color:      statFilter === s ? 'var(--accent)'     : 'var(--text-2)',
                border:     statFilter === s ? '1px solid var(--accent-dim)' : '1px solid transparent',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {['Event Name', 'Category', 'Date & Time', 'Venue', 'Occupancy', 'Price', 'Status', 'Actions'].map(col => (
                  <th
                    key={col}
                    className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: 'var(--text-3)', borderBottom: '1px solid var(--border)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-sm" style={{ color: 'var(--text-3)' }}>
                    No events found.
                  </td>
                </tr>
              ) : (
                filtered.map(event => {
                  const pct = Math.round((event.sold / event.tickets) * 100) || 0
                  // ✅ CHANGE 3: only Active/Upcoming can book seats
                  const canBook = event.status === 'Active' || event.status === 'Upcoming'
                  return (
                    <tr
                      key={event.id}
                      className="transition-colors"
                      style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-4 py-3">
                        <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                          {event.name}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={categoryStyle[event.category]}>
                          {event.category}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-xs" style={{ color: 'var(--text)' }}>{event.date}</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>{event.time}</div>
                      </td>

                      <td className="px-4 py-3 text-xs max-w-[180px] truncate" style={{ color: 'var(--text-2)' }}>
                        {event.venue}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: occupancyColor(pct) }} />
                          </div>
                          <span className="text-[10px] font-semibold" style={{ color: 'var(--text-2)' }}>{pct}%</span>
                        </div>
                        <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>{event.sold}/{event.tickets}</div>
                      </td>

                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                        ₱{event.price.toLocaleString()}
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={statusStyle[event.status]}>
                          {event.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">

                          <button onClick={() => openView(event)}
                            className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                            style={{ color: 'var(--blue)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-dim)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            title="View">
                            <Eye size={13} />
                          </button>

                          <button onClick={() => openEdit(event)}
                            className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                            style={{ color: 'var(--accent)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dim)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            title="Edit">
                            <Pencil size={13} />
                          </button>

                          <button onClick={() => openDelete(event)}
                            className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                            style={{ color: 'var(--red)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dim)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            title="Delete">
                            <Trash2 size={13} />
                          </button>

                          {/* ✅ CHANGE 3: Book Seats — green ticket, only Active/Upcoming */}
                          {canBook && (
                            <button onClick={() => openBookSeats(event)}
                              className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                              style={{ color: 'var(--green)' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--green-dim)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              title="Book Seats">
                              <Ticket size={13} />
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>
            Showing {filtered.length} of {events.length} events
          </span>
        </div>
      </div>

      {/* ══ MODALS ══ */}
      {modal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl p-6 z-50"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--text-3)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <X size={16} />
            </button>

            {/* ── VIEW Modal ── */}
            {modal === 'view' && selected && (
              <div>
                <div className="flex items-start gap-3 mb-6">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{selected.name}</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block" style={statusStyle[selected.status]}>
                      {selected.status}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={categoryStyle[selected.category]}>
                    {selected.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: CalendarDays, label: 'Date & Time', value: `${selected.date} · ${selected.time}` },
                    { icon: MapPin,       label: 'Venue',       value: selected.venue                         },
                    { icon: Ticket,       label: 'Tickets',     value: `${selected.sold} / ${selected.tickets} sold` },
                    { icon: Tag,          label: 'Price',       value: `₱${selected.price.toLocaleString()}`  },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="p-3 rounded-lg" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon size={12} style={{ color: 'var(--accent)' }} />
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>{label}</span>
                      </div>
                      <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Occupancy</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                      {Math.round((selected.sold / selected.tickets) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${Math.round((selected.sold / selected.tickets) * 100)}%`, background: occupancyColor(Math.round((selected.sold / selected.tickets) * 100)) }} />
                  </div>
                </div>

                {/* ✅ CHANGE 4: Book Seats button inside View modal */}
                {(selected.status === 'Active' || selected.status === 'Upcoming') && (
                  <button
                    onClick={() => { closeModal(); openBookSeats(selected) }}
                    className="mt-4 w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                    style={{ background: 'var(--accent)', color: '#000' }}
                  >
                    <Ticket size={13} />
                    Book Seats
                  </button>
                )}
              </div>
            )}

            {/* ── ADD / EDIT Modal ── */}
            {(modal === 'add' || modal === 'edit') && (
              <div>
                <h2 className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>
                  {modal === 'add' ? 'Add New Event' : 'Edit Event'}
                </h2>
                <p className="text-xs mb-5" style={{ color: 'var(--text-2)' }}>
                  {modal === 'add' ? 'Fill in the details below.' : 'Update the event details.'}
                </p>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-2)' }}>Event Name</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ben & Ben Concert"
                      className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                      style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-2)' }}>Category</label>
                      <select name="category" value={form.category} onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                        {['Movie', 'Sports', 'Concert'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-2)' }}>Status</label>
                      <select name="status" value={form.status} onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                        {['Active', 'Upcoming', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-2)' }}>Date</label>
                      <input type="date" name="date" value={form.date} onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-2)' }}>Time</label>
                      <input name="time" value={form.time} onChange={handleChange} placeholder="e.g. 7:00 PM"
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-2)' }}>Venue</label>
                    <input name="venue" value={form.venue} onChange={handleChange} placeholder="e.g. SM Mall of Asia Arena"
                      className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                      style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-2)' }}>Total Tickets</label>
                      <input type="number" name="tickets" value={form.tickets} onChange={handleChange} placeholder="e.g. 500"
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-2)' }}>Price (₱)</label>
                      <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="e.g. 1500"
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-5">
                  <button onClick={modal === 'add' ? handleAdd : handleEdit}
                    className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
                    style={{ background: 'var(--accent)', color: '#000' }}>
                    {modal === 'add' ? 'Add Event' : 'Save Changes'}
                  </button>
                  <button onClick={closeModal}
                    className="px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors"
                    style={{ background: 'var(--surface2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ── DELETE Modal ── */}
            {modal === 'delete' && selected && (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--red-dim)' }}>
                  <Trash2 size={22} style={{ color: 'var(--red)' }} />
                </div>
                <h2 className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>Delete Event</h2>
                <p className="text-xs mb-1" style={{ color: 'var(--text-2)' }}>Are you sure you want to delete</p>
                <p className="text-sm font-semibold mb-5" style={{ color: 'var(--text)' }}>"{selected.name}"?</p>
                <p className="text-xs mb-6" style={{ color: 'var(--text-3)' }}>This action cannot be undone.</p>
                <div className="flex gap-2">
                  <button onClick={handleDelete} className="flex-1 py-2.5 rounded-lg text-xs font-semibold"
                    style={{ background: 'var(--red)', color: '#fff' }}>Yes, Delete</button>
                  <button onClick={closeModal} className="flex-1 py-2.5 rounded-lg text-xs font-semibold"
                    style={{ background: 'var(--surface2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>Cancel</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

export default Events