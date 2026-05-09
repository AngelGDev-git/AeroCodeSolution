✈️ AeroCode Solution
AeroCode Solution es una aplicación web desarrollada como proyecto universitario para simular el funcionamiento de un sistema de aerolínea. El sistema permite la visualización de vuelos, la gestión de reservas y la simulación del proceso de pago, alineando su implementación con modelos UML de clases (Paso 8) y diagramas de actividad (Paso 9).

🎯 Objetivo del Proyecto
Diseñar e implementar un sistema frontend que refleje correctamente:

El modelo estructural (Diagrama de Clases – Paso 8)
El modelo de comportamiento (Diagramas de Actividad – Paso 9)

Garantizando coherencia entre el análisis, el diseño y la implementación.

🧰 Tecnologías Utilizadas

HTML5
CSS3
JavaScript (ES6+)
Arquitectura por componentes
Manejo de datos locales (data.js)


📁 Estructura del Proyecto
AeroCodeSolution/
│
├── index.html
├── app.jsx
├── data.js
├── components.jsx
│
├── screens/
│   ├── screens-home.jsx
│   ├── screens-dashboard.jsx
│   └── screens-booking.jsx
│
└── README.md


🧱 Modelo Estructural – Diagrama de Clases (Paso 8)
El sistema se diseñó a partir de un diagrama de clases UML que define las principales entidades del sistema, sus atributos, métodos y relaciones.
📦 Clases identificadas

Usuario (clase base)

Administrador
Agente
Pasajero


Vuelo
Asiento
Reserva
Pago
Reembolso
Reporte

🧩 Representación en el proyecto
Aunque el proyecto está implementado en JavaScript y no utiliza clases formales, estas entidades se representan mediante:

Objetos estructurados (data.js)
Separación de responsabilidades por pantalla
Flujos funcionales alineados al comportamiento UML

📌 Ejemplo:

Un Vuelo contiene múltiples Asientos
Una Reserva se asocia a un Vuelo, un Pasajero y un Pago
El Pago maneja monto, moneda (DOP) y estado


🔄 Modelo de Comportamiento – Diagramas de Actividad (Paso 9)
El sistema cubre los 6 casos de uso definidos en los diagramas de actividad:

Autenticar Usuario
Administrar Vuelos
Gestionar Reservas
Generar Reportes
Procesar Reembolsos
Reservar Vuelo

Cada pantalla del sistema corresponde a uno o más de estos flujos.

🖥️ Descripción de Pantallas y Alineación UML

🏠 Pantalla de Inicio – screens-home.jsx
🔹 Función

Mostrar los vuelos disponibles
Permitir la selección de origen y destino

🔹 Alineación con Diagramas

Clase: Vuelo
Caso de uso: Reservar Vuelo
Actividades UML:

Mostrar vuelos
Seleccionar vuelo



🔹 Métodos conceptuales reflejados

Consultar vuelos
Listar destinos (desde data.js)

📌 Los destinos mostrados provienen exclusivamente de data.js, respetando el modelo de clases.

📊 Dashboard de Vuelos – screens-dashboard.jsx
🔹 Función

Visualizar información detallada de vuelos
Simular una vista de gestión

🔹 Alineación con Diagramas

Clases: Vuelo, Asiento
Caso de uso: Administrar Vuelos

🔹 Actividades UML

Consultar vuelos
Ver disponibilidad de asientos

📌 Esta pantalla representa la gestión operacional del sistema.

🧾 Pantalla de Reserva y Pago – screens-booking.jsx
🔹 Función

Confirmar la reserva
Simular el pago
Generar código PNR

🔹 Alineación con Diagramas

Clases: Reserva, Pasajero, Pago
Caso de uso: Reservar Vuelo

🔹 Actividades UML

Confirmar selección
Calcular monto
Generar PNR
Confirmar reserva

🔹 Reglas importantes

La moneda utilizada es Peso Dominicano (DOP)
El pago es una simulación académica

📌 El uso de Intl.NumberFormat("es-DO", { currency: "DOP" }) garantiza coherencia local.

💳 Manejo de Moneda
Todas las operaciones monetarias del sistema se expresan en Pesos Dominicanos (DOP), alineadas al contexto del sistema y al modelo de negocio definido en el análisis.
Ejemplo de formato:
RD$ 8,500.00


🔑 Generación de Código PNR
El código PNR se genera como parte del flujo Reservar Vuelo, tal como lo indica el diagrama de actividad.

Identifica de forma única la reserva
Confirma el cierre exitoso del proceso
