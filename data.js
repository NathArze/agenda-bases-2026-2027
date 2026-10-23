const SUPABASE_URL = 'https://fnzcnwudlcdzmjskgxmx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YZiafQ78nmB58ofsDznsQA_0Th-7rOg';
const SUPABASE_TABLE = 'pending_orders';
const ADMIN_PASSWORD = 'sayurieslamejor';
const BASES = [
 {
  "id": "perla8",
  "n": "Perla de 8",
  "d": "Juego de 8 soportes con luz y list?n",
  "img": "assets/perla8.jpg",
  "tag": "8 soportes"
 },
 {
  "id": "escalera5",
  "n": "Curva de 6",
  "d": "Con luz y piedra",
  "img": "assets/escalera5.jpg",
  "tag": "6 piezas"
 },
 {
  "id": "niveles5",
  "n": "Separadores",
  "d": "Juego de separadores decorativos",
  "img": "assets/niveles5.jpg",
  "tag": "Decorativa"
 },
 {
  "id": "rizos",
  "n": "Rizos",
  "d": "Rizos con piedra",
  "img": "assets/de3.jpg",
  "tag": "Con piedra"
 },
 {
  "id": "base3",
  "n": "Flotante de 3",
  "d": "Separador flotante de 3",
  "img": "assets/snk.jpg",
  "tag": "3 piezas"
 },
 {
  "id": "flotante",
  "n": "Flotante blanco",
  "d": "Separador flotante blanco",
  "img": "assets/flotante.jpg",
  "tag": "Blanco"
 },
 {
  "id": "anillo",
  "n": "Anillo",
  "d": "Separador tipo anillo",
  "img": "assets/anillo.jpg",
  "tag": "Separador"
 },
 {
  "id": "carruaje",
  "n": "Carruaje",
  "d": "Carruaje Cenicienta de 8 con luz",
  "img": "assets/carruaje.jpg",
  "tag": "8 piezas"
 }
];
const EVENTS = [
 {
  "d": "2026-07-12",
  "tm": "",
  "c": "Ma. Teresa",
  "tel": "212-39-71-32",
  "bs": [],
  "rl": [],
  "bt": "No especificada",
  "o": "30 personas · Chocolate y oblea · Dedicatoria: “Felicidades Graduados”.",
  "pr": "$975",
  "ad": "Anticipo $200",
  "de": "Cortesía / Cotasia",
  "id": "evt-c62ed96bb6"
 },
 {
  "d": "2026-08-22",
  "tm": "5:00 PM",
  "c": "Raymundo Ruiz",
  "tel": "2222-56-14-66",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base de perla de listón",
  "o": "100 personas · Piñón blanco.",
  "pr": "$3,450",
  "ad": "—",
  "de": "Cd. Serdán, Calle 6 Ote. #106, Col. La Cuchilla · Salón de eventos Platinum",
  "id": "evt-3fbe0bed8c"
 },
 {
  "d": "2026-09-26",
  "tm": "5:00 PM",
  "c": "Moisés Olaf",
  "tel": "5552-87-82-03",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base de listón de perla luz",
  "o": "3 niveles · 100 personas · Sabores Fuster y piñón.",
  "pr": "$2,950",
  "ad": "Anticipo $500",
  "de": "Cortesía",
  "id": "evt-84aea60422"
 },
 {
  "d": "2026-10-03",
  "tm": "7:00 PM",
  "c": "Andrés Morales",
  "tel": "",
  "bs": [
   "escalera5"
  ],
  "rl": [],
  "bt": "Base 5 pzs escalonado y uno de 3 pisos",
  "o": "",
  "pr": "—",
  "ad": "—",
  "de": "La Loma · Letras en acrílico AyV · Lo lleva suc. Margaritas",
  "id": "evt-bedca715ab"
 },
 {
  "d": "2026-10-03",
  "tm": "7:30 PM",
  "c": "Isabel del Casio M. (Isabel Shz)",
  "tel": "2227-71-68-80",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs (prestada)",
  "o": "120 personas · Piñón blanco · Motivo XV años.",
  "pr": "$3,725",
  "ad": "Anticipo $500 · Resto $3,225",
  "de": "Entrega a domicilio · San Marcos, salón jardín",
  "id": "evt-b1a2031398"
 },
 {
  "d": "2026-10-03",
  "tm": "2:40 PM salir · 4:00 PM montado",
  "c": "Ma. Concepción",
  "tel": "",
  "bs": [],
  "rl": [],
  "bt": "Sin base (2 niveles)",
  "o": "150 personas · Piñón blanco · Motivo boda: cubierta blanca con rosas blancas y Nuve (imagen de referencia) · Cotizar acrílico C y F.",
  "pr": "$4,700",
  "ad": "Anticipo $1,000 · Resto $3,700",
  "de": "Salón Acrofest, Momoxpan",
  "id": "evt-74968c4e92"
 },
 {
  "d": "2026-10-10",
  "tm": "5:00 PM",
  "c": "Victoria de la Cruz (Suc. Xonaca)",
  "tel": "",
  "bs": [],
  "rl": [],
  "bt": "Sin base",
  "o": "100 pers. (3 niveles) piñón, decorado lo más parecido a la imagen · 300 pers.: plancha piñón, decorado sencillo en tonos de la imagen.",
  "pr": "$12,500",
  "ad": "Anticipo $5,000 · Resto $7,500",
  "de": "Envío a Acajete",
  "id": "evt-e9ec754ba9"
 },
 {
  "d": "2026-10-24",
  "tm": "6:30 PM",
  "c": "Ericka Bruno Luna (Ericka Bravo)",
  "tel": "2481-31-57-11",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs (prestada)",
  "o": "120 personas · Sabores: 2 piñón, 2 zarza-queso, 1 fresa, 1 durazno con crema, 1 durazno con almendra, 1 piña-coco · Decoración: diseños (cada diseño es para 2 pasteles; cada 2 pasteles llevan un diseño) · Motivo boda · Pedido Xonaca · Origen: Expo CCU mayo 2026 · Todo pagado",
  "pr": "$3,850",
  "ad": "Pagado",
  "de": "Salón Jardín Los Faroles",
  "id": "evt-724c929778"
 },
 {
  "d": "2026-10-24",
  "tm": "",
  "c": "Jofiel Hernández",
  "tel": "",
  "bs": [
   "escalera5"
  ],
  "rl": [],
  "bt": "Curva de 6 con luz y piedra",
  "o": "Pastel en base 200 personas de Ferrero, de referencia como la imagen · Origen: Expo CCU mayo 2026",
  "pr": "—",
  "ad": "A cuenta $2,800 · Falta por cobrar $3,400",
  "de": "Isacc Norton #1424, Hegel esquina, Unidad Satélite Magisterial",
  "id": "evt-57b03125a8"
 },
 {
  "d": "2026-10-31",
  "tm": "10:00 PM",
  "c": "Ingrid Cáceres",
  "tel": "",
  "bs": [],
  "rl": [],
  "bt": "Sin base (3 niveles)",
  "o": "120 personas · Turín · Decorado como imagen.",
  "pr": "$4,040",
  "ad": "Anticipo $500 · Resto $3,540",
  "de": "Salón Girasoles, Cholula",
  "id": "evt-a0ef00e6ab"
 },
 {
  "d": "2026-12-05",
  "tm": "",
  "c": "Inés Avellano (Innen Arellano)",
  "tel": "2224-38-38-41",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs + acrílico",
  "o": "120 personas · Piñón · Temática XV años romántica · Cake topper “Mis 15 Alejandra” (acrílico).",
  "pr": "$4,030",
  "ad": "Anticipo acumulado $1,500 · Restan $2,530",
  "de": "Salón Arcadia",
  "id": "evt-32ea4f1ae7"
 },
 {
  "d": "2026-11-06",
  "tm": "",
  "c": "Paola Díez G. (Paola Díaz)",
  "tel": "2229-09-93-73",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs",
  "o": "160 personas · Sabores cajeta, moka, fresa y chispas.",
  "pr": "$4,425",
  "ad": "Anticipo $500 · Resto $3,925",
  "de": "Entrega o sucursal (por definir)",
  "id": "evt-67fe5f2805"
 },
 {
  "d": "2026-11-14",
  "tm": "8:00 PM",
  "c": "Gloria Moctezuma",
  "tel": "2226-61-14-04",
  "bs": [
   "carruaje"
  ],
  "rl": [],
  "bt": "Base calabaza (= base carruaje)",
  "o": "100 personas (2 moka, 2 cajeta, 2 chocolate, 2 oreo) · Piñón blanco · Como la imagen.",
  "pr": "$2,950",
  "ad": "Anticipo $400 · Resto $2,550",
  "de": "Salón Ma. José x la rotonda de Sta. Ma.",
  "id": "evt-c2a948661d"
 },
 {
  "d": "2026-11-14",
  "tm": "",
  "c": "Sr Miguel",
  "tel": "",
  "bs": [
   "niveles5"
  ],
  "rl": [],
  "bt": "Juego de separadores decorativos",
  "o": "180 personas · Pan chocolate relleno de almendras · Fondo rosa con dorado (como la muestra de la base, pero más bonita) · Origen: Expo Haciendo Lomas 26",
  "pr": "—",
  "ad": "A cuenta $3,000",
  "de": "A Concept Puebla, Zavaleta",
  "id": "evt-3d8c703c1d"
 },
 {
  "d": "2026-11-14",
  "tm": "",
  "c": "Jaime Ibáñez (Jaime Ibarra)",
  "tel": "2213-08-33-23",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs + pastel de 2 pisos",
  "o": "300 personas (falta diseño) · Piñón blanco.",
  "pr": "$8,650",
  "ad": "Anticipo $300 · Resto $8,350",
  "de": "Cortesía (ubicación por definir)",
  "id": "evt-f16f523955"
 },
 {
  "d": "2026-11-20",
  "tm": "",
  "c": "Nathaly Gatica",
  "tel": "",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs + pastel de 2 pisos",
  "o": "200 personas · Moka.",
  "pr": "$5,000",
  "ad": "Anticipo $500 · Resto $4,500",
  "de": "Entrega o domicilio (por definir)",
  "id": "evt-809346efd7"
 },
 {
  "d": "2026-11-28",
  "tm": "",
  "c": "Aurora Benavides",
  "tel": "",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs + pastel de 2 pisos",
  "o": "130 personas · Piñón.",
  "pr": "$3,945",
  "ad": "Anticipo $945 · Resto $3,000",
  "de": "Salón Castell",
  "id": "evt-143d68825a"
 },
 {
  "d": "2026-11-28",
  "tm": "",
  "c": "Sra. Carla Martinez",
  "tel": "2227118614",
  "bs": [],
  "rl": [],
  "bt": "Sin base",
  "o": "Pastel de piñón blanco para 500 personas · Encimado en 6 pisos, fondo blanco con decorado en color cremita claro (beige) con una rosa en un domo hasta arriba, lo más parecido a la imagen de WhatsApp",
  "pr": "$16,300",
  "ad": "A cuenta $8,200 por transferencia · Restan $8,100",
  "de": "Salón La Quinta · Herencia, Contla, Tlax.",
  "id": "evt-edb55cb8b6"
 },
 {
  "d": "2026-12-04",
  "tm": "",
  "c": "Moisés Pérez",
  "tel": "",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs + 1 pastel 2 pisos",
  "o": "200 personas · Motivo boda · Sabor por definir.",
  "pr": "$5,600",
  "ad": "Anticipo $600 · Resto $5,000",
  "de": "Posada Señorial, Jardín Margaritas, Cholula",
  "id": "evt-ebed25b19d"
 },
 {
  "d": "2026-12-05",
  "tm": "",
  "c": "Ricardo Juárez",
  "tel": "",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs + 1 pastel 2 pisos",
  "o": "150 personas divididas: 70 pers. (2 pisos) envinado fresa y crema de queso con grecas, rosas rojas y 2 flores lilis · 80 pers. (base 8 pzs) almendra, cajeta, capuchino, durazno, chocolate, moka, piña coco, nuez.",
  "pr": "$5,750",
  "ad": "Anticipo $500 · Resto $5,250",
  "de": "Hacienda Zerezotla",
  "id": "evt-0c358bfdbd"
 },
 {
  "d": "2026-12-19",
  "tm": "7:00 PM",
  "c": "Ma. Isabel",
  "tel": "",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs + 1 pastel 2 pisos",
  "o": "400 personas · Almendras, cajeta, capuchino, chocolate, durazno, moka, fresa, nuez, crema · Pastel de 2 pisos sabor durazno con nuez.",
  "pr": "$9,500",
  "ad": "Anticipo $2,000 · Resto $7,500",
  "de": "No especificado",
  "id": "evt-1905131923"
 },
 {
  "d": "2027-01-02",
  "tm": "",
  "c": "Erick reyes",
  "tel": "",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs",
  "o": "P/150 personas · Lleva corona plata · 2 piñón en las altas · 1 Carlos V, 1 mazapán, 1 nutella, 1 febrero, 1 crunch, 1 kinder · Origen: Expo CCU octubre 26",
  "pr": "$5,626",
  "ad": "A cuenta $500 · Resto $5,125",
  "de": "Salón Arsola, Tierra y Libertad, Lomas del Sur",
  "id": "evt-63f62aef24"
 },
 {
  "d": "2027-01-09",
  "tm": "",
  "c": "",
  "tel": "",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs",
  "o": "Por definir.",
  "pr": "—",
  "ad": "—",
  "de": "—",
  "id": "evt-ef71a88fec"
 },
 {
  "d": "2027-01-16",
  "tm": "",
  "c": "",
  "tel": "",
  "bs": [
   "escalera5"
  ],
  "rl": [],
  "bt": "Base escalera 5 pzs",
  "o": "Por definir.",
  "pr": "—",
  "ad": "—",
  "de": "—",
  "id": "evt-6c46571c4a"
 },
 {
  "d": "2027-02-20",
  "tm": "7:00 PM",
  "c": "",
  "tel": "",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs",
  "o": "Por definir.",
  "pr": "—",
  "ad": "—",
  "de": "—",
  "id": "evt-4ddc87b15c"
 },
 {
  "d": "2027-03-12",
  "tm": "",
  "c": "",
  "tel": "",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Base listón 8 pzs",
  "o": "Por definir.",
  "pr": "—",
  "ad": "—",
  "de": "—",
  "id": "evt-d650d7999b"
 },
 {
  "d": "2027-03-20",
  "tm": "",
  "c": "Mariely",
  "tel": "2221632016 / 2225665490",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Juego de 8 soportes con luz y listón",
  "o": "200 personas, sabores Clásicos · Origen: Expo CCU octubre 26",
  "pr": "$6,500",
  "ad": "A cuenta $500",
  "de": "Recepciones Camelot, San Baltazar",
  "id": "evt-06d7139ca2"
 },
 {
  "d": "2027-04-04",
  "tm": "",
  "c": "Mara Macias Romero",
  "tel": "2213558819",
  "bs": [
   "escalera5"
  ],
  "rl": [],
  "bt": "Curva de 6 con luz y piedra",
  "o": "Tentativo · Pastel de boda 150 personas sabor Piñón · 5 pasteles con rosetones, el encimado liso · Acrílico N y G · Origen: Expo CCU octubre 26",
  "pr": "—",
  "ad": "—",
  "de": "Pendiente",
  "id": "evt-b2c4917d25"
 },
 {
  "d": "2027-04-09",
  "tm": "",
  "c": "",
  "tel": "",
  "bs": [],
  "rl": [],
  "bt": "Sin base (plancha vintage)",
  "o": "Por definir.",
  "pr": "—",
  "ad": "—",
  "de": "—",
  "id": "evt-c97f148558"
 },
 {
  "d": "2027-05-15",
  "tm": "",
  "c": "Diana Alejandro Carreon",
  "tel": "2215350447",
  "bs": [
   "perla8"
  ],
  "rl": [],
  "bt": "Jgo. 8 soportes con luz y listón",
  "o": "150 personas · Tema XV años · 8 pasteles de chocolate · Envío gratis · Base prestada gratis",
  "pr": "$4,075",
  "ad": "Abonos $3,300 · Falta por cobrar $775",
  "de": "Envío gratis",
  "id": "evt-4548b56633"
 },
 {
  "d": "2027-11-05",
  "tm": "",
  "c": "",
  "tel": "",
  "bs": [],
  "rl": [],
  "bt": "Base por definir",
  "o": "Por definir.",
  "pr": "—",
  "ad": "—",
  "de": "—",
  "id": "evt-5499f44327"
 }
];
