// Screens: Home, Login, Registro
const { useState } = React;

// ── HomeScreen ────────────────────────────────────────────────────────────────
function HomeScreen({ navigate, user }) {
  const ciudades = ['Ciudad de México','Guadalajara','Monterrey','Cancún','Los Ángeles','Madrid','Miami','Nueva York'];
  const [form, setForm] = useState({ origen:'', destino:'', fecha:'', pasajeros:1, tipo:'ida' });
  const [error, setError] = useState('');

  function buscar() {
    if (!form.origen || !form.destino || !form.fecha) { setError('Por favor completa todos los campos.'); return; }
    if (form.origen === form.destino) { setError('El origen y destino no pueden ser iguales.'); return; }
    setError('');
    navigate('resultados', { busqueda: form });
  }

  const destinos = [
    { ciudad:'Cancún', pais:'México', precio:'desde $3,200', emoji:'🏖️' },
    { ciudad:'Madrid', pais:'España', precio:'desde $12,500', emoji:'🏛️' },
    { ciudad:'Los Ángeles', pais:'EE.UU.', precio:'desde $5,800', emoji:'🎬' },
    { ciudad:'Guadalajara', pais:'México', precio:'desde $1,850', emoji:'🌮' },
  ];

  return (
    <div style={{ fontFamily:'inherit' }}>
      {/* Hero */}
      <div style={homeStyles.hero}>
        <div style={homeStyles.heroContent}>
          <div style={{ maxWidth:600 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)', borderRadius:20, padding:'6px 16px', marginBottom:20 }}>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.9)', fontWeight:600, letterSpacing:'0.5px' }}>✈ AEROCODE SOLUTION · RESERVA TU VUELO HOY</span>
            </div>
            <h1 style={homeStyles.heroTitle}>Vuela a donde<br/>tu corazón te lleve</h1>
            <p style={homeStyles.heroSub}>Más de 50 destinos nacionales e internacionales con los mejores precios garantizados.</p>
          </div>
        </div>

        {/* Search Box */}
        <div style={homeStyles.searchBox}>
          {/* Trip type */}
          <div style={{ display:'flex', gap:4, marginBottom:20 }}>
            {['ida','ida y vuelta'].map(t => (
              <button key={t} onClick={() => setForm({...form, tipo:t})}
                style={{ padding:'6px 16px', borderRadius:20, border:'none', cursor:'pointer', fontSize:13, fontWeight:600,
                  background: form.tipo===t ? '#1E6FD9' : '#F5F7FA',
                  color: form.tipo===t ? '#fff' : '#6B7A8D' }}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 120px auto', gap:12, alignItems:'end' }}>
            <Select label="Origen" value={form.origen} onChange={e=>setForm({...form,origen:e.target.value})}
              options={ciudades.map(c=>({value:c,label:c}))} placeholder="¿De dónde sales?" />
            <Select label="Destino" value={form.destino} onChange={e=>setForm({...form,destino:e.target.value})}
              options={ciudades.map(c=>({value:c,label:c}))} placeholder="¿A dónde vas?" />
            <Input label="Fecha de salida" type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})} />
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'#4A5568' }}>Pasajeros</label>
              <div style={{ display:'flex', alignItems:'center', gap:8, border:'1px solid #DDE3EC', borderRadius:10, padding:'8px 12px', background:'#FAFBFC' }}>
                <button onClick={()=>setForm({...form,pasajeros:Math.max(1,form.pasajeros-1)})} style={{ background:'none',border:'none',cursor:'pointer',fontSize:18,color:'#1E6FD9',fontWeight:700,lineHeight:1 }}>−</button>
                <span style={{ flex:1, textAlign:'center', fontWeight:600, fontSize:15 }}>{form.pasajeros}</span>
                <button onClick={()=>setForm({...form,pasajeros:Math.min(9,form.pasajeros+1)})} style={{ background:'none',border:'none',cursor:'pointer',fontSize:18,color:'#1E6FD9',fontWeight:700,lineHeight:1 }}>+</button>
              </div>
            </div>
            <Btn onClick={buscar} size="md" style={{ height:42, whiteSpace:'nowrap' }}>Buscar vuelos</Btn>
          </div>
          {error && <div style={{ marginTop:10, fontSize:13, color:'#DC2626', fontWeight:500 }}>⚠ {error}</div>}
        </div>
      </div>

      {/* Destinos populares */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'56px 24px' }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <h2 style={{ fontSize:28, fontWeight:700, color:'#0D1B2A', margin:0 }}>Destinos populares</h2>
          <p style={{ color:'#6B7A8D', marginTop:8, fontSize:15 }}>Descubre nuestros destinos más solicitados</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
          {destinos.map(d => (
            <div key={d.ciudad} style={homeStyles.destinoCard} onClick={() => { setForm({...form, destino:d.ciudad}); window.scrollTo({top:0,behavior:'smooth'}); }}>
              <div style={{ fontSize:40, marginBottom:12 }}>{d.emoji}</div>
              <div style={{ fontWeight:700, fontSize:17, color:'#0D1B2A' }}>{d.ciudad}</div>
              <div style={{ fontSize:13, color:'#6B7A8D', margin:'3px 0 10px' }}>{d.pais}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#1E6FD9' }}>{d.precio}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ background:'#0D1B2A', padding:'56px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontSize:28, fontWeight:700, color:'#fff', margin:0 }}>¿Por qué volar con Aerocode Solution?</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {[
              { icon:'🛡️', title:'Reserva segura', desc:'Pago cifrado y confirmación inmediata con código PNR único.' },
              { icon:'🔄', title:'Cancelación flexible', desc:'Cancela tu vuelo con hasta 80% de reembolso según condiciones.' },
              { icon:'📱', title:'Gestión en línea', desc:'Administra tus reservas, asientos y pagos desde cualquier dispositivo.' },
            ].map(f => (
              <div key={f.title} style={homeStyles.featureCard}>
                <div style={{ fontSize:36, marginBottom:16 }}>{f.icon}</div>
                <div style={{ fontWeight:700, fontSize:17, color:'#fff', marginBottom:8 }}>{f.title}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {!user && (
        <div style={{ background:'#EFF6FF', padding:'48px 24px', textAlign:'center' }}>
          <h2 style={{ fontSize:24, fontWeight:700, color:'#0D1B2A', marginBottom:8 }}>¿Nuevo cliente?</h2>
          <p style={{ color:'#6B7A8D', marginBottom:24, fontSize:15 }}>Crea tu cuenta y comienza a gestionar tus vuelos en línea.</p>
          <Btn onClick={() => navigate('registro')} size="lg">Crear cuenta gratuita</Btn>
        </div>
      )}
    </div>
  );
}

const homeStyles = {
  hero: { background:'linear-gradient(135deg, #0D1B2A 0%, #1a3a5c 50%, #0D1B2A 100%)', padding:'72px 24px 0', position:'relative', overflow:'hidden' },
  heroContent: { maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 },
  heroTitle: { fontSize:52, fontWeight:800, color:'#fff', lineHeight:1.1, margin:'0 0 16px', letterSpacing:'-1px' },
  heroSub: { fontSize:18, color:'rgba(255,255,255,0.7)', lineHeight:1.6, marginBottom:0 },
  searchBox: { maxWidth:1200, margin:'36px auto 0', background:'#fff', borderRadius:'20px 20px 0 0', padding:'28px 32px', boxShadow:'0 -8px 30px rgba(13,27,42,0.2)', position:'relative', zIndex:2 },
  destinoCard: { background:'#fff', border:'1px solid #DDE3EC', borderRadius:16, padding:24, cursor:'pointer', transition:'all 0.2s', textAlign:'center', boxShadow:'0 2px 8px rgba(13,27,42,0.04)' },
  featureCard: { padding:28, borderRadius:16, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)' },
};

// ── LoginScreen ───────────────────────────────────────────────────────────────
function LoginScreen({ navigate, onLogin }) {
  const [form, setForm] = useState({ email:'', contraseña:'' });
  const [error, setError] = useState('');

  function handleLogin() {
    if (!form.email || !form.contraseña) { setError('Completa todos los campos.'); return; }
    const u = AppData.autenticar(form.email, form.contraseña);
    if (!u) { setError('Email o contraseña incorrectos.'); return; }
    onLogin(u);
    if (u.rol === 'admin') navigate('panel-admin');
    else if (u.rol === 'agente') navigate('panel-agente');
    else navigate('home');
  }

  const demos = [
    { label:'Cliente', email:'maria@email.com', pass:'123456' },
    { label:'Agente', email:'agente@aerolinea.com', pass:'agente123' },
    { label:'Admin', email:'admin@aerolinea.com', pass:'admin123' },
  ];

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', background:'#F5F7FA', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:440 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:28 }}>✈</div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0D1B2A', margin:0 }}>Bienvenido de vuelta</h1>
          <p style={{ color:'#6B7A8D', marginTop:8, fontSize:15 }}>Inicia sesión para gestionar tus vuelos</p>
        </div>

        <Card>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <Input label="Correo electrónico" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="tu@email.com" />
            <Input label="Contraseña" type="password" value={form.contraseña} onChange={e=>setForm({...form,contraseña:e.target.value})} placeholder="••••••••" error={error} />
            <Btn onClick={handleLogin} size="lg" style={{ width:'100%', justifyContent:'center', marginTop:4 }}>Iniciar sesión</Btn>
            <div style={{ textAlign:'center', fontSize:14, color:'#6B7A8D' }}>
              ¿No tienes cuenta? <button onClick={() => navigate('registro')} style={{ background:'none', border:'none', cursor:'pointer', color:'#1E6FD9', fontWeight:600, fontSize:14 }}>Regístrate</button>
            </div>
          </div>
        </Card>

        {/* Demo hints */}
        <div style={{ marginTop:20 }}>
          <p style={{ fontSize:12, color:'#6B7A8D', textAlign:'center', marginBottom:10, fontWeight:600, letterSpacing:'0.5px' }}>ACCESOS DE DEMO</p>
          <div style={{ display:'flex', gap:8 }}>
            {demos.map(d => (
              <button key={d.label} onClick={() => setForm({email:d.email, contraseña:d.pass})}
                style={{ flex:1, padding:'8px 10px', borderRadius:10, border:'1px solid #DDE3EC', background:'#fff', cursor:'pointer', fontSize:12, fontWeight:600, color:'#4A5568', textAlign:'center' }}>
                {d.label}
              </button>
            ))}
          </div>
          <p style={{ fontSize:11, color:'#9CA3AF', textAlign:'center', marginTop:8 }}>Haz clic para autocompletar credenciales</p>
        </div>
      </div>
    </div>
  );
}

// ── RegistroScreen ────────────────────────────────────────────────────────────
function RegistroScreen({ navigate, onLogin }) {
  const [form, setForm] = useState({ nombre:'', email:'', contraseña:'', confirmar:'', tipoCliente:'minorista' });
  const [errors, setErrors] = useState({});

  function validar() {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.email.includes('@')) e.email = 'Email inválido';
    if (form.contraseña.length < 6) e.contraseña = 'Mínimo 6 caracteres';
    if (form.contraseña !== form.confirmar) e.confirmar = 'Las contraseñas no coinciden';
    if (AppData.usuarios.find(u=>u.email===form.email)) e.email = 'Este email ya está registrado';
    return e;
  }

  function handleRegistro() {
    const e = validar();
    if (Object.keys(e).length) { setErrors(e); return; }
    const nuevo = AppData.addUsuario({ nombre:form.nombre, email:form.email, contraseña:form.contraseña, rol:'cliente', tipoCliente:form.tipoCliente, millas:0, activo:true });
    onLogin(nuevo);
    navigate('home');
  }

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', background:'#F5F7FA', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:480 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:28 }}>🚀</div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0D1B2A', margin:0 }}>Crea tu cuenta</h1>
          <p style={{ color:'#6B7A8D', marginTop:8, fontSize:15 }}>Únete a miles de viajeros satisfechos</p>
        </div>

        <Card>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <Input label="Nombre completo" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="María García" error={errors.nombre} />
            <Input label="Correo electrónico" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="tu@email.com" error={errors.email} />
            <Input label="Contraseña" type="password" value={form.contraseña} onChange={e=>setForm({...form,contraseña:e.target.value})} placeholder="Mínimo 6 caracteres" error={errors.contraseña} />
            <Input label="Confirmar contraseña" type="password" value={form.confirmar} onChange={e=>setForm({...form,confirmar:e.target.value})} placeholder="Repite tu contraseña" error={errors.confirmar} />

            {/* Tipo de cliente */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'#4A5568' }}>Tipo de cuenta</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {[['minorista','🛍️ Minorista','Viajero individual, sin acumulación de millas'],['corporativo','🏢 Corporativo','Acumula millas en cada reserva confirmada']].map(([val,titulo,desc]) => (
                  <button key={val} type="button" onClick={() => setForm({...form, tipoCliente:val})}
                    style={{ padding:'12px 14px', borderRadius:12, border: form.tipoCliente===val ? '2px solid #1E6FD9' : '1px solid #DDE3EC',
                      background: form.tipoCliente===val ? '#EFF6FF' : '#FAFBFC', cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}>
                    <div style={{ fontWeight:700, fontSize:14, color: form.tipoCliente===val ? '#1D4ED8' : '#1A2433', marginBottom:4 }}>{titulo}</div>
                    <div style={{ fontSize:11, color:'#6B7A8D', lineHeight:1.4 }}>{desc}</div>
                  </button>
                ))}
              </div>
              {form.tipoCliente === 'corporativo' && (
                <div style={{ background:'#EFF6FF', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#1D4ED8', display:'flex', gap:8, alignItems:'center' }}>
                  <span>✈</span>
                  <span>Ganarás <strong>1 milla por cada $10 DOP</strong> en tus reservas. Canjéalas como descuento en futuros vuelos.</span>
                </div>
              )}
            </div>

            <div style={{ background:'#F5F7FA', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#6B7A8D', lineHeight:1.5 }}>
              Al registrarte aceptas nuestros <span style={{ color:'#1E6FD9', fontWeight:600 }}>Términos de servicio</span> y <span style={{ color:'#1E6FD9', fontWeight:600 }}>Política de privacidad</span>.
            </div>

            <Btn onClick={handleRegistro} size="lg" style={{ width:'100%', justifyContent:'center' }}>Crear cuenta</Btn>
            <div style={{ textAlign:'center', fontSize:14, color:'#6B7A8D' }}>
              ¿Ya tienes cuenta? <button onClick={() => navigate('login')} style={{ background:'none', border:'none', cursor:'pointer', color:'#1E6FD9', fontWeight:600, fontSize:14 }}>Inicia sesión</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, LoginScreen, RegistroScreen });
