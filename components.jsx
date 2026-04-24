// Shared UI Components — AeroLinea
const { useState, useEffect, useRef } = React;

// ── Logo SVG ─────────────────────────────────────────────────────────────────
function AerocodeLogo({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background rounded square */}
      <rect width="44" height="44" rx="12" fill="#0D1B2A"/>
      {/* Outer glow ring */}
      <rect x="2" y="2" width="40" height="40" rx="10" stroke="#1E6FD9" strokeWidth="0.5" opacity="0.4"/>
      {/* Main wing chevron — points right like ">" and a swept wing */}
      <path d="M9 11 L30 22 L9 33 L13 33 L32 22 L13 11 Z" fill="#1E6FD9"/>
      {/* Bright accent streak — engine exhaust / highlight */}
      <path d="M30 22 L38 22" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Small upper dot — star / navigation light */}
      <circle cx="36" cy="13" r="2" fill="#60A5FA" opacity="0.7"/>
      {/* Code bracket hint bottom-left */}
      <path d="M6 37 L4 35 L6 33" stroke="#1E6FD9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    </svg>
  );
}

// ── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ user, navigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={navStyles.nav}>
      <div style={navStyles.inner}>
        <button style={navStyles.logo} onClick={() => navigate('home')}>
          <AerocodeLogo size={38} />
          <div style={{ display:'flex', flexDirection:'column', lineHeight:1.1 }}>
            <span style={{ fontSize:16, fontWeight:800, color:'#0D1B2A', letterSpacing:'-0.3px' }}>Aerocode</span>
            <span style={{ fontSize:10, fontWeight:600, color:'#1E6FD9', letterSpacing:'1.5px' }}>SOLUTION</span>
          </div>
        </button>

        <div style={navStyles.links}>
          <button style={navStyles.link} onClick={() => navigate('home')}>Inicio</button>
          <button style={navStyles.link} onClick={() => navigate('home')}>Vuelos</button>
          {user && user.rol === 'cliente' && (
            <button style={navStyles.link} onClick={() => navigate('mis-reservas')}>Mis Reservas</button>
          )}
          {user && user.rol === 'agente' && (
            <button style={navStyles.link} onClick={() => navigate('panel-agente')}>Panel Agente</button>
          )}
          {user && user.rol === 'admin' && (
            <button style={navStyles.link} onClick={() => navigate('panel-admin')}>Administración</button>
          )}
        </div>

        <div style={navStyles.actions}>
          {user ? (
            <div style={{ position:'relative' }}>
              <button style={navStyles.userBtn} onClick={() => setMenuOpen(!menuOpen)}>
                <div style={navStyles.avatar}>{user.nombre.charAt(0)}</div>
                <span style={{ fontSize:14, color:'#1A2433' }}>{user.nombre.split(' ')[0]}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="#6B7A8D" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              {menuOpen && (
                <div style={navStyles.dropdown}>
                  <div style={navStyles.dropdownHeader}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#1A2433' }}>{user.nombre}</div>
                    <div style={{ fontSize:12, color:'#6B7A8D' }}>{user.email}</div>
                    <span style={{ ...navStyles.rolBadge, background: user.rol==='admin'?'#FEF3C7':user.rol==='agente'?'#EFF6FF':'#F0FDF4', color: user.rol==='admin'?'#92400E':user.rol==='agente'?'#1D4ED8':'#166534' }}>{user.rol.toUpperCase()}</span>
                  </div>
                  {user.rol === 'cliente' && <button style={navStyles.dropItem} onClick={() => { setMenuOpen(false); navigate('mis-reservas'); }}>Mis Reservas</button>}
                  {user.rol === 'agente'  && <button style={navStyles.dropItem} onClick={() => { setMenuOpen(false); navigate('panel-agente'); }}>Panel Agente</button>}
                  {user.rol === 'admin'   && <button style={navStyles.dropItem} onClick={() => { setMenuOpen(false); navigate('panel-admin'); }}>Administración</button>}
                  <button style={{ ...navStyles.dropItem, color:'#DC2626', borderTop:'1px solid #DDE3EC' }} onClick={() => { setMenuOpen(false); onLogout(); }}>Cerrar Sesión</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display:'flex', gap:10 }}>
              <button style={navStyles.btnGhost} onClick={() => navigate('login')}>Iniciar sesión</button>
              <button style={navStyles.btnPrimary} onClick={() => navigate('registro')}>Registrarse</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const navStyles = {
  nav: { background:'#FEFEFE', borderBottom:'1px solid #DDE3EC', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 8px rgba(13,27,42,0.06)' },
  inner: { maxWidth:1200, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' },
  logo: { display:'flex', alignItems:'center', gap:10, background:'none', border:'none', cursor:'pointer', padding:0 },
  brand: { fontSize:20, fontWeight:800, color:'#0D1B2A', letterSpacing:'-0.3px' },
  links: { display:'flex', gap:4 },
  link: { background:'none', border:'none', cursor:'pointer', padding:'6px 14px', borderRadius:8, fontSize:14, fontWeight:500, color:'#4A5568', transition:'all 0.15s' },
  actions: { display:'flex', alignItems:'center', gap:12 },
  userBtn: { display:'flex', alignItems:'center', gap:8, background:'none', border:'1px solid #DDE3EC', borderRadius:20, padding:'5px 12px 5px 6px', cursor:'pointer' },
  avatar: { width:28, height:28, borderRadius:'50%', background:'#1E6FD9', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700 },
  dropdown: { position:'absolute', right:0, top:'calc(100% + 8px)', background:'#fff', border:'1px solid #DDE3EC', borderRadius:12, boxShadow:'0 8px 30px rgba(13,27,42,0.12)', minWidth:220, overflow:'hidden' },
  dropdownHeader: { padding:'14px 16px', background:'#F5F7FA', display:'flex', flexDirection:'column', gap:3 },
  rolBadge: { alignSelf:'flex-start', marginTop:4, fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20 },
  dropItem: { display:'block', width:'100%', padding:'10px 16px', background:'none', border:'none', cursor:'pointer', fontSize:14, textAlign:'left', color:'#1A2433', transition:'background 0.1s' },
  btnGhost: { padding:'8px 16px', borderRadius:8, border:'1px solid #DDE3EC', background:'none', cursor:'pointer', fontSize:14, fontWeight:500, color:'#1A2433' },
  btnPrimary: { padding:'8px 18px', borderRadius:8, border:'none', background:'#1E6FD9', color:'#fff', cursor:'pointer', fontSize:14, fontWeight:600 },
};

// ── Buttons ──────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant='primary', size='md', disabled=false, style={} }) {
  const base = { border:'none', cursor: disabled?'not-allowed':'pointer', borderRadius:10, fontWeight:600, fontFamily:'inherit', transition:'all 0.15s', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, opacity: disabled?0.5:1 };
  const sizes = { sm:{ padding:'6px 14px', fontSize:13 }, md:{ padding:'10px 22px', fontSize:15 }, lg:{ padding:'14px 30px', fontSize:16 } };
  const variants = {
    primary: { background:'#1E6FD9', color:'#fff' },
    secondary: { background:'#F5F7FA', color:'#1A2433', border:'1px solid #DDE3EC' },
    danger: { background:'#DC2626', color:'#fff' },
    ghost: { background:'none', color:'#1E6FD9', border:'1px solid #1E6FD9' },
    dark: { background:'#0D1B2A', color:'#fff' },
    success: { background:'#16A34A', color:'#fff' },
  };
  return <button style={{ ...base, ...sizes[size], ...variants[variant], ...style }} onClick={disabled?undefined:onClick} disabled={disabled}>{children}</button>;
}

// ── Badge ────────────────────────────────────────────────────────────────────
function Badge({ children, color='blue' }) {
  const colors = {
    blue:   { bg:'#EFF6FF', text:'#1D4ED8' },
    green:  { bg:'#F0FDF4', text:'#166534' },
    yellow: { bg:'#FEF3C7', text:'#92400E' },
    red:    { bg:'#FEF2F2', text:'#991B1B' },
    gray:   { bg:'#F3F4F6', text:'#374151' },
  };
  const c = colors[color] || colors.blue;
  return <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:600, background:c.bg, color:c.text }}>{children}</span>;
}

// ── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, style={}, onClick }) {
  return (
    <div style={{ background:'#fff', borderRadius:16, border:'1px solid #DDE3EC', padding:24, boxShadow:'0 2px 8px rgba(13,27,42,0.04)', ...style }} onClick={onClick}>
      {children}
    </div>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────
function Input({ label, value, onChange, type='text', placeholder='', icon, error }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {label && <label style={{ fontSize:13, fontWeight:600, color:'#4A5568' }}>{label}</label>}
      <div style={{ position:'relative' }}>
        {icon && <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#6B7A8D' }}>{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ width:'100%', padding: icon ? '10px 14px 10px 36px' : '10px 14px', borderRadius:10, border:`1px solid ${error?'#DC2626':'#DDE3EC'}`, fontSize:14, color:'#1A2433', outline:'none', boxSizing:'border-box', fontFamily:'inherit', background:'#FAFBFC' }}
        />
      </div>
      {error && <span style={{ fontSize:12, color:'#DC2626' }}>{error}</span>}
    </div>
  );
}

// ── Select ───────────────────────────────────────────────────────────────────
function Select({ label, value, onChange, options=[], placeholder='' }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {label && <label style={{ fontSize:13, fontWeight:600, color:'#4A5568' }}>{label}</label>}
      <select value={value} onChange={onChange} style={{ padding:'10px 14px', borderRadius:10, border:'1px solid #DDE3EC', fontSize:14, color:'#1A2433', background:'#FAFBFC', fontFamily:'inherit', outline:'none', cursor:'pointer' }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
      <div>
        <h2 style={{ margin:0, fontSize:22, fontWeight:700, color:'#0D1B2A' }}>{title}</h2>
        {subtitle && <p style={{ margin:'4px 0 0', fontSize:14, color:'#6B7A8D' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ estado }) {
  const map = {
    confirmada:  { color:'green', label:'Confirmada' },
    pendiente:   { color:'yellow', label:'Pendiente' },
    cancelada:   { color:'red',  label:'Cancelada' },
    aprobado:    { color:'green', label:'Aprobado' },
    reembolsado: { color:'blue', label:'Reembolsado' },
    programado:  { color:'blue', label:'Programado' },
    activo:      { color:'green', label:'Activo' },
    inactivo:    { color:'gray', label:'Inactivo' },
  };
  const s = map[estado] || { color:'gray', label: estado };
  return <Badge color={s.color}>{s.label}</Badge>;
}

// ── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width=480 }) {
  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(13,27,42,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}>
      <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:width, maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(13,27,42,0.25)' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid #DDE3EC', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ margin:0, fontSize:18, fontWeight:700, color:'#0D1B2A' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:22, color:'#6B7A8D', lineHeight:1, padding:4 }}>×</button>
        </div>
        <div style={{ padding:24 }}>{children}</div>
      </div>
    </div>
  );
}

// ── PageWrapper ───────────────────────────────────────────────────────────────
function PageWrapper({ children, style={} }) {
  return (
    <div style={{ minHeight:'calc(100vh - 64px)', background:'#F5F7FA', ...style }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 24px', ...style }}>
        {children}
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color='#1E6FD9', sub }) {
  return (
    <Card style={{ padding:20 }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:13, color:'#6B7A8D', fontWeight:500, marginBottom:6 }}>{label}</div>
          <div style={{ fontSize:28, fontWeight:700, color:'#0D1B2A' }}>{value}</div>
          {sub && <div style={{ fontSize:12, color:'#6B7A8D', marginTop:4 }}>{sub}</div>}
        </div>
        <div style={{ width:44, height:44, borderRadius:12, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', color }}>{icon}</div>
      </div>
    </Card>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatHora(dt) {
  const d = new Date(dt);
  return d.toLocaleTimeString('es-DO', { hour:'2-digit', minute:'2-digit', hour12:false });
}
function formatFecha(dt) {
  const d = new Date(dt);
  return d.toLocaleDateString('es-DO', { day:'numeric', month:'short', year:'numeric' });
}
function duracion(salida, llegada) {
  const diff = (new Date(llegada) - new Date(salida)) / 60000;
  const h = Math.floor(diff/60), m = diff%60;
  return `${h}h ${m.toString().padStart(2,'0')}m`;
}
function formatMonto(n) {
  return `$${Number(n).toLocaleString('es-DO')} DOP`;
}

Object.assign(window, {
  AerocodeLogo, Navbar, Btn, Badge, Card, Input, Select, Modal,
  SectionHeader, StatusBadge, PageWrapper, StatCard,
  formatHora, formatFecha, duracion, formatMonto,
});
