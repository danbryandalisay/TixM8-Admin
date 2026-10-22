import { useState } from 'react'
import {
  Plus, Search, Eye, Pencil, Trash2, X,
  User, Mail, Phone, Ticket, Wallet, Filter
} from 'lucide-react'

// ── SAMPLE DATA ───────────────────────────────────────────
const initialUsers = [
  { id: 1,  name: 'Juan Dela Cruz',    email: 'juan.delacruz@email.com',  phone: '09171234567', tickets: 12, spent: 14400,  joined: '2024-01-15', status: 'Active'    },
  { id: 2,  name: 'Maria Santos',      email: 'maria.santos@email.com',   phone: '09281234567', tickets: 8,  spent: 9600,   joined: '2024-02-20', status: 'Active'    },
  { id: 3,  name: 'Pedro Reyes',       email: 'pedro.reyes@email.com',    phone: '09391234567', tickets: 25, spent: 62500,  joined: '2023-11-05', status: 'Active'    },
  { id: 4,  name: 'Ana Gonzales',      email: 'ana.gonzales@email.com',   phone: '09451234567', tickets: 3,  spent: 1350,   joined: '2024-05-10', status: 'Active'    },
  { id: 5,  name: 'Carlo Mendoza',     email: 'carlo.mendoza@email.com',  phone: '09561234567', tickets: 6,  spent: 4800,   joined: '2024-03-18', status: 'Active'    },
  { id: 6,  name: 'Sofia Ramos',       email: 'sofia.ramos@email.com',    phone: '09671234567', tickets: 18, spent: 45000,  joined: '2023-09-22', status: 'Active'    },
  { id: 7,  name: 'Miguel Torres',     email: 'miguel.torres@email.com',  phone: '09781234567', tickets: 0,  spent: 0,      joined: '2024-06-01', status: 'Inactive'  },
  { id: 8,  name: 'Isabella Cruz',     email: 'isabella.cruz@email.com',  phone: '09891234567', tickets: 42, spent: 126000, joined: '2023-06-14', status: 'Active'    },
  { id: 9,  name: 'Rafael Lim',        email: 'rafael.lim@email.com',     phone: '09901234567', tickets: 5,  spent: 6000,   joined: '2024-04-25', status: 'Active'    },
  { id: 10, name: 'Gabrielle Tan',     email: 'gabrielle.tan@email.com',  phone: '09121234567', tickets: 0,  spent: 0,      joined: '2024-07-02', status: 'Suspended' },
  { id: 11, name: 'Jose Aquino',       email: 'jose.aquino@email.com',    phone: '09231234567', tickets: 15, spent: 22500,  joined: '2023-12-10', status: 'Active'    },
  { id: 12, name: 'Camille Villanueva',email: 'camille.v@email.com',      phone: '09341234567', tickets: 9,  spent: 13500,  joined: '2024-01-30', status: 'Active'    },
]

// ── CONSTANTS ─────────────────────────────────────────────
const STATUSES = ['All', 'Active', 'Inactive', 'Suspended']

// ── STYLE HELPERS ─────────────────────────────────────────
const statusStyle = {
  Active:    { background: 'var(--green-dim)',  color: 'var(--green)',  border: '1px solid rgba(14,158,82,.25)'  },
  Inactive:  { background: 'var(--surface2)',   color: 'var(--text-2)', border: '1px solid var(--border)'       },
  Suspended: { background: 'var(--red-dim)',    color: 'var(--red)',    border: '1px solid rgba(214,52,68,.25)'  },
}

// ── Avatar color based on first letter ────────────────────
const avatarColors = [
  '#D4AF37','#97B0FF','#1ec96a','#f04f5f',
  '#b080ff','#f5a623','#5b8ef0','#22d47a',
]
const getAvatarColor = (name) =>
  avatarColors[name.charCodeAt(0) % avatarColors.length]

