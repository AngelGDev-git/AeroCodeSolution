// Screens: Resultados, Asientos, Pago, Confirmación
const { useState, useEffect } = React;

// ── ResultadosScreen ──────────────────────────────────────────────────────────
function ResultadosScreen({ navigate, screenData, user }) {
  const { busqueda } = screenData || {};
  const [ordenar, setOrdenar] = useState('precio');
  const [filtroMax, setFiltroMax] = useState(20000);

  const vuelos = AppData.vuelos.filter(v => {
    const origenOk = !busqueda?.origen || v.origen.toLowerCase().includes(busqueda.origen.toLowerCase());
    const destinoOk = !busqueda?.destino || v.destino.toLowerCase().includes(busqueda.destino.toLowerCase());
    return origenOk && destinoOk && v.precio <= filtroMax;
  });

  const ordenados = [...vuelos].sort((a,b) => ordenar==='precio' ? a.precio-b.precio : new Date(a.fechaSalida)-new Date(b.fechaSalida));

  function seleccionarVuelo(v) {
    if (!user) { navigate('login'); return; }
    navigate('asientos', { vuelo: v, busqueda });
  }

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', background:'#F5F7FA' }}>
      {/* Header */}
      <div style={{ background:'#0D1B2A', padding:'28px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <h2 style={{ margin:0, color:'#fff', fontSize:20, fontWeight:700 }}>
              {busqueda?.origen || 'Todos los orígenes'} → {busqueda?.destino || 'Todos los destinos'}
            </h2>
            {busqueda?.fecha && <span style={{ color:'rgba(255,255,255,0.6)', fontSize:14 }}>📅 {formatFecha(busqueda.fecha)}</span>}
            {busqueda?.pasajeros && <span style={{ color:'rgba(255,255,255,0.6)', fontSize:14 }}>👤 {busqueda.pasajeros} pasajero{busqueda.pasajeros>1?'s':''}</span>}
            <button onClick={() => navigate('home')} style={{ marginLeft:'auto', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, color:'#fff', padding:'6px 14px', cursor:'pointer', fontSize:13 }}>← Modificar búsqueda</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 24px', display:'grid', gridTemplateColumns:'260px 1fr', gap:24 }}>
        {/* Filters */}
        <div>
          <Card style={{ position:'sticky', top:80 }}>
            <h3 style={{ margin:'0 0 20px', fontSize:16, fontWeight:700, color:'#0D1B2A' }}>Filtros</h3>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'#4A5568', display:'block', marginBottom:10 }}>Precio máximo: {formatMonto(filtroMax)}</label>
              <input type="range" min={1000} max={20000} step={500} value={filtroMax}
                onChange={e=>setFiltroMax(+e.target.value)}
                style={{ width:'100%', accentColor:'#1E6FD9' }} />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#9CA3AF', marginTop:4 }}>
                <span>$1,000</span><span>$20,000</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#4A5568', display:'block', marginBottom:10 }}>Ordenar por</label>
              {[['precio','Precio más bajo'],['hora','Hora de salida']].map(([v,l]) => (
                <label key={v} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, cursor:'pointer', fontSize:14, color:'#1A2433' }}>
                  <input type="radio" name="orden" value={v} checked={ordenar===v} onChange={()=>setOrdenar(v)} style={{ accentColor:'#1E6FD9' }} />
                  {l}
                </label>
              ))}
            </div>
          </Card>
        </div>

        {/* Results */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <span style={{ fontSize:14, color:'#6B7A8D', fontWeight:500 }}>{ordenados.length} vuelo{ordenados.length!==1?'s':''} encontrado{ordenados.length!==1?'s':''}</span>
          </div>

          {ordenados.length === 0 ? (
            <Card style={{ textAlign:'center', padding:48 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
              <h3 style={{ color:'#0D1B2A', margin:'0 0 8px' }}>Sin resultados</h3>
              <p style={{ color:'#6B7A8D', margin:0 }}>Intenta con otros filtros o destinos.</p>
            </Card>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {ordenados.map(v => {
                const asientos = AppData.asientosPorVuelo[v.idVuelo] || [];
                const disponibles = asientos.filter(a=>a.estado==='disponible').length;
                return (
                  <Card key={v.idVuelo} style={{ cursor:'pointer', transition:'all 0.2s', padding:0, overflow:'hidden' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:0 }}>
                      <div style={{ padding:'20px 24px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:16 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:'#1E6FD9', letterSpacing:'0.5px' }}>AeroLinea MX</span>
                          <span style={{ fontSize:11, color:'#9CA3AF' }}>• Vuelo #{v.idVuelo.toString().padStart(3,'0')}</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:24 }}>
                          <div style={{ textAlign:'center' }}>
                            <div style={{ fontSize:28, fontWeight:800, color:'#0D1B2A', letterSpacing:'-0.5px' }}>{formatHora(v.fechaSalida)}</div>
                            <div style={{ fontSize:12, color:'#6B7A8D', fontWeight:600 }}>{v.origenCode}</div>
                            <div style={{ fontSize:12, color:'#6B7A8D', marginTop:2 }}>{v.origen.split(' ')[0]}</div>
                          </div>
                          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                            <div style={{ fontSize:12, color:'#6B7A8D', fontWeight:600 }}>{duracion(v.fechaSalida, v.fechaLlegada)}</div>
                            <div style={{ position:'relative', width:'100%', height:2, background:'#DDE3EC' }}>
                              <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', background:'#F5F7FA', padding:'0 6px', fontSize:16 }}>✈</div>
                            </div>
                            <div style={{ fontSize:11, color:'#9CA3AF' }}>Directo</div>
                          </div>
                          <div style={{ textAlign:'center' }}>
                            <div style={{ fontSize:28, fontWeight:800, color:'#0D1B2A', letterSpacing:'-0.5px' }}>{formatHora(v.fechaLlegada)}</div>
                            <div style={{ fontSize:12, color:'#6B7A8D', fontWeight:600 }}>{v.destinoCode}</div>
                            <div style={{ fontSize:12, color:'#6B7A8D', marginTop:2 }}>{v.destino.split(' ')[0]}</div>
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:12, marginTop:14 }}>
                          <span style={{ fontSize:12, color: disponibles < 10 ? '#DC2626' : '#16A34A', fontWeight:600 }}>
                            {disponibles < 10 ? `⚡ ¡Solo ${disponibles} asientos!` : `✓ ${disponibles} asientos disponibles`}
                          </span>
                        </div>
                      </div>
                      <div style={{ background:'#F5F7FA', borderLeft:'1px solid #DDE3EC', padding:'20px 24px', display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'space-between', minWidth:160 }}>
                        <div>
                          <div style={{ fontSize:11, color:'#9CA3AF', textAlign:'right' }}>Desde</div>
                          <div style={{ fontSize:26, fontWeight:800, color:'#0D1B2A' }}>${v.precio.toLocaleString('es-DO')}</div>
                          <div style={{ fontSize:11, color:'#6B7A8D', textAlign:'right' }}>DOP / persona</div>
                        </div>
                        <Btn onClick={() => seleccionarVuelo(v)} size="sm" style={{ width:'100%', justifyContent:'center', marginTop:12 }}>
                          Seleccionar →
                        </Btn>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── AsientosScreen ────────────────────────────────────────────────────────────
function AsientosScreen({ navigate, screenData, user }) {
  const { vuelo, busqueda } = screenData || {};
  const [seleccionado, setSeleccionado] = useState(null);
  const asientos = vuelo ? AppData.asientosPorVuelo[vuelo.idVuelo] || [] : [];

  const businessSeats = asientos.filter(a=>a.clase==='business');
  const economySeats  = asientos.filter(a=>a.clase==='economy');

  function renderSeatRow(row, asientosRow, cols) {
    return (
      <div key={row} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
        <span style={{ width:24, fontSize:11, color:'#9CA3AF', textAlign:'right', flexShrink:0 }}>{row}</span>
        <div style={{ display:'flex', gap:6 }}>
          {cols.map((col, ci) => {
            const a = asientosRow.find(s=>s.columna===col);
            if (!a) return <div key={col} style={{ width:34, height:34, visibility: col==='-' ? 'hidden' : 'visible' }} />;
            const isGap = (cols.indexOf(col) === 2 && cols.length === 6); // aisle gap
            const bgColor = a.estado==='ocupado' ? '#DDE3EC' : seleccionado?.idAsiento===a.idAsiento ? '#1E6FD9' : a.clase==='business' ? '#FEF3C7' : '#F0FDF4';
            const textColor = a.estado==='ocupado' ? '#9CA3AF' : seleccionado?.idAsiento===a.idAsiento ? '#fff' : '#1A2433';
            return (
              <React.Fragment key={col}>
                {ci === 3 && cols.length === 6 && <div style={{ width:18 }} />}
                <button
                  disabled={a.estado==='ocupado'}
                  onClick={() => setSeleccionado(seleccionado?.idAsiento===a.idAsiento ? null : a)}
                  style={{ width:34, height:34, borderRadius:6, border: seleccionado?.idAsiento===a.idAsiento ? '2px solid #1E6FD9' : '1px solid #DDE3EC',
                    background:bgColor, color:textColor, fontSize:10, fontWeight:700, cursor: a.estado==='ocupado'?'not-allowed':'pointer', transition:'all 0.1s' }}>
                  {col}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  const businessRows = [...new Set(businessSeats.map(a=>a.fila))];
  const economyRows  = [...new Set(economySeats.map(a=>a.fila))];

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', background:'#F5F7FA' }}>
      <div style={{ background:'#0D1B2A', padding:'20px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', gap:16 }}>
          <button onClick={() => navigate('resultados', { busqueda })} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, color:'#fff', padding:'6px 14px', cursor:'pointer', fontSize:13 }}>← Volver</button>
          <div style={{ color:'#fff' }}>
            <div style={{ fontWeight:700, fontSize:16 }}>{vuelo?.origen} → {vuelo?.destino}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>Selecciona tu asiento · {formatFecha(vuelo?.fechaSalida)} · {formatHora(vuelo?.fechaSalida)}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 24px', display:'grid', gridTemplateColumns:'1fr 320px', gap:24 }}>
        {/* Seat Map */}
        <Card>
          <h3 style={{ margin:'0 0 20px', fontSize:16, fontWeight:700, color:'#0D1B2A' }}>Mapa de asientos</h3>

          {/* Legend */}
          <div style={{ display:'flex', gap:20, marginBottom:24 }}>
            {[['#F0FDF4','Disponible (Economy)'],['#FEF3C7','Business Class'],['#1E6FD9','Seleccionado'],['#DDE3EC','Ocupado']].map(([bg,lbl]) => (
              <div key={lbl} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#6B7A8D' }}>
                <div style={{ width:18, height:18, borderRadius:4, background:bg, border:'1px solid #DDE3EC', flexShrink:0 }} />
                {lbl}
              </div>
            ))}
          </div>

          {/* Column labels */}
          <div style={{ overflowX:'auto' }}>
            <div style={{ display:'flex', gap:6, marginBottom:8, paddingLeft:30 }}>
              {['A','B','','C','D','E','F'].map((c,i) => (
                <div key={i} style={{ width: c==='' ? 18 : 34, textAlign:'center', fontSize:11, color:'#6B7A8D', fontWeight:700, flexShrink:0 }}>{c}</div>
              ))}
            </div>

            {/* Business */}
            <div style={{ background:'#FFFBEB', borderRadius:10, padding:'12px 10px', marginBottom:12, border:'1px solid #FDE68A' }}>
              <div style={{ fontSize:11, color:'#92400E', fontWeight:700, marginBottom:8, paddingLeft:30 }}>✦ BUSINESS CLASS</div>
              {businessRows.map(row => renderSeatRow(row, businessSeats.filter(a=>a.fila===row), ['A','B','D','E']))}
            </div>

            {/* Divider */}
            <div style={{ textAlign:'center', fontSize:12, color:'#9CA3AF', margin:'8px 0', borderTop:'2px dashed #DDE3EC', paddingTop:8 }}>— CLASE ECONÓMICA —</div>

            {/* Economy */}
            <div style={{ maxHeight:340, overflowY:'auto', padding:'4px 10px' }}>
              {economyRows.map(row => renderSeatRow(row, economySeats.filter(a=>a.fila===row), ['A','B','C','D','E','F']))}
            </div>
          </div>
        </Card>

        {/* Summary */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Card>
            <h3 style={{ margin:'0 0 16px', fontSize:16, fontWeight:700, color:'#0D1B2A' }}>Resumen de vuelo</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10, fontSize:14 }}>
              {[
                ['Ruta', `${vuelo?.origenCode} → ${vuelo?.destinoCode}`],
                ['Salida', `${formatFecha(vuelo?.fechaSalida)} ${formatHora(vuelo?.fechaSalida)}`],
                ['Llegada', formatHora(vuelo?.fechaLlegada)],
                ['Duración', duracion(vuelo?.fechaSalida, vuelo?.fechaLlegada)],
                ['Clase', seleccionado ? (seleccionado.clase==='business'?'Business Class':'Económica') : '—'],
              ].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', color:'#4A5568' }}>
                  <span style={{ color:'#6B7A8D' }}>{l}</span>
                  <span style={{ fontWeight:600, color:'#0D1B2A' }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>

          {seleccionado ? (
            <Card style={{ border:'2px solid #1E6FD9', background:'#EFF6FF' }}>
              <div style={{ fontSize:13, color:'#1D4ED8', fontWeight:600, marginBottom:6 }}>✓ Asiento seleccionado</div>
              <div style={{ fontSize:28, fontWeight:800, color:'#0D1B2A', marginBottom:4 }}>Asiento {seleccionado.numero}</div>
              <div style={{ fontSize:13, color:'#6B7A8D', marginBottom:16 }}>{seleccionado.clase === 'business' ? 'Business Class' : 'Clase Económica'} · Fila {seleccionado.fila}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:'1px solid #BFDBFE' }}>
                <div>
                  <div style={{ fontSize:11, color:'#6B7A8D' }}>Precio total</div>
                  <div style={{ fontSize:22, fontWeight:800, color:'#0D1B2A' }}>${(vuelo?.precio + (seleccionado.clase==='business'?2000:0)).toLocaleString('es-DO')}</div>
                </div>
                <Btn onClick={() => navigate('pago', { vuelo, asiento:seleccionado, busqueda })}>Continuar →</Btn>
              </div>
            </Card>
          ) : (
            <Card style={{ textAlign:'center', padding:32, border:'2px dashed #DDE3EC' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>👆</div>
              <div style={{ fontSize:14, color:'#6B7A8D' }}>Selecciona un asiento del mapa para continuar</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ── PagoScreen ────────────────────────────────────────────────────────────────
function PagoScreen({ navigate, screenData, user }) {
  const { vuelo, asiento, busqueda } = screenData || {};
  const precioBase = vuelo?.precio || 0;
  const extras = asiento?.clase === 'business' ? 2000 : 0;
  const impuestos = Math.round((precioBase + extras) * 0.16);
  const subtotal = precioBase + extras + impuestos;
  const total = Math.max(0, subtotal - descuentoMillas);

  const [metodo, setMetodo] = useState('tarjeta');
  const [form, setForm] = useState({ titular:'', numero:'', vence:'', cvv:'', banco:'', referencia:'' });
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);
  const esCorporativo = user?.tipoCliente === 'corporativo';
  const millasDisponibles = user?.millas || 0;
  const [millasAplicar, setMillasAplicar] = useState(0);
  const descuentoMillas = AppData.millasADescuento(millasAplicar);

  function validar() {
    const e = {};
    if (!form.titular.trim()) e.titular = 'Requerido';
    if (metodo==='tarjeta') {
      if (form.numero.replace(/\s/g,'').length < 16) e.numero = 'Número inválido';
      if (!form.vence.match(/^\d{2}\/\d{2}$/)) e.vence = 'Formato MM/AA';
      if (form.cvv.length < 3) e.cvv = 'CVV inválido';
    }
    return e;
  }

  function pagar() {
    const e = validar();
    if (Object.keys(e).length) { setErrores(e); return; }
    setProcesando(true);
    setTimeout(() => {
      const pnr = AppData.generarPNR();
      const idReserva = AppData.nextReservaId();
      const idPago = AppData.nextPagoId();
      // Descontar millas si se aplicaron
      if (millasAplicar > 0) AppData.descontarMillas(user.idUsuario, millasAplicar);
      AppData.addPago({ idPago, idReserva, monto:total, estado:'aprobado', metodoPago:metodo, fecha:new Date().toISOString().split('T')[0], ultimos4: metodo==='tarjeta' ? form.numero.slice(-4) : null });
      AppData.addReserva({ idReserva, codigoPNR:pnr, idUsuario:user.idUsuario, idVuelo:vuelo.idVuelo, idAsiento:asiento.idAsiento, fechaReserva:new Date().toISOString().split('T')[0], estado:'confirmada', idPago });
      // Acreditar millas a clientes corporativos
      const millasGanadas = AppData.acreditarMillas(user.idUsuario, total);
      // Actualizar sesión local
      const usuarioActualizado = AppData.getUsuario(user.idUsuario);
      if (usuarioActualizado) { try { localStorage.setItem('aerolinea_user', JSON.stringify(usuarioActualizado)); } catch(e){} }
      navigate('confirmacion', { vuelo, asiento, pnr, total, metodo, millasGanadas, millasAplicadas: millasAplicar });
    }, 2000);
  }

  function fmtCard(v) { return v.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().substring(0,19); }

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', background:'#F5F7FA' }}>
      <div style={{ background:'#0D1B2A', padding:'20px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', gap:16 }}>
          <button onClick={() => navigate('asientos', { vuelo, busqueda })} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, color:'#fff', padding:'6px 14px', cursor:'pointer', fontSize:13 }}>← Volver</button>
          <div style={{ color:'#fff', fontWeight:700, fontSize:16 }}>Proceso de pago</div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 24px', display:'grid', gridTemplateColumns:'1fr 340px', gap:24 }}>
        {/* Payment form */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Method */}
          <Card>
            <h3 style={{ margin:'0 0 16px', fontSize:16, fontWeight:700, color:'#0D1B2A' }}>Método de pago</h3>
            <div style={{ display:'flex', gap:10 }}>
              {[['tarjeta','💳 Tarjeta'],['transferencia','🏦 Transferencia']].map(([v,l]) => (
                <button key={v} onClick={() => setMetodo(v)}
                  style={{ flex:1, padding:'12px', borderRadius:12, border: metodo===v ? '2px solid #1E6FD9' : '1px solid #DDE3EC',
                    background: metodo===v ? '#EFF6FF' : '#fff', cursor:'pointer', fontSize:14, fontWeight:600,
                    color: metodo===v ? '#1D4ED8' : '#4A5568' }}>
                  {l}
                </button>
              ))}
            </div>
          </Card>

          {metodo === 'tarjeta' ? (
            <Card>
              <h3 style={{ margin:'0 0 20px', fontSize:16, fontWeight:700, color:'#0D1B2A' }}>Datos de la tarjeta</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <Input label="Titular de la tarjeta" value={form.titular} onChange={e=>setForm({...form,titular:e.target.value})} placeholder="Nombre como aparece en la tarjeta" error={errores.titular} />
                <Input label="Número de tarjeta" value={form.numero} onChange={e=>setForm({...form,numero:fmtCard(e.target.value)})} placeholder="0000 0000 0000 0000" error={errores.numero} />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <Input label="Vencimiento" value={form.vence} onChange={e=>{
                    let v=e.target.value.replace(/\D/g,'');
                    if(v.length>=3)v=v.substring(0,2)+'/'+v.substring(2,4);
                    setForm({...form,vence:v});
                  }} placeholder="MM/AA" error={errores.vence} />
                  <Input label="CVV" value={form.cvv} onChange={e=>setForm({...form,cvv:e.target.value.replace(/\D/g,'').substring(0,4)})} placeholder="123" error={errores.cvv} />
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <h3 style={{ margin:'0 0 16px', fontSize:16, fontWeight:700, color:'#0D1B2A' }}>Datos de transferencia</h3>
              <div style={{ background:'#F5F7FA', borderRadius:10, padding:16, fontSize:14, color:'#4A5568', lineHeight:1.8, marginBottom:16 }}>
                <div><strong>Banco:</strong> Banorte</div>
                <div><strong>CLABE:</strong> 0721 8000 1234 5678 90</div>
                <div><strong>Beneficiario:</strong> AeroLinea MX S.A. de C.V.</div>
                <div><strong>Referencia:</strong> Tu correo electrónico</div>
              </div>
              <Input label="Tu banco de origen" value={form.banco} onChange={e=>setForm({...form,banco:e.target.value})} placeholder="Nombre de tu banco" />
              <div style={{ marginTop:14 }}>
                <Input label="Número de referencia / folio" value={form.referencia} onChange={e=>setForm({...form,referencia:e.target.value})} placeholder="Folio de la transferencia" />
              </div>
              <Input label="Nombre del ordenante" value={form.titular} onChange={e=>setForm({...form,titular:e.target.value})} placeholder="Tu nombre completo" error={errores.titular} />
            </Card>
          )}

          <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:12, padding:14, fontSize:13, color:'#166534', display:'flex', gap:10, alignItems:'flex-start' }}>
            <span style={{ flexShrink:0 }}>🔒</span>
            <span>Tus datos de pago están cifrados con tecnología SSL de 256 bits. Nunca almacenamos información completa de tarjetas.</span>
          </div>
        </div>

        {/* Order summary */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Card>
            <h3 style={{ margin:'0 0 16px', fontSize:16, fontWeight:700, color:'#0D1B2A' }}>Resumen del pedido</h3>
            <div style={{ background:'#F5F7FA', borderRadius:10, padding:14, marginBottom:16 }}>
              <div style={{ fontWeight:700, color:'#0D1B2A', fontSize:14 }}>{vuelo?.origen} → {vuelo?.destino}</div>
              <div style={{ fontSize:13, color:'#6B7A8D', marginTop:3 }}>{formatFecha(vuelo?.fechaSalida)} · {formatHora(vuelo?.fechaSalida)}</div>
              <div style={{ fontSize:13, color:'#6B7A8D', marginTop:3 }}>Asiento {asiento?.numero} · {asiento?.clase==='business'?'Business':'Económica'}</div>
              <div style={{ fontSize:13, color:'#6B7A8D', marginTop:3 }}>Pasajero: {user?.nombre}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:14 }}>
              {[['Tarifa base', `$${precioBase.toLocaleString('es-DO')}`],
                ...(extras?[['Suplemento Business', `$${extras.toLocaleString('es-DO')}`]]:[]),
                ['Impuestos (16%)', `$${impuestos.toLocaleString('es-DO')}`],
              ].map(([l,v])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', color:'#6B7A8D' }}><span>{l}</span><span>{v}</span></div>
              ))}

              {/* Millas — solo clientes corporativos */}
              {esCorporativo && millasDisponibles > 0 && (
                <div style={{ borderTop:'1px solid #DDE3EC', paddingTop:10, marginTop:2 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                    <span style={{ color:'#6B7A8D', display:'flex', alignItems:'center', gap:4 }}>✈ Millas disponibles</span>
                    <span style={{ fontWeight:700, color:'#1D4ED8' }}>{millasDisponibles.toLocaleString()} millas</span>
                  </div>
                  <div style={{ background:'#EFF6FF', borderRadius:10, padding:12 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:'#1D4ED8', display:'block', marginBottom:8 }}>Aplicar millas como descuento</label>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <input type="range" min={0} max={Math.min(millasDisponibles, subtotal)} step={100} value={millasAplicar}
                        onChange={e => setMillasAplicar(+e.target.value)}
                        style={{ flex:1, accentColor:'#1E6FD9' }} />
                      <span style={{ fontSize:13, fontWeight:700, color:'#1D4ED8', minWidth:80, textAlign:'right' }}>
                        {millasAplicar.toLocaleString()} millas
                      </span>
                    </div>
                    {millasAplicar > 0 && (
                      <div style={{ fontSize:12, color:'#16A34A', fontWeight:600, marginTop:6 }}>
                        − ${descuentoMillas.toLocaleString('es-DO')} DOP de descuento aplicado
                      </div>
                    )}
                  </div>
                </div>
              )}
              {esCorporativo && millasDisponibles === 0 && (
                <div style={{ background:'#F5F7FA', borderRadius:8, padding:'8px 10px', fontSize:12, color:'#6B7A8D' }}>
                  ✈ Al confirmar ganarás <strong>{AppData.calcularMillas(total).toLocaleString()} millas</strong> corporativas
                </div>
              )}

              <div style={{ borderTop:'2px solid #DDE3EC', marginTop:8, paddingTop:12, display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:18, color:'#0D1B2A' }}>
                <span>Total</span><span>${total.toLocaleString('es-DO')} DOP</span>
              </div>
              {esCorporativo && (
                <div style={{ background:'#F0FDF4', borderRadius:8, padding:'8px 10px', fontSize:12, color:'#16A34A', display:'flex', justifyContent:'space-between' }}>
                  <span>Millas a ganar con esta compra</span>
                  <strong>+{AppData.calcularMillas(total).toLocaleString()} millas</strong>
                </div>
              )}
            </div>
          </Card>

          <Btn onClick={pagar} size="lg" disabled={procesando} style={{ width:'100%', justifyContent:'center', position:'relative' }}>
            {procesando ? (
              <span style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid #fff', borderRadius:'50%', animation:'spin 0.8s linear infinite', display:'inline-block' }} />
                Procesando pago...
              </span>
            ) : `Pagar $${total.toLocaleString('es-DO')} DOP`}
          </Btn>
          <div style={{ fontSize:12, color:'#9CA3AF', textAlign:'center' }}>Al continuar aceptas los Términos y Condiciones de AeroLinea.</div>
        </div>
      </div>
    </div>
  );
}

// ── ConfirmacionScreen ────────────────────────────────────────────────────────
function ConfirmacionScreen({ navigate, screenData }) {
  const { vuelo, asiento, pnr, total, millasGanadas, millasAplicadas } = screenData || {};
  return (
    <div style={{ minHeight:'calc(100vh - 64px)', background:'#F5F7FA', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ maxWidth:580, width:'100%' }}>
        <Card style={{ textAlign:'center', padding:40 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'#F0FDF4', border:'3px solid #16A34A', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:32 }}>✓</div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0D1B2A', margin:'0 0 8px' }}>¡Reserva confirmada!</h1>
          <p style={{ color:'#6B7A8D', margin:'0 0 28px', fontSize:15 }}>Tu vuelo ha sido reservado exitosamente. Recibirás un correo de confirmación.</p>

          <div style={{ background:'#0D1B2A', borderRadius:16, padding:24, marginBottom:24 }}>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:700, letterSpacing:'2px', marginBottom:8 }}>CÓDIGO PNR</div>
            <div style={{ fontSize:40, fontWeight:900, color:'#fff', letterSpacing:'6px', fontFamily:'monospace' }}>{pnr}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:8 }}>Guarda este código para gestionar tu reserva</div>
          </div>

          <div style={{ background:'#F5F7FA', borderRadius:12, padding:16, marginBottom:24, textAlign:'left' }}>
            {[
              ['Ruta', `${vuelo?.origen} → ${vuelo?.destino}`],
              ['Fecha de salida', `${formatFecha(vuelo?.fechaSalida)} · ${formatHora(vuelo?.fechaSalida)}`],
              ['Llegada estimada', formatHora(vuelo?.fechaLlegada)],
              ['Asiento', `${asiento?.numero} · ${asiento?.clase==='business'?'Business Class':'Económica'}`],
              ['Total pagado', `$${(total||0).toLocaleString('es-DO')} DOP`],
            ].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #DDE3EC', fontSize:14 }}>
                <span style={{ color:'#6B7A8D' }}>{l}</span>
                <span style={{ fontWeight:600, color:'#0D1B2A' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Millas ganadas */}
          {millasGanadas > 0 && (
            <div style={{ background:'linear-gradient(135deg,#1E3A5F,#1E6FD9)', borderRadius:14, padding:18, marginBottom:24, display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>✈</div>
              <div>
                <div style={{ color:'rgba(255,255,255,0.7)', fontSize:12, fontWeight:600, marginBottom:4 }}>MILLAS CORPORATIVAS ACREDITADAS</div>
                <div style={{ color:'#fff', fontSize:22, fontWeight:800 }}>+{millasGanadas.toLocaleString()} millas</div>
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:12, marginTop:2 }}>Acumuladas en tu cuenta · 1 milla por cada $10 DOP</div>
              </div>
            </div>
          )}
          {millasAplicadas > 0 && (
            <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:12, padding:14, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:14 }}>
              <span style={{ color:'#166534' }}>✓ Descuento por millas aplicado</span>
              <span style={{ fontWeight:700, color:'#166534' }}>− {millasAplicadas.toLocaleString()} millas (−${millasAplicadas.toLocaleString('es-DO')} DOP)</span>
            </div>
          )}

          <div style={{ display:'flex', gap:12 }}>
            <Btn onClick={() => navigate('mis-reservas')} variant="secondary" style={{ flex:1, justifyContent:'center' }}>Ver mis reservas</Btn>
            <Btn onClick={() => navigate('home')} style={{ flex:1, justifyContent:'center' }}>Volver al inicio</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { ResultadosScreen, AsientosScreen, PagoScreen, ConfirmacionScreen });
