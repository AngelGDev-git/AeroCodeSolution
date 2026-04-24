// Screens: Mis Reservas, Panel Agente, Panel Admin
const { useState, useEffect } = React;

// ── MisReservasScreen ─────────────────────────────────────────────────────────
function MisReservasScreen({ navigate, user }) {
  const [cancelarId, setCancelarId] = useState(null);
  const [tab, setTab] = useState('activas');

  if (!user) { return <div style={{ padding:40, textAlign:'center' }}><p>Debes iniciar sesión.</p><Btn onClick={() => navigate('login')}>Iniciar sesión</Btn></div>; }

  const esCorporativo = user.tipoCliente === 'corporativo';
  // Leer millas actualizadas desde AppData
  const usuarioActual = AppData.getUsuario(user.idUsuario);
  const millasActuales = usuarioActual?.millas || 0;

  const reservas = AppData.getReservasByUsuario(user.idUsuario);
  const activas   = reservas.filter(r => r.estado !== 'cancelada');
  const canceladas = reservas.filter(r => r.estado === 'cancelada');
  const historialMillas = esCorporativo ? AppData.getHistorialMillas(user.idUsuario) : [];
  // Historial de vuelos: reservas confirmadas cuya fecha de salida ya pasó
  const hoy = new Date();
  const historialVuelos = reservas
    .filter(r => { const v = AppData.getVuelo(r.idVuelo); return v && new Date(v.fechaSalida) < hoy && r.estado === 'confirmada'; })
    .sort((a,b) => new Date(AppData.getVuelo(b.idVuelo)?.fechaSalida) - new Date(AppData.getVuelo(a.idVuelo)?.fechaSalida));
  // Para demo: también incluimos reservas confirmadas pasadas simuladas
  const todasConfirmadas = reservas.filter(r => r.estado === 'confirmada');
  const lista = tab === 'activas' ? activas : canceladas;

  function cancelar(r) {
    const pct = AppData.calcularReembolso(r.fechaReserva);
    AppData.updateReservaEstado(r.idReserva, 'cancelada');
    const pago = AppData.getPago(r.idPago);
    if (pago) { pago.estado = 'reembolsado'; pago.montoReembolso = Math.round(pago.monto * pct); }
    setCancelarId(null);
  }

  function getPorcentajeReembolso(r) {
    return AppData.calcularReembolso(r.fechaReserva);
  }

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', background:'#F5F7FA' }}>
      <div style={{ background:'#0D1B2A', padding:'32px 24px' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <h1 style={{ color:'#fff', margin:0, fontSize:24, fontWeight:800 }}>Mis Reservas</h1>
          <p style={{ color:'rgba(255,255,255,0.5)', margin:'6px 0 0', fontSize:14 }}>Gestiona todos tus vuelos y reservas</p>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'28px 24px' }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns: esCorporativo ? 'repeat(4,1fr)' : 'repeat(3,1fr)', gap:16, marginBottom:24 }}>
          <StatCard label="Reservas activas" value={activas.length} icon="✈" color="#1E6FD9" />
          <StatCard label="Vuelos completados" value={activas.filter(r=>r.estado==='confirmada').length} icon="✓" color="#16A34A" />
          <StatCard label="Canceladas" value={canceladas.length} icon="✗" color="#DC2626" />
          {esCorporativo && (
            <div style={{ background:'linear-gradient(135deg,#1E3A5F,#1E6FD9)', borderRadius:16, padding:20, boxShadow:'0 2px 8px rgba(30,111,217,0.2)' }}>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', fontWeight:500, marginBottom:6 }}>Mis millas corporativas</div>
              <div style={{ fontSize:28, fontWeight:700, color:'#fff' }}>{millasActuales.toLocaleString()}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', marginTop:4 }}>= ${millasActuales.toLocaleString('es-DO')} DOP en descuentos</div>
            </div>
          )}
        </div>

        {/* Banner corporativo */}
        {esCorporativo && (
          <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:12, padding:'12px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:12, fontSize:13, color:'#1D4ED8' }}>
            <span style={{ fontSize:20 }}>🏢</span>
            <span><strong>Cuenta Corporativa</strong> · Acumulas 1 milla por cada $10 DOP en reservas. Tus millas no vencen y puedes usarlas como descuento al pagar.</span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:20, background:'#E5E7EB', borderRadius:10, padding:4, width:'fit-content' }}>
          {[['activas',`Activas (${activas.length})`],['historial',`Historial (${todasConfirmadas.length})`],['canceladas',`Canceladas (${canceladas.length})`],...(esCorporativo?[['millas',`Mis Millas ✈`]]:[])].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ padding:'8px 20px', borderRadius:8, border:'none', cursor:'pointer', fontSize:14, fontWeight:600,
                background: tab===k ? '#fff' : 'transparent',
                color: tab===k ? '#0D1B2A' : '#6B7A8D',
                boxShadow: tab===k ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
              {l}
            </button>
          ))}
        </div>

        {(tab === 'activas' || tab === 'canceladas') && (lista.length === 0 ? (
          <Card style={{ textAlign:'center', padding:48 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✈</div>
            <h3 style={{ color:'#0D1B2A', margin:'0 0 8px' }}>No hay reservas {tab === 'activas' ? 'activas' : 'canceladas'}</h3>
            {tab === 'activas' && <Btn onClick={() => navigate('home')} style={{ marginTop:16 }}>Buscar vuelos</Btn>}
          </Card>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {lista.map(r => {
              const vuelo = AppData.getVuelo(r.idVuelo);
              const pago  = AppData.getPago(r.idPago);
              return (
                <Card key={r.idReserva} style={{ padding:0, overflow:'hidden' }}>
                  <div style={{ background: r.estado==='cancelada'?'#F3F4F6':r.estado==='confirmada'?'#F0FDF4':'#FEF3C7', padding:'10px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #DDE3EC' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <span style={{ fontFamily:'monospace', fontWeight:800, fontSize:15, color:'#0D1B2A', letterSpacing:'2px' }}>PNR: {r.codigoPNR}</span>
                      <StatusBadge estado={r.estado} />
                    </div>
                    <span style={{ fontSize:12, color:'#6B7A8D' }}>Reservado el {formatFecha(r.fechaReserva)}</span>
                  </div>
                  <div style={{ padding:20, display:'grid', gridTemplateColumns:'1fr auto', gap:20, alignItems:'center' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
                      {[
                        ['Ruta', vuelo ? `${vuelo.origenCode} → ${vuelo.destinoCode}` : '—'],
                        ['Fecha', vuelo ? formatFecha(vuelo.fechaSalida) : '—'],
                        ['Horario', vuelo ? `${formatHora(vuelo.fechaSalida)} → ${formatHora(vuelo.fechaLlegada)}` : '—'],
                        ['Asiento', r.idAsiento ? r.idAsiento.split('-').slice(1).join('') : '—'],
                      ].map(([l,v]) => (
                        <div key={l}>
                          <div style={{ fontSize:11, color:'#9CA3AF', fontWeight:700, marginBottom:3 }}>{l}</div>
                          <div style={{ fontSize:14, fontWeight:700, color:'#0D1B2A' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:11, color:'#9CA3AF' }}>Total pagado</div>
                      <div style={{ fontSize:20, fontWeight:800, color:'#0D1B2A' }}>${(pago?.monto||0).toLocaleString('es-DO')}</div>
                      <div style={{ fontSize:11, color:'#6B7A8D', marginBottom:12 }}>{pago?.metodoPago || '—'}</div>
                      {r.estado !== 'cancelada' && (
                        <Btn onClick={() => setCancelarId(r)} variant="danger" size="sm">Cancelar reserva</Btn>
                      )}
                      {r.estado === 'cancelada' && pago?.estado === 'reembolsado' && (
                        <Badge color="blue">Reembolso procesado</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ))}

        {tab === 'historial' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              <StatCard label="Vuelos realizados" value={todasConfirmadas.length} icon="✈" color="#1E6FD9" />
              <StatCard label="Total invertido"
                value={`RD$${AppData.pagos.filter(p=>p.estado==='aprobado'&&AppData.reservas.find(r=>r.idPago===p.idPago&&r.idUsuario===user.idUsuario)).reduce((s,p)=>s+p.monto,0).toLocaleString('es-DO')}`}
                icon="💰" color="#16A34A" />
              <StatCard label="Destinos visitados"
                value={new Set(todasConfirmadas.map(r=>AppData.getVuelo(r.idVuelo)?.destinoCode).filter(Boolean)).size}
                icon="🌍" color="#7C3AED" />
            </div>

            {todasConfirmadas.length === 0 ? (
              <Card style={{ textAlign:'center', padding:48 }}>
                <div style={{ fontSize:40, marginBottom:12 }}>✈</div>
                <h3 style={{ color:'#0D1B2A', margin:'0 0 8px' }}>Sin vuelos en el historial</h3>
                <p style={{ color:'#6B7A8D', margin:'0 0 20px' }}>¡Reserva tu primer vuelo y comienza tu historial!</p>
                <Btn onClick={() => navigate('home')}>Buscar vuelos</Btn>
              </Card>
            ) : (
              <Card>
                <h3 style={{ margin:'0 0 20px', fontSize:16, fontWeight:700, color:'#0D1B2A' }}>Todos mis vuelos</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                  {todasConfirmadas.map((r, i) => {
                    const vuelo = AppData.getVuelo(r.idVuelo);
                    const pago  = AppData.getPago(r.idPago);
                    if (!vuelo) return null;
                    const esPasado = new Date(vuelo.fechaSalida) < hoy;
                    return (
                      <div key={r.idReserva} style={{ display:'grid', gridTemplateColumns:'48px 1fr auto', gap:16, alignItems:'center', padding:'16px 0', borderBottom: i < todasConfirmadas.length-1 ? '1px solid #F3F4F6' : 'none' }}>
                        <div style={{ width:44, height:44, borderRadius:'50%', background: esPasado?'#0D1B2A':'#EFF6FF', border: esPasado?'none':'2px solid #1E6FD9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                          {esPasado ? '✓' : '✈'}
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
                          <div>
                            <div style={{ fontSize:11, color:'#9CA3AF', fontWeight:700, marginBottom:3 }}>RUTA</div>
                            <div style={{ fontSize:15, fontWeight:800, color:'#0D1B2A' }}>{vuelo.origenCode} → {vuelo.destinoCode}</div>
                            <div style={{ fontSize:11, color:'#6B7A8D', marginTop:2 }}>{vuelo.origen} → {vuelo.destino}</div>
                          </div>
                          <div>
                            <div style={{ fontSize:11, color:'#9CA3AF', fontWeight:700, marginBottom:3 }}>FECHA</div>
                            <div style={{ fontSize:13, fontWeight:600, color:'#0D1B2A' }}>{formatFecha(vuelo.fechaSalida)}</div>
                            <div style={{ fontSize:12, color:'#6B7A8D' }}>{formatHora(vuelo.fechaSalida)} → {formatHora(vuelo.fechaLlegada)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize:11, color:'#9CA3AF', fontWeight:700, marginBottom:3 }}>PNR · ASIENTO</div>
                            <div style={{ fontSize:13, fontWeight:700, color:'#0D1B2A', fontFamily:'monospace', letterSpacing:'1px' }}>{r.codigoPNR}</div>
                            <div style={{ fontSize:12, color:'#6B7A8D' }}>Asiento {r.idAsiento?.split('-').slice(1).join('')||'—'}</div>
                          </div>
                          <div>
                            <div style={{ fontSize:11, color:'#9CA3AF', fontWeight:700, marginBottom:3 }}>DURACIÓN</div>
                            <div style={{ fontSize:13, fontWeight:600, color:'#0D1B2A' }}>{duracion(vuelo.fechaSalida, vuelo.fechaLlegada)}</div>
                            <div style={{ fontSize:12, color:'#6B7A8D' }}>Directo</div>
                          </div>
                        </div>
                        <div style={{ textAlign:'right', minWidth:130 }}>
                          <div style={{ fontSize:16, fontWeight:800, color:'#0D1B2A' }}>RD${(pago?.monto||0).toLocaleString('es-DO')}</div>
                          <div style={{ marginTop:6 }}>{esPasado ? <Badge color="gray">Completado</Badge> : <StatusBadge estado={r.estado} />}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}

      </div>

      {tab === 'millas' && esCorporativo && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Resumen de millas */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
              <div style={{ background:'linear-gradient(135deg,#1E3A5F,#1E6FD9)', borderRadius:16, padding:20, boxShadow:'0 4px 20px rgba(30,111,217,0.25)' }}>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', fontWeight:600, marginBottom:6, letterSpacing:'0.5px' }}>SALDO ACTUAL</div>
                <div style={{ fontSize:36, fontWeight:800, color:'#fff' }}>{millasActuales.toLocaleString()}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)', marginTop:4 }}>millas disponibles</div>
              </div>
              <Card style={{ padding:20 }}>
                <div style={{ fontSize:12, color:'#6B7A8D', fontWeight:600, marginBottom:6 }}>EQUIVALENTE EN PESOS</div>
                <div style={{ fontSize:28, fontWeight:800, color:'#0D1B2A' }}>${millasActuales.toLocaleString('es-DO')}</div>
                <div style={{ fontSize:12, color:'#6B7A8D', marginTop:4 }}>DOP en descuentos</div>
              </Card>
              <Card style={{ padding:20, background:'#FFFBEB', border:'1px solid #FDE68A' }}>
                <div style={{ fontSize:12, color:'#92400E', fontWeight:600, marginBottom:6 }}>TASA DE ACUMULACIÓN</div>
                <div style={{ fontSize:28, fontWeight:800, color:'#92400E' }}>1:10</div>
                <div style={{ fontSize:12, color:'#92400E', marginTop:4 }}>1 milla por cada $10 DOP</div>
              </Card>
            </div>

            {/* Cómo funciona */}
            <Card style={{ background:'#EFF6FF', border:'1px solid #BFDBFE' }}>
              <div style={{ display:'flex', gap:24, alignItems:'center', flexWrap:'wrap' }}>
                {[['✈','Acumula','Ganas 1 milla por cada $10 DOP en reservas confirmadas como cliente corporativo.'],
                  ['💳','Canjea','Usa tus millas como descuento al pagar: 100 millas = $100 DOP.'],
                  ['♾','Sin vencimiento','Tus millas no vencen. Acumúlalas a tu propio ritmo.'],
                ].map(([ic,t,d]) => (
                  <div key={t} style={{ flex:1, minWidth:180, display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ fontSize:24, flexShrink:0 }}>{ic}</div>
                    <div>
                      <div style={{ fontWeight:700, color:'#1D4ED8', fontSize:14, marginBottom:3 }}>{t}</div>
                      <div style={{ fontSize:12, color:'#3B82F6', lineHeight:1.5 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Historial */}
            <Card>
              <h3 style={{ margin:'0 0 18px', fontSize:16, fontWeight:700, color:'#0D1B2A' }}>Historial de movimientos</h3>
              {historialMillas.length === 0 ? (
                <div style={{ textAlign:'center', padding:32, color:'#9CA3AF' }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>✈</div>
                  <p style={{ margin:0 }}>Aún no tienes movimientos de millas. ¡Reserva tu primer vuelo!</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                  {historialMillas.map((h, i) => {
                    const esAcreditacion = h.millas > 0;
                    return (
                      <div key={h.id} style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 0', borderBottom: i < historialMillas.length-1 ? '1px solid #F3F4F6' : 'none' }}>
                        {/* Icon */}
                        <div style={{ width:40, height:40, borderRadius:12, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
                          background: esAcreditacion ? '#F0FDF4' : '#FEF2F2' }}>
                          {esAcreditacion ? '✈' : '🎟'}
                        </div>
                        {/* Info */}
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:14, color:'#0D1B2A' }}>{h.descripcion}</div>
                          <div style={{ fontSize:12, color:'#9CA3AF', marginTop:2 }}>{formatFecha(h.fecha)}</div>
                        </div>
                        {/* Millas */}
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:18, fontWeight:800, color: esAcreditacion ? '#16A34A' : '#DC2626' }}>
                            {esAcreditacion ? '+' : ''}{h.millas.toLocaleString()} millas
                          </div>
                          <div style={{ fontSize:11, color:'#9CA3AF' }}>
                            {esAcreditacion ? 'Acreditación' : 'Canje'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

      <Modal open={!!cancelarId} onClose={() => setCancelarId(null)} title="Cancelar reserva">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:14, fontSize:14, color:'#991B1B' }}>
            ⚠ Esta acción no se puede deshacer. Se cancelará tu reserva PNR <strong>{cancelarId?.codigoPNR}</strong>.
          </div>
          {cancelarId && (() => {
            const pct = getPorcentajeReembolso(cancelarId);
            const pago = AppData.getPago(cancelarId.idPago);
            const monto = pago?.monto || 0;
            const reembolso = Math.round(monto * pct);
            const dentroSemana = pct === 1.0;
            return (
              <div style={{ background: dentroSemana ? '#F0FDF4' : '#FEF3C7', border:`1px solid ${dentroSemana?'#BBF7D0':'#FDE68A'}`, borderRadius:10, padding:14 }}>
                <div style={{ fontWeight:700, fontSize:14, color: dentroSemana?'#166534':'#92400E', marginBottom:6 }}>
                  {dentroSemana ? '✓ Reembolso completo (100%)' : '⚠ Reembolso parcial (80%)'}
                </div>
                <div style={{ fontSize:13, color: dentroSemana?'#166534':'#92400E', lineHeight:1.6 }}>
                  {dentroSemana
                    ? <>Tu reserva tiene menos de 7 días. Recibirás un reembolso completo de <strong>${reembolso.toLocaleString('es-DO')} DOP</strong>.</>
                    : <>Tu reserva tiene más de 7 días. Según nuestra política, recibirás el 80% del monto pagado: <strong>${reembolso.toLocaleString('es-DO')} DOP</strong> en los próximos 5–7 días hábiles.</>
                  }
                </div>
              </div>
            );
          })()}
          <p style={{ fontSize:13, color:'#6B7A8D', margin:0, lineHeight:1.6 }}>
            <strong>Política de cancelación:</strong> cancelaciones dentro de los primeros 7 días desde la reserva reciben reembolso del 100%. Después de 7 días, el reembolso es del 80%.
          </p>
          <div style={{ display:'flex', gap:10 }}>
            <Btn variant="secondary" onClick={() => setCancelarId(null)} style={{ flex:1, justifyContent:'center' }}>Mantener reserva</Btn>
            <Btn variant="danger" onClick={() => cancelar(cancelarId)} style={{ flex:1, justifyContent:'center' }}>Sí, cancelar</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── PanelAgenteScreen ─────────────────────────────────────────────────────────
function PanelAgenteScreen({ navigate, user }) {
  const [tab, setTab] = useState('reservas');
  const [pnrBuscar, setPnrBuscar] = useState('');
  const [resultadoPNR, setResultadoPNR] = useState(null);
  const [editarVuelo, setEditarVuelo] = useState(null);
  const [vueloForm, setVueloForm] = useState({});
  const [msg, setMsg] = useState('');

  function buscarPNR() {
    const r = AppData.reservas.find(r => r.codigoPNR === pnrBuscar.trim().toUpperCase());
    setResultadoPNR(r || false);
  }

  function guardarVuelo() {
    Object.assign(editarVuelo, vueloForm);
    setEditarVuelo(null);
    setMsg('Vuelo actualizado correctamente.');
    setTimeout(() => setMsg(''), 3000);
  }

  const tabs = [['reservas','Gestión de Reservas'],['vuelos','Administrar Vuelos']];

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', background:'#F5F7FA' }}>
      <div style={{ background:'#0D1B2A', padding:'32px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <h1 style={{ color:'#fff', margin:0, fontSize:24, fontWeight:800 }}>Panel de Agente</h1>
              <p style={{ color:'rgba(255,255,255,0.5)', margin:'4px 0 0', fontSize:14 }}>Bienvenido, {user?.nombre}</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[['Total reservas', AppData.reservas.length],['Confirmadas', AppData.reservas.filter(r=>r.estado==='confirmada').length],['Pendientes', AppData.reservas.filter(r=>r.estado==='pendiente').length]].map(([l,v]) => (
                <div key={l} style={{ background:'rgba(255,255,255,0.08)', borderRadius:10, padding:'10px 16px', textAlign:'center' }}>
                  <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{v}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'28px 24px' }}>
        {msg && <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10, padding:12, marginBottom:16, fontSize:14, color:'#166534' }}>✓ {msg}</div>}

        <div style={{ display:'flex', gap:4, marginBottom:24, background:'#E5E7EB', borderRadius:10, padding:4, width:'fit-content' }}>
          {tabs.map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ padding:'8px 20px', borderRadius:8, border:'none', cursor:'pointer', fontSize:14, fontWeight:600, background: tab===k?'#fff':'transparent', color: tab===k?'#0D1B2A':'#6B7A8D', boxShadow: tab===k?'0 1px 4px rgba(0,0,0,0.1)':'none' }}>{l}</button>
          ))}
        </div>

        {tab === 'reservas' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* PNR Search */}
            <Card>
              <h3 style={{ margin:'0 0 14px', fontSize:15, fontWeight:700, color:'#0D1B2A' }}>Buscar por código PNR</h3>
              <div style={{ display:'flex', gap:10 }}>
                <input value={pnrBuscar} onChange={e=>setPnrBuscar(e.target.value.toUpperCase())}
                  onKeyDown={e=>e.key==='Enter'&&buscarPNR()}
                  placeholder="Ej: AX7B29"
                  style={{ flex:1, padding:'10px 14px', borderRadius:10, border:'1px solid #DDE3EC', fontSize:14, fontFamily:'monospace', letterSpacing:'2px', fontWeight:700, outline:'none' }} />
                <Btn onClick={buscarPNR}>Buscar</Btn>
              </div>
              {resultadoPNR === false && <div style={{ marginTop:10, fontSize:13, color:'#DC2626' }}>No se encontró ninguna reserva con ese PNR.</div>}
              {resultadoPNR && (() => {
                const vuelo = AppData.getVuelo(resultadoPNR.idVuelo);
                const usr = AppData.getUsuario(resultadoPNR.idUsuario);
                const pago = AppData.getPago(resultadoPNR.idPago);
                return (
                  <div style={{ marginTop:14, background:'#F5F7FA', borderRadius:12, padding:16 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:12 }}>
                      {[['PNR',resultadoPNR.codigoPNR],['Pasajero',usr?.nombre||'—'],['Ruta',vuelo?`${vuelo.origenCode}→${vuelo.destinoCode}`:'—'],['Estado',resultadoPNR.estado]].map(([l,v]) => (
                        <div key={l}><div style={{ fontSize:11, color:'#9CA3AF', fontWeight:700 }}>{l}</div><div style={{ fontSize:14, fontWeight:700, color:'#0D1B2A', marginTop:3 }}>{v}</div></div>
                      ))}
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      {resultadoPNR.estado === 'pendiente' && <Btn size="sm" variant="success" onClick={() => { AppData.updateReservaEstado(resultadoPNR.idReserva,'confirmada'); setResultadoPNR({...resultadoPNR,estado:'confirmada'}); }}>Confirmar reserva</Btn>}
                      {resultadoPNR.estado !== 'cancelada' && <Btn size="sm" variant="danger" onClick={() => { AppData.updateReservaEstado(resultadoPNR.idReserva,'cancelada'); setResultadoPNR({...resultadoPNR,estado:'cancelada'}); }}>Cancelar reserva</Btn>}
                    </div>
                  </div>
                );
              })()}
            </Card>

            {/* All reservations */}
            <Card>
              <h3 style={{ margin:'0 0 16px', fontSize:15, fontWeight:700, color:'#0D1B2A' }}>Todas las reservas</h3>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                <thead>
                  <tr style={{ background:'#F5F7FA' }}>
                    {['PNR','Pasajero','Vuelo','Fecha','Asiento','Estado','Monto','Acciones'].map(h => (
                      <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:12, fontWeight:700, color:'#6B7A8D', border:'none' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AppData.reservas.map((r,i) => {
                    const vuelo = AppData.getVuelo(r.idVuelo);
                    const usr = AppData.getUsuario(r.idUsuario);
                    const pago = AppData.getPago(r.idPago);
                    return (
                      <tr key={r.idReserva} style={{ borderTop:'1px solid #F3F4F6', background: i%2===0?'#fff':'#FAFBFC' }}>
                        <td style={{ padding:'10px 12px', fontFamily:'monospace', fontWeight:700, color:'#1E6FD9' }}>{r.codigoPNR}</td>
                        <td style={{ padding:'10px 12px', color:'#1A2433' }}>{usr?.nombre||'—'}</td>
                        <td style={{ padding:'10px 12px', color:'#1A2433' }}>{vuelo?`${vuelo.origenCode}→${vuelo.destinoCode}`:'—'}</td>
                        <td style={{ padding:'10px 12px', color:'#6B7A8D' }}>{formatFecha(r.fechaReserva)}</td>
                        <td style={{ padding:'10px 12px', color:'#1A2433', fontFamily:'monospace' }}>{r.idAsiento?.split('-').slice(1).join('')||'—'}</td>
                        <td style={{ padding:'10px 12px' }}><StatusBadge estado={r.estado} /></td>
                        <td style={{ padding:'10px 12px', fontWeight:700, color:'#0D1B2A' }}>${(pago?.monto||0).toLocaleString('es-DO')}</td>
                        <td style={{ padding:'10px 12px' }}>
                          {r.estado === 'pendiente' && <button onClick={() => { AppData.updateReservaEstado(r.idReserva,'confirmada'); setTab('reservas'); }} style={{ fontSize:12, color:'#16A34A', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>Confirmar</button>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {tab === 'vuelos' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {AppData.vuelos.map(v => (
              <Card key={v.idVuelo} style={{ padding:0, overflow:'hidden' }}>
                <div style={{ padding:'14px 20px', display:'grid', gridTemplateColumns:'auto 1fr auto auto', gap:16, alignItems:'center' }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>✈</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, color:'#0D1B2A' }}>{v.origen} → {v.destino}</div>
                    <div style={{ fontSize:13, color:'#6B7A8D', marginTop:3 }}>{formatFecha(v.fechaSalida)} · {formatHora(v.fechaSalida)} → {formatHora(v.fechaLlegada)} · {duracion(v.fechaSalida,v.fechaLlegada)}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:18, fontWeight:800, color:'#0D1B2A' }}>${v.precio.toLocaleString('es-DO')}</div>
                    <StatusBadge estado={v.estado} />
                  </div>
                  <Btn size="sm" variant="ghost" onClick={() => { setEditarVuelo(v); setVueloForm({ precio:v.precio, estado:v.estado }); }}>Editar</Btn>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!editarVuelo} onClose={() => setEditarVuelo(null)} title={`Editar vuelo: ${editarVuelo?.origen} → ${editarVuelo?.destino}`}>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Input label="Precio (DOP)" type="number" value={vueloForm.precio||''} onChange={e=>setVueloForm({...vueloForm,precio:+e.target.value})} />
          <Select label="Estado del vuelo" value={vueloForm.estado||''} onChange={e=>setVueloForm({...vueloForm,estado:e.target.value})}
            options={[{value:'programado',label:'Programado'},{value:'cancelado',label:'Cancelado'},{value:'retrasado',label:'Retrasado'}]} />
          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <Btn variant="secondary" onClick={() => setEditarVuelo(null)} style={{ flex:1, justifyContent:'center' }}>Cancelar</Btn>
            <Btn onClick={guardarVuelo} style={{ flex:1, justifyContent:'center' }}>Guardar cambios</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── PanelAdminScreen ──────────────────────────────────────────────────────────
function PanelAdminScreen({ navigate, user }) {
  const [tab, setTab] = useState('dashboard');
  const [reporteForm, setReporteForm] = useState({ tipo:'ventas', fechaInicio:'', fechaFin:'', formato:'PDF' });
  const [msg, setMsg] = useState('');

  const totalIngresos = AppData.pagos.filter(p=>p.estado==='aprobado').reduce((s,p)=>s+p.monto,0);
  const totalReembolsos = AppData.pagos.filter(p=>p.estado==='reembolsado').reduce((s,p)=>s+p.monto,0);

  function toggleUsuario(u) {
    AppData.updateUsuarioActivo(u.idUsuario, !u.activo);
    setMsg(`Usuario ${u.nombre} ${!u.activo?'activado':'desactivado'}.`);
    setTimeout(() => setMsg(''), 3000);
  }

  function generarReporte() {
    if (!reporteForm.fechaInicio || !reporteForm.fechaFin) { setMsg('Selecciona el rango de fechas.'); return; }
    AppData.addReporte({ ...reporteForm, idReporte: AppData.reportes.length+1, generadoPor: user.idUsuario, fecha: new Date().toISOString().split('T')[0] });
    setMsg(`Reporte de ${reporteForm.tipo} generado exitosamente.`);
    setTimeout(() => setMsg(''), 4000);
  }

  function procesarReembolso(pago) {
    pago.estado = 'reembolsado';
    const r = AppData.reservas.find(r=>r.idPago===pago.idPago);
    if (r) r.estado = 'cancelada';
    setMsg(`Reembolso de $${pago.monto.toLocaleString('es-DO')} procesado.`);
    setTimeout(() => setMsg(''), 4000);
  }

  const tabs = [['dashboard','Dashboard'],['usuarios','Usuarios'],['reportes','Reportes'],['reembolsos','Reembolsos']];

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', background:'#F5F7FA' }}>
      <div style={{ background:'#0D1B2A', padding:'32px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h1 style={{ color:'#fff', margin:0, fontSize:24, fontWeight:800 }}>Administración del Sistema</h1>
            <p style={{ color:'rgba(255,255,255,0.5)', margin:'4px 0 0', fontSize:14 }}>Panel de control · {user?.nombre}</p>
          </div>
          <div style={{ background:'rgba(220,38,38,0.15)', border:'1px solid rgba(220,38,38,0.3)', borderRadius:10, padding:'8px 16px', fontSize:13, color:'#FCA5A5', fontWeight:600 }}>⚠ Modo Administrador</div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 24px' }}>
        {msg && <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10, padding:12, marginBottom:16, fontSize:14, color:'#166534' }}>✓ {msg}</div>}

        <div style={{ display:'flex', gap:4, marginBottom:24, background:'#E5E7EB', borderRadius:10, padding:4, width:'fit-content' }}>
          {tabs.map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ padding:'8px 18px', borderRadius:8, border:'none', cursor:'pointer', fontSize:14, fontWeight:600, background: tab===k?'#fff':'transparent', color: tab===k?'#0D1B2A':'#6B7A8D', boxShadow: tab===k?'0 1px 4px rgba(0,0,0,0.1)':'none' }}>{l}</button>
          ))}
        </div>

        {tab === 'dashboard' && (
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
              <StatCard label="Total usuarios" value={AppData.usuarios.length} icon="👤" color="#1E6FD9" sub={`${AppData.usuarios.filter(u=>u.activo).length} activos`} />
              <StatCard label="Total reservas" value={AppData.reservas.length} icon="📋" color="#7C3AED" sub={`${AppData.reservas.filter(r=>r.estado==='confirmada').length} confirmadas`} />
              <StatCard label="Ingresos totales" value={`$${(totalIngresos/1000).toFixed(0)}K`} icon="💰" color="#16A34A" sub="DOP aprobados" />
              <StatCard label="Reembolsos" value={`$${(totalReembolsos/1000).toFixed(0)}K`} icon="↩" color="#DC2626" sub="DOP reembolsados" />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <Card>
                <h3 style={{ margin:'0 0 16px', fontSize:15, fontWeight:700 }}>Estado de reservas</h3>
                {[['Confirmadas','confirmada','#16A34A'],['Pendientes','pendiente','#F59E0B'],['Canceladas','cancelada','#DC2626']].map(([l,e,c]) => {
                  const count = AppData.reservas.filter(r=>r.estado===e).length;
                  const pct = Math.round((count/AppData.reservas.length)*100);
                  return (
                    <div key={e} style={{ marginBottom:12 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:5 }}>
                        <span style={{ color:'#4A5568', fontWeight:500 }}>{l}</span>
                        <span style={{ fontWeight:700, color:'#0D1B2A' }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height:8, background:'#F3F4F6', borderRadius:4 }}>
                        <div style={{ height:'100%', width:`${pct}%`, background:c, borderRadius:4, transition:'width 0.6s' }} />
                      </div>
                    </div>
                  );
                })}
              </Card>
              <Card>
                <h3 style={{ margin:'0 0 16px', fontSize:15, fontWeight:700 }}>Vuelos por destino</h3>
                {AppData.vuelos.slice(0,5).map(v => {
                  const reservasVuelo = AppData.reservas.filter(r=>r.idVuelo===v.idVuelo).length;
                  return (
                    <div key={v.idVuelo} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, fontSize:14 }}>
                      <span style={{ color:'#4A5568' }}>{v.origenCode} → {v.destinoCode}</span>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:60, height:6, background:'#F3F4F6', borderRadius:3 }}>
                          <div style={{ height:'100%', width:`${Math.min(100,(reservasVuelo/3)*100)}%`, background:'#1E6FD9', borderRadius:3 }} />
                        </div>
                        <span style={{ fontWeight:700, color:'#0D1B2A', width:16, textAlign:'right' }}>{reservasVuelo}</span>
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
          </div>
        )}

        {tab === 'usuarios' && (
          <Card>
            <SectionHeader title="Gestión de usuarios" subtitle={`${AppData.usuarios.length} usuarios registrados`} />
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
              <thead>
                <tr style={{ background:'#F5F7FA' }}>
                  {['ID','Nombre','Email','Tipo','Rol','Millas','Estado','Acciones'].map(h=>(
                    <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:12, fontWeight:700, color:'#6B7A8D' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AppData.usuarios.map((u,i) => (
                  <tr key={u.idUsuario} style={{ borderTop:'1px solid #F3F4F6', background: i%2===0?'#fff':'#FAFBFC' }}>
                    <td style={{ padding:'12px 14px', color:'#9CA3AF', fontSize:12 }}>#{u.idUsuario}</td>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:'#1E6FD9', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0 }}>{u.nombre.charAt(0)}</div>
                        <span style={{ fontWeight:600, color:'#0D1B2A' }}>{u.nombre}</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 14px', color:'#6B7A8D' }}>{u.email}</td>
                    <td style={{ padding:'12px 14px' }}>
                      {u.tipoCliente ? (
                        <Badge color={u.tipoCliente==='corporativo'?'blue':'gray'}>
                          {u.tipoCliente==='corporativo'?'🏢 Corporativo':'🛍️ Minorista'}
                        </Badge>
                      ) : <span style={{ color:'#9CA3AF', fontSize:12 }}>—</span>}
                    </td>
                    <td style={{ padding:'12px 14px' }}><Badge color={u.rol==='admin'?'yellow':u.rol==='agente'?'blue':'green'}>{u.rol}</Badge></td>
                    <td style={{ padding:'12px 14px', fontWeight:600, color: u.millas>0?'#1D4ED8':'#9CA3AF', fontSize:13 }}>
                      {u.tipoCliente==='corporativo' ? `✈ ${(u.millas||0).toLocaleString()}` : '—'}
                    </td>
                    <td style={{ padding:'12px 14px' }}><StatusBadge estado={u.activo?'activo':'inactivo'} /></td>
                    <td style={{ padding:'12px 14px' }}>
                      {u.rol !== 'admin' && (
                        <button onClick={() => toggleUsuario(u)}
                          style={{ fontSize:12, color: u.activo?'#DC2626':'#16A34A', background:'none', border:`1px solid ${u.activo?'#FECACA':'#BBF7D0'}`, borderRadius:6, padding:'4px 10px', cursor:'pointer', fontWeight:600 }}>
                          {u.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {tab === 'reportes' && (
          <div style={{ display:'grid', gridTemplateColumns:'360px 1fr', gap:24 }}>
            <Card>
              <h3 style={{ margin:'0 0 20px', fontSize:16, fontWeight:700, color:'#0D1B2A' }}>Generar reporte</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <Select label="Tipo de reporte" value={reporteForm.tipo} onChange={e=>setReporteForm({...reporteForm,tipo:e.target.value})}
                  options={[{value:'ventas',label:'Ventas'},{value:'ocupacion',label:'Ocupación de vuelos'},{value:'usuarios',label:'Usuarios'},{value:'reembolsos',label:'Reembolsos'}]} />
                <Input label="Fecha inicio" type="date" value={reporteForm.fechaInicio} onChange={e=>setReporteForm({...reporteForm,fechaInicio:e.target.value})} />
                <Input label="Fecha fin" type="date" value={reporteForm.fechaFin} onChange={e=>setReporteForm({...reporteForm,fechaFin:e.target.value})} />
                <Select label="Formato" value={reporteForm.formato} onChange={e=>setReporteForm({...reporteForm,formato:e.target.value})}
                  options={[{value:'PDF',label:'PDF'},{value:'Excel',label:'Excel'},{value:'CSV',label:'CSV'}]} />
                <Btn onClick={generarReporte} style={{ width:'100%', justifyContent:'center' }}>Generar reporte</Btn>
              </div>
            </Card>
            <Card>
              <h3 style={{ margin:'0 0 16px', fontSize:16, fontWeight:700, color:'#0D1B2A' }}>Historial de reportes</h3>
              {AppData.reportes.length === 0 ? (
                <div style={{ textAlign:'center', padding:32, color:'#9CA3AF' }}>Sin reportes generados</div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {[...AppData.reportes].reverse().map(r => (
                    <div key={r.idReporte} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:14, background:'#F5F7FA', borderRadius:10 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14, color:'#0D1B2A', textTransform:'capitalize' }}>Reporte de {r.tipo}</div>
                        <div style={{ fontSize:12, color:'#6B7A8D', marginTop:3 }}>{formatFecha(r.fechaInicio)} → {formatFecha(r.fechaFin)}</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <Badge color="gray">{r.formato}</Badge>
                        <Btn size="sm" variant="ghost">↓ Descargar</Btn>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {tab === 'reembolsos' && (
          <Card>
            <SectionHeader title="Gestión de reembolsos" subtitle="Pagos pendientes y procesados" />
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
              <thead>
                <tr style={{ background:'#F5F7FA' }}>
                  {['ID Pago','Reserva (PNR)','Monto','Método','Estado','Fecha','Acciones'].map(h=>(
                    <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:12, fontWeight:700, color:'#6B7A8D' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AppData.pagos.map((p,i) => {
                  const reserva = AppData.reservas.find(r=>r.idPago===p.idPago);
                  return (
                    <tr key={p.idPago} style={{ borderTop:'1px solid #F3F4F6', background: i%2===0?'#fff':'#FAFBFC' }}>
                      <td style={{ padding:'12px 14px', color:'#9CA3AF', fontSize:12 }}>#{p.idPago}</td>
                      <td style={{ padding:'12px 14px', fontFamily:'monospace', fontWeight:700, color:'#1E6FD9' }}>{reserva?.codigoPNR||'—'}</td>
                      <td style={{ padding:'12px 14px', fontWeight:700, color:'#0D1B2A' }}>${p.monto.toLocaleString('es-DO')}</td>
                      <td style={{ padding:'12px 14px', color:'#6B7A8D', textTransform:'capitalize' }}>{p.metodoPago}</td>
                      <td style={{ padding:'12px 14px' }}><StatusBadge estado={p.estado} /></td>
                      <td style={{ padding:'12px 14px', color:'#6B7A8D' }}>{formatFecha(p.fecha)}</td>
                      <td style={{ padding:'12px 14px' }}>
                        {p.estado === 'aprobado' && (
                          <button onClick={() => procesarReembolso(p)}
                            style={{ fontSize:12, color:'#7C3AED', background:'#F5F3FF', border:'1px solid #DDD6FE', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontWeight:600 }}>
                            Procesar reembolso
                          </button>
                        )}
                        {p.estado === 'reembolsado' && <span style={{ fontSize:12, color:'#9CA3AF' }}>Procesado</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { MisReservasScreen, PanelAgenteScreen, PanelAdminScreen });
