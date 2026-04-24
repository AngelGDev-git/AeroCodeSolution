// Main App Router — Aerocode Solution
const { useState, useEffect } = React;

function App() {
  const [screen, setScreen] = useState('home');
  const [screenData, setScreenData] = useState({});
  const [user, setUser] = useState(null);

  // Persist user session
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aerolinea_user');
      if (saved) setUser(JSON.parse(saved));
    } catch(e) {}
  }, []);

  function navigate(newScreen, data = {}) {
    setScreen(newScreen);
    setScreenData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleLogin(u) {
    setUser(u);
    localStorage.setItem('aerolinea_user', JSON.stringify(u));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('aerolinea_user');
    navigate('home');
  }

  const commonProps = { navigate, user, screenData };

  const screens = {
    'home':         <HomeScreen {...commonProps} />,
    'login':        <LoginScreen navigate={navigate} onLogin={handleLogin} />,
    'registro':     <RegistroScreen navigate={navigate} onLogin={handleLogin} />,
    'resultados':   <ResultadosScreen {...commonProps} />,
    'asientos':     <AsientosScreen {...commonProps} />,
    'pago':         <PagoScreen {...commonProps} />,
    'confirmacion': <ConfirmacionScreen {...commonProps} />,
    'mis-reservas': <MisReservasScreen {...commonProps} />,
    'panel-agente': <PanelAgenteScreen {...commonProps} />,
    'panel-admin':  <PanelAdminScreen {...commonProps} />,
  };

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", minHeight:'100vh', background:'#F5F7FA' }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=range] { -webkit-appearance: none; height: 6px; border-radius: 3px; background: #DDE3EC; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #1E6FD9; cursor: pointer; }
        button:hover { opacity: 0.88; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #F5F7FA; }
        ::-webkit-scrollbar-thumb { background: #DDE3EC; border-radius: 3px; }
        table th { white-space: nowrap; }
      `}</style>

      <Navbar user={user} navigate={navigate} onLogout={handleLogout} />

      <main>
        {screens[screen] || screens['home']}
      </main>

      <footer style={{ background:'#0D1B2A', padding:'32px 24px', marginTop: ['home'].includes(screen) ? 0 : 48 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <AerocodeLogo size={32} />
            <div style={{ display:'flex', flexDirection:'column', lineHeight:1.1 }}>
              <span style={{ color:'#fff', fontWeight:800, fontSize:15 }}>Aerocode</span>
              <span style={{ color:'#1E6FD9', fontWeight:600, fontSize:9, letterSpacing:'1.5px' }}>SOLUTION</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:24 }}>
            {['Inicio','Vuelos','Sobre nosotros','Contacto'].map(l => (
              <button key={l} onClick={() => navigate('home')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.5)', fontSize:13, fontWeight:500 }}>{l}</button>
            ))}
          </div>
          <div style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Aerocode Solution · Todos los derechos reservados</div>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
