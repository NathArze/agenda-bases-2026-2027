# Agenda de bases · Dolce Meza

Aplicación web para consultar la disponibilidad de las bases, revisar los pedidos agendados, enviar solicitudes y administrar su aprobación.

## Funciones

- 8 bases con fotografía y calendario de disponibilidad.
- Agenda completa con filtros por año, base y búsqueda.
- Solicitudes de pedidos o apartados de base.
- Panel de administrador para aprobar o rechazar solicitudes.
- Correcciones de pedidos agendados con aprobación del administrador.
- Respaldo local si se pierde la conexión.

## Uso

Abre `index.html` directamente en el navegador o entra a la versión publicada en GitHub Pages.

## Estructura

```
index.html   interfaz y estilos
data.js      configuración, bases y pedidos
app.js       lógica de calendario, agenda y administración
assets/      fotografías de las bases y logotipo
events.json  pedidos base en formato JSON
```

Las solicitudes y correcciones se guardan en Supabase. Las aprobadas se reflejan automáticamente en la agenda y bloquean la base correspondiente.

## Privacidad

El repositorio contiene nombres y teléfonos de clientes. Si el repositorio es público, esa información también es pública.