// ── EMPTY FORM ─────────────────────────────────────────────
const emptyForm = {
  name: '', email: '', phone: '', status: 'Active'
}

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
function Users() {

  const [users,      setUsers]      = useState(initialUsers)
  const [search,     setSearch]     = useState('')
  const [statFilter, setStatFilter] = useState('All')
  const [modal,      setModal]      = useState(null)
  const [selected,   setSelected]   = useState(null)
  const [form,       setForm]       = useState(emptyForm)

  // ── Filtering ─────────────────────────────────────────
  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase())  ||
                        u.email.toLowerCase().includes(search.toLowerCase()) ||
                        u.phone.includes(search)
    const matchStat   = statFilter === 'All' || u.status === statFilter
    return matchSearch && matchStat
  })

  // ── Quick Stats ────────────────────────────────────────
  const totalUsers    = users.length
  const activeUsers   = users.filter(u => u.status === 'Active').length
  const totalTickets  = users.reduce((sum, u) => sum + u.tickets, 0)
  const totalRevenue  = users.reduce((sum, u) => sum + u.spent, 0)

  // ── Modal Helpers ──────────────────────────────────────
  const openAdd    = ()  => { setForm(emptyForm); setModal('add')    }
  const openEdit   = (u) => { setForm({ name: u.name, email: u.email, phone: u.phone, status: u.status }); setSelected(u); setModal('edit')   }
  const openView   = (u) => { setSelected(u); setModal('view')   }
  const openDelete = (u) => { setSelected(u); setModal('delete') }
  const closeModal = ()  => { setModal(null); setSelected(null)  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // ── CRUD Handlers ──────────────────────────────────────
  const handleAdd = () => {
    if (!form.name || !form.email) return
    const newUser = {
      ...form,
      id:      users.length + 1,
      tickets: 0,
      spent:   0,
      joined:  new Date().toISOString().split('T')[0],
    }
    setUsers(prev => [...prev, newUser])
    closeModal()
  }

  const handleEdit = () => {
    setUsers(prev =>
      prev.map(u => u.id === selected.id
        ? { ...u, ...form }
        : u
      )
    )
    closeModal()
  }

  const handleDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== selected.id))
    closeModal()
  }

  // ── Initials from name ─────────────────────────────────
  const getInitials = (name) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  // ══════════════════════════════════════════════════════
  return (
    <div className="max-w-full">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Customers</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
            Manage all registered customers — {users.length} total
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)', color: '#000' }}
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Customers', value: totalUsers,                   icon: User,   color: 'var(--blue)'   },
          { label: 'Active',          value: activeUsers,                  icon: User,   color: 'var(--green)'  },
          { label: 'Tickets Bought',  value: totalTickets.toLocaleString(),icon: Ticket, color: 'var(--accent)' },
          { label: 'Total Spent',     value: `₱${totalRevenue.toLocaleString()}`, icon: Wallet, color: 'var(--purple)' },
        ].map(stat => (
          <div
            key={stat.label}
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)'}}
          >
            <div
              className="flex items-center justify-center rounded-lg shrink-0 w-9 h-9"
              style={{ background: `${stat.color}18`, color: stat.color }}
            >
              <stat.icon size={16} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>{stat.label}</p>
              <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search + Filters ── */}
      <div
        className="flex flex-wrap items-center gap-3 p-4 rounded-xl mb-4"
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
            placeholder="Search by name, email or phone…"
            className="bg-transparent text-xs outline-none w-full"
            style={{ color: 'var(--text)' }}
          />
        </div>

        <Filter size={14} style={{ color: 'var(--text-3)' }} />

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
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {['Customer', 'Contact', 'Tickets Bought', 'Total Spent', 'Joined', 'Status', 'Actions'].map(col => (
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
                  <td colSpan={7} className="text-center py-16 text-sm" style={{ color: 'var(--text-3)' }}>
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map(user => (
                  <tr
                    key={user.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Customer */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex items-center justify-center rounded-full font-bold shrink-0 text-[10px]"
                          style={{ width: 30, height: 30, background: getAvatarColor(user.name), color: '#000' }}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                            {user.name}
                          </div>
                          <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                            ID: #USR-{String(user.id).padStart(4, '0')}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3">
                      <div className="text-xs" style={{ color: 'var(--text-2)' }}>{user.email}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>{user.phone}</div>
                    </td>

                    {/* Tickets */}
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text)' }}>
                      {user.tickets}
                    </td>

                    {/* Spent */}
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                      ₱{user.spent.toLocaleString()}
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-2)' }}>
                      {user.joined}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded-md"
                        style={statusStyle[user.status]}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openView(user)}
                          className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                          style={{ color: 'var(--blue)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-dim)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          title="View"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => openEdit(user)}
                          className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                          style={{ color: 'var(--accent)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dim)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => openDelete(user)}
                          className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                          style={{ color: 'var(--red)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dim)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>
            Showing {filtered.length} of {users.length} customers
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
           MODALS
      ══════════════════════════════════════════════════ */}
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
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg"
              style={{ color: 'var(--text-3)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <X size={16} />
            </button>

            {/* ── VIEW Modal ── */}
            {modal === 'view' && selected && (
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="flex items-center justify-center rounded-full font-bold text-sm shrink-0"
                    style={{ width: 48, height: 48, background: getAvatarColor(selected.name), color: '#000' }}
                  >
                    {getInitials(selected.name)}
                  </div>
                  <div>
                    <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>{selected.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                        #USR-{String(selected.id).padStart(4, '0')}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                        style={statusStyle[selected.status]}
                      >
                        {selected.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[
                    { icon: Mail,   label: 'Email',          value: selected.email   },
                    { icon: Phone,  label: 'Phone',          value: selected.phone   },
                    { icon: Ticket, label: 'Tickets Bought', value: selected.tickets },
                    { icon: Wallet, label: 'Total Spent',    value: `₱${selected.spent.toLocaleString()}` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="p-3 rounded-xl"
                      style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon size={11} style={{ color: 'var(--accent)' }} />
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
                          {label}
                        </span>
                      </div>
                      <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Joined */}
                <div
                  className="p-3 rounded-xl text-xs"
                  style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
                >
                  Member since <span className="font-semibold" style={{ color: 'var(--text)' }}>{selected.joined}</span>
                </div>
              </div>
            )}

            {/* ── ADD / EDIT Modal ── */}
            {(modal === 'add' || modal === 'edit') && (
              <div>
                <h2 className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>
                  {modal === 'add' ? 'Add Customer' : 'Edit Customer'}
                </h2>
                <p className="text-xs mb-5" style={{ color: 'var(--text-2)' }}>
                  {modal === 'add' ? 'Fill in the customer details.' : 'Update the customer details.'}
                </p>

                <div className="flex flex-col gap-3">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-2)' }}>
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Juan Dela Cruz"
                      className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                      style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-2)' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. juan@email.com"
                      className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                      style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>

                  {/* Phone + Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-2)' }}>
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. 09171234567"
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-2)' }}>
                        Status
                      </label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      >
                        {['Active', 'Inactive', 'Suspended'].map(s => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={modal === 'add' ? handleAdd : handleEdit}
                    className="flex-1 py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                    style={{ background: 'var(--accent)', color: '#000' }}
                  >
                    {modal === 'add' ? 'Add Customer' : 'Save Changes'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2.5 rounded-lg text-xs font-semibold"
                    style={{ background: 'var(--surface2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ── DELETE Modal ── */}
            {modal === 'delete' && selected && (
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--red-dim)' }}
                >
                  <Trash2 size={22} style={{ color: 'var(--red)' }} />
                </div>
                <h2 className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>Remove Customer</h2>
                <p className="text-xs mb-1" style={{ color: 'var(--text-2)' }}>
                  Are you sure you want to remove
                </p>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                  "{selected.name}"?
                </p>
                <p className="text-xs mb-6" style={{ color: 'var(--text-3)' }}>
                  This will permanently delete their account and data.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-2.5 rounded-lg text-xs font-semibold"
                    style={{ background: 'var(--red)', color: '#fff' }}
                  >
                    Yes, Remove
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2.5 rounded-lg text-xs font-semibold"
                    style={{ background: 'var(--surface2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

export default Users