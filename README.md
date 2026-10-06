# Agenda de bases 2026–2027

App de una sola página (HTML) para consultar **si una base de pastel está libre o ya está comprometida** en una fecha, con los pedidos de 2026 y 2027.

No necesita internet, servidor ni instalación: abre `index.html` en el navegador del celular y ya funciona. Todo se guarda en el navegador (localStorage), así que las reservas que apartas se quedan en tu equipo.

## Cómo se usa

1. **Bases** — toca la base que quieres apartar. Cada tarjeta muestra si está `libre` o cuántas fechas tiene ocupadas, y la próxima fecha en la que no está comprometida.
2. **Calendario** — elige el día. Los puntos rojos marcan los días en que **esa base ya está ocupada**; los grises marcan días con otro evento de otra base.
3. **Resultado** — veredicto: `DISPONIBLE`, `OCUPADA` o `LIBRE` (con la advertencia de que ese día usaron una base parecida). Abajo aparece la ficha del evento que la ocupa: cliente, teléfono, base, pedido, precio, anticipo y lugar.
4. **Apartar** — si está libre, la apartas y capturas **cliente, pastel, lugar del evento y lo que dejó a cuenta**. Se guarda en la pestaña 🔖 *Apartadas*, que además avisa si esa fecha choca con un evento ya agendado.

También hay dos pestañas de consulta: **📅 Agenda** (los 28 eventos, con filtros por año y por base) y **🔖 Apartadas**.

## Contenido

- 15 bases (8 con fotografía, el resto con emoji).
- 28 eventos: 18 en 2026 (jul–dic) y 10 en 2027 (ene–nov).
- Las fotos de las bases van incrustadas en el propio HTML (comprimidas en base64) para que el archivo sea autónomo.

## Nota de privacidad

El repositorio es **privado** porque el archivo contiene nombres de clientes y sus teléfonos. Si alguna vez se hace público, esa información queda expuesta: conviene.ofuscar o quitar los teléfonos antes.

## Estructura

```
index.html   toda la aplicación (HTML + CSS + JS en un solo archivo)
```

## Recomendaciones

- Added para consultar en el celular: ábrelo con Chrome/Safari y usa "Añadir a pantalla de inicio" para tener un ícono como si fuera app.
- Si editas la lista de pedidos, los datos están en dos arreglos al inicio del `<script>`: `BASES` (catálogo de bases) y `EVENTS` (los pedidos). Cada evento usa `bs` (bases que ocupa, bloquean el calendario) y `rl` (bases parecidas, solo avisan).