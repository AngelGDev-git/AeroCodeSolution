// AeroLinea — Mock Data Store
(function() {
  const now = new Date('2026-05-15');

  const usuarios = [
    { idUsuario: 1, nombre: 'María García',   email: 'maria@email.com',         contraseña: '123456',    rol: 'cliente', tipoCliente: 'corporativo', millas: 3200,  activo: true },
    { idUsuario: 2, nombre: 'Juan Pérez',     email: 'juan@email.com',           contraseña: '123456',    rol: 'cliente', tipoCliente: 'minorista',   millas: 0,     activo: true },
    { idUsuario: 3, nombre: 'Carlos López',   email: 'agente@aerolinea.com',     contraseña: 'agente123', rol: 'agente',  tipoCliente: null,           millas: 0,     activo: true },
    { idUsuario: 4, nombre: 'Admin Sistema',  email: 'admin@aerolinea.com',      contraseña: 'admin123',  rol: 'admin',   tipoCliente: null,           millas: 0,     activo: true },
    { idUsuario: 5, nombre: 'Laura Martínez', email: 'laura@email.com',          contraseña: '123456',    rol: 'cliente', tipoCliente: 'corporativo', millas: 1500,  activo: true },
    { idUsuario: 6, nombre: 'Pedro Sánchez',  email: 'pedro@email.com',          contraseña: '123456',    rol: 'cliente', tipoCliente: 'minorista',   millas: 0,     activo: false },
  ];

  const vuelos = [
    { idVuelo: 1, origen: 'Santo Domingo', origenCode:'SDQ', destino: 'Santiago',       destinoCode:'STI', fechaSalida:'2026-05-20T07:00', fechaLlegada:'2026-05-20T07:45', capacidad:150, precio:4500,  aerolinea:'Aerocode Solution', estado:'programado' },
    { idVuelo: 2, origen: 'Santo Domingo', origenCode:'SDQ', destino: 'Punta Cana',     destinoCode:'PUJ', fechaSalida:'2026-05-20T09:30', fechaLlegada:'2026-05-20T10:15', capacidad:180, precio:5200,  aerolinea:'Aerocode Solution', estado:'programado' },
    { idVuelo: 3, origen: 'Santo Domingo', origenCode:'SDQ', destino: 'Puerto Plata',   destinoCode:'POP', fechaSalida:'2026-05-20T11:00', fechaLlegada:'2026-05-20T11:50', capacidad:150, precio:4800,  aerolinea:'Aerocode Solution', estado:'programado' },
    { idVuelo: 4, origen: 'Santo Domingo', origenCode:'SDQ', destino: 'Miami',          destinoCode:'MIA', fechaSalida:'2026-05-20T06:30', fechaLlegada:'2026-05-20T09:00', capacidad:200, precio:18000, aerolinea:'Aerocode Solution', estado:'programado' },
    { idVuelo: 5, origen: 'Santo Domingo', origenCode:'SDQ', destino: 'Nueva York',     destinoCode:'JFK', fechaSalida:'2026-05-21T08:00', fechaLlegada:'2026-05-21T11:30', capacidad:220, precio:22000, aerolinea:'Aerocode Solution', estado:'programado' },
    { idVuelo: 6, origen: 'Santiago',      origenCode:'STI', destino: 'Santo Domingo',  destinoCode:'SDQ', fechaSalida:'2026-05-21T14:00', fechaLlegada:'2026-05-21T14:50', capacidad:150, precio:4500,  aerolinea:'Aerocode Solution', estado:'programado' },
    { idVuelo: 7, origen: 'Santo Domingo', origenCode:'SDQ', destino: 'Bogotá',         destinoCode:'BOG', fechaSalida:'2026-05-22T13:00', fechaLlegada:'2026-05-22T16:20', capacidad:200, precio:28000, aerolinea:'Aerocode Solution', estado:'programado' },
    { idVuelo: 8, origen: 'Santo Domingo', origenCode:'SDQ', destino: 'Madrid',         destinoCode:'MAD', fechaSalida:'2026-05-23T22:00', fechaLlegada:'2026-05-24T14:00', capacidad:280, precio:55000, aerolinea:'Aerocode Solution', estado:'programado' },
  ];

  // Generate seats for each flight
  function generarAsientos(idVuelo) {
    const asientos = [];
    const ocupados = new Set();
    // Pre-occupy some seats randomly
    const total = 33 * 6;
    for (let i = 0; i < Math.floor(total * 0.35); i++) {
      ocupados.add(Math.floor(Math.random() * total));
    }
    let idx = 0;
    // Business (rows 1-3, 4 seats: A B  D E)
    for (let row = 1; row <= 3; row++) {
      for (const col of ['A','B','D','E']) {
        asientos.push({
          idAsiento: `${idVuelo}-${row}${col}`,
          numero: `${row}${col}`,
          fila: row,
          columna: col,
          clase: 'business',
          estado: ocupados.has(idx) ? 'ocupado' : 'disponible',
          idVuelo,
        });
        idx++;
      }
    }
    // Economy (rows 4-33, 6 seats: A B C  D E F)
    for (let row = 4; row <= 33; row++) {
      for (const col of ['A','B','C','D','E','F']) {
        asientos.push({
          idAsiento: `${idVuelo}-${row}${col}`,
          numero: `${row}${col}`,
          fila: row,
          columna: col,
          clase: 'economy',
          estado: ocupados.has(idx) ? 'ocupado' : 'disponible',
          idVuelo,
        });
        idx++;
      }
    }
    return asientos;
  }

  const asientosPorVuelo = {};
  vuelos.forEach(v => { asientosPorVuelo[v.idVuelo] = generarAsientos(v.idVuelo); });

  const reservas = [
    { idReserva: 101, codigoPNR:'AX7B29', idUsuario:1, idVuelo:1, idAsiento:'1-5A', fechaReserva:'2026-05-10', estado:'confirmada', idPago:201 },
    { idReserva: 102, codigoPNR:'BK3M91', idUsuario:1, idVuelo:4, idAsiento:'4-12C', fechaReserva:'2026-05-08', estado:'confirmada', idPago:202 },
    { idReserva: 103, codigoPNR:'CR5P47', idUsuario:2, idVuelo:3, idAsiento:'3-8B', fechaReserva:'2026-05-12', estado:'pendiente', idPago:203 },
    { idReserva: 104, codigoPNR:'DL9Q73', idUsuario:5, idVuelo:7, idAsiento:'7-15F', fechaReserva:'2026-05-11', estado:'cancelada', idPago:204 },
    { idReserva: 105, codigoPNR:'EM2R58', idUsuario:2, idVuelo:8, idAsiento:'8-2A', fechaReserva:'2026-05-13', estado:'confirmada', idPago:205 },
  ];

  const pagos = [
    { idPago:201, idReserva:101, monto:1850, estado:'aprobado',   metodoPago:'tarjeta', fecha:'2026-05-10', ultimos4:'4242' },
    { idPago:202, idReserva:102, monto:3200, estado:'aprobado',   metodoPago:'tarjeta', fecha:'2026-05-08', ultimos4:'1234' },
    { idPago:203, idReserva:103, monto:2350, estado:'pendiente',  metodoPago:'transferencia', fecha:'2026-05-12', ultimos4:null },
    { idPago:204, idReserva:104, monto:5800, estado:'reembolsado',metodoPago:'tarjeta', fecha:'2026-05-11', ultimos4:'5678' },
    { idPago:205, idReserva:105, monto:12500,estado:'aprobado',   metodoPago:'tarjeta', fecha:'2026-05-13', ultimos4:'9012' },
  ];

  const reportes = [
    { idReporte:1, tipo:'ventas', fechaInicio:'2026-05-01', fechaFin:'2026-05-15', formato:'PDF', generadoPor:4, fecha:'2026-05-15' },
    { idReporte:2, tipo:'ocupacion', fechaInicio:'2026-04-01', fechaFin:'2026-04-30', formato:'Excel', generadoPor:4, fecha:'2026-05-01' },
  ];

  // Historial de millas pre-cargado para usuarios corporativos
  const historialMillas = [
    { id:1, idUsuario:1, tipo:'acreditacion', millas:1850, descripcion:'Reserva MEX→GDL · PNR AX7B29', fecha:'2026-05-10' },
    { id:2, idUsuario:1, tipo:'acreditacion', millas:3200, descripcion:'Reserva MEX→CUN · PNR BK3M91', fecha:'2026-05-08' },
    { id:3, idUsuario:1, tipo:'canje',        millas:-1850, descripcion:'Descuento aplicado en pago', fecha:'2026-05-12' },
    { id:4, idUsuario:5, tipo:'acreditacion', millas:1500, descripcion:'Reserva MEX→LAX · PNR EM2R58', fecha:'2026-05-13' },
  ];

  window.AppData = {
    usuarios,
    vuelos,
    asientosPorVuelo,
    reservas,
    pagos,
    reportes,
    // Helper methods
    getVuelo: (id) => vuelos.find(v => v.idVuelo === id),
    getUsuario: (id) => usuarios.find(u => u.idUsuario === id),
    getPago: (id) => pagos.find(p => p.idPago === id),
    getReservasByUsuario: (idUsuario) => reservas.filter(r => r.idUsuario === idUsuario),
    autenticar: (email, contraseña) => usuarios.find(u => u.email === email && u.contraseña === contraseña && u.activo),
    generarPNR: () => Math.random().toString(36).substring(2,8).toUpperCase(),
    nextReservaId: () => Math.max(...reservas.map(r => r.idReserva)) + 1,
    nextPagoId: () => Math.max(...pagos.map(p => p.idPago)) + 1,
    addReserva: (r) => reservas.push(r),
    addPago: (p) => pagos.push(p),
    addReporte: (r) => reportes.push(r),
    updateReservaEstado: (id, estado) => { const r = reservas.find(r=>r.idReserva===id); if(r) r.estado=estado; },
    updateUsuarioActivo: (id, activo) => { const u = usuarios.find(u=>u.idUsuario===id); if(u) u.activo=activo; },
    addUsuario: (u) => { u.idUsuario = Math.max(...usuarios.map(u=>u.idUsuario))+1; usuarios.push(u); return u; },
    // ── Millas ──────────────────────────────────────────────────────────────
    // Solo clientes corporativos acumulan millas: 1 milla por cada $10 MXN
    calcularMillas: (monto) => Math.floor(monto / 10),
    // 100 millas = $100 MXN de descuento
    millasADescuento: (millas) => millas,
    acreditarMillas: (idUsuario, monto) => {
      const u = usuarios.find(u => u.idUsuario === idUsuario);
      if (u && u.tipoCliente === 'corporativo') {
        const ganadas = Math.floor(monto / 10);
        u.millas = (u.millas || 0) + ganadas;
        historialMillas.push({ id: historialMillas.length+1, idUsuario, tipo:'acreditacion', millas: ganadas, descripcion:`Reserva confirmada`, fecha: new Date().toISOString().split('T')[0] });
        return ganadas;
      }
      return 0;
    },
    descontarMillas: (idUsuario, millas) => {
      const u = usuarios.find(u => u.idUsuario === idUsuario);
      if (u && u.millas >= millas) {
        u.millas -= millas;
        historialMillas.push({ id: historialMillas.length+1, idUsuario, tipo:'canje', millas: -millas, descripcion:`Descuento aplicado en pago`, fecha: new Date().toISOString().split('T')[0] });
        return true;
      }
      return false;
    },
    getHistorialMillas: (idUsuario) => historialMillas.filter(h => h.idUsuario === idUsuario).slice().reverse(),
    // ── Política de cancelación ──────────────────────────────────────────────
    // Dentro de 7 días desde la reserva → reembolso 100%
    // Después de 7 días → reembolso 80%
    calcularReembolso: (fechaReserva) => {
      const diasDesde = Math.floor((Date.now() - new Date(fechaReserva).getTime()) / 86400000);
      return diasDesde <= 7 ? 1.0 : 0.8;
    },
  };
})();
