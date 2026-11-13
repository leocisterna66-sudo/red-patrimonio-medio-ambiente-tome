/* ==========================================================================
   MOLINO CALIFORNIA — RECORRIDO 3D
   Reconstrucción aproximada del Molino California de Tomé hacia 1900.

   No se conservan planos del edificio. Lo documentado (cuatro pisos de
   ladrillo, ventanales, ferrocarril aéreo de 1896, bodegas frente a un muelle
   propio, estero Collén, cuatro paradas de piedra) proviene de las fuentes
   citadas en la página. Las medidas, la forma del techo, las torres del
   andarivel y la disposición de las construcciones son SUPUESTOS del modelo.

   CÓMO EDITAR
   - Textos de las fichas informativas: arreglo FICHAS.
   - Lugares del menú inferior: arreglo LUGARES.
   - Medidas supuestas del edificio: objeto MOLINO.
   ========================================================================== */
(function () {
'use strict';

var T = window.THREE;
var lienzo = document.getElementById('lienzo');

function hayWebGL() {
  try {
    var c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}
if (!T || !lienzo || !hayWebGL()) {
  document.body.classList.add('sin-webgl');
  return;
}

/* --------------------------------------------------------------------------
   DATOS EDITABLES
   -------------------------------------------------------------------------- */

/* Medidas supuestas (metros). Solo "cuatro pisos" y "ladrillo" están documentados. */
var MOLINO = { largo: 36, ancho: 14, altoPiso: 3.8, pisos: 4, cumbrera: 4.2, suelo: 6 };

var LUGARES = [
  { id: 'patio',    nombre: 'Patio del molino',      x: 14,  z: 40,  mira: [0, 14, 0] },
  { id: 'interior', nombre: 'Paradas de piedra',     x: 6, z: 4.2, mira: [-9, 7.3, -3.4] },
  { id: 'estero',   nombre: 'Estero Collén',         x: -34, z: -33, mira: [0, 9, -12] },
  { id: 'aereo',    nombre: 'Ferrocarril aéreo',     x: 46,  z: 13,  mira: [26, 15, 0] },
  { id: 'cerro',    nombre: 'Cerro La Pampa',        x: 131, z: 15,  mira: [0, 22, 0] },
  { id: 'muelle',   nombre: 'Bodegas y muelle',      x: 388, z: -6,  mira: [450, 6, 8] }
];

/* doc: lo que dicen las fuentes · sup: lo que el modelo supone */
var FICHAS = [
  { x: 6, z: 26, r: 9, titulo: 'El edificio',
    doc: 'Un vecino que llegó al barrio en 1945 lo recordaba como un edificio de ladrillo «gigantesco», de cuatro pisos, con numerosos ventanales. Funcionó desde 1847 y llegó a ocupar a 200 trabajadores.',
    sup: 'Las medidas (36 × 14 m), el techo a dos aguas, la chimenea y el letrero pintado. No se conservan planos.',
    fuente: 'BioBioChile, 2019 · R. Saavedra, Puerto del Tomé. Antología histórica' },
  { x: -18, z: 30, r: 9, titulo: 'Carretas y trigo',
    doc: 'En 1853 el pintor Otto Grashof describió el camino a California: carretas «incesantes» al margen del estero Collén, cargadas con el trigo de las haciendas. El molino tenía un granero.',
    sup: 'La ubicación del granero y el número de carretas.',
    fuente: 'O. Grashof, Diario de viaje, 1853 (en Antología histórica)' },
  { x: 0, z: 1.8, r: 6.5, titulo: 'Las paradas de piedra',
    doc: 'Hacia 1880 el molino tenía cuatro paradas de piedra, que el señor Aninat pensaba reemplazar por cilindros de acero, y molía 40.000 hectolitros de trigo al año. Los vecinos recordaban grandes embudos, ruedas con engranajes y cañerías por donde pasaban el trigo y la harina.',
    sup: 'La disposición de las máquinas dentro del primer piso.',
    fuente: 'Antología histórica · BioBioChile, 2019' },
  { x: 16, z: 22, r: 6, titulo: 'La bocina', accion: 'bocina',
    doc: 'Una bocina marcaba las horas de entrada y de salida. El molino llegó a producir 2.570 quintales de harina en un día. Cerró el 1 de enero de 1947, tras cerca de cien años de trabajo.',
    sup: 'El sonido de la bocina.',
    fuente: 'BioBioChile, 2019' },
  { x: -30, z: -31, r: 11, titulo: 'El estero Collén',
    doc: 'El molino estaba junto al estero Collén. Sus aguas movían las turbinas que generaban la electricidad del establecimiento.',
    sup: 'La casa de turbinas y el canal de madera que lleva el agua.',
    fuente: 'BioBioChile, 2019' },
  { x: 40, z: 9, r: 9, titulo: 'El ferrocarril aéreo',
    doc: 'Instalado en junio de 1896, fue el primer ferrocarril aéreo del país. Sus carritos, grandes canastas de metal, se movían con la electricidad de una turbina de agua y de un locomóvil. Llevaban trigo y harina entre el molino y las bodegas del puerto.',
    sup: 'Las torres de madera, su altura y la forma de las estaciones.',
    fuente: 'Museo Histórico Nacional, foto FB-3458 (1896) · BioBioChile, 2019' },
  { x: 134, z: 10, r: 13, titulo: 'Sobre el cerro La Pampa',
    doc: 'La línea partía del molino, cruzaba el cerro La Pampa y terminaba en el puerto de Tomé: cerca de 1.500 metros.',
    sup: 'En este modelo la distancia está comprimida a unos 340 metros para poder recorrerla a pie. El relieve es aproximado.',
    fuente: 'BioBioChile, 2019' },
  { x: 384, z: -5, r: 12, titulo: 'Bodegas y muelle',
    doc: 'El andarivel llegaba a las bodegas del molino, ubicadas frente a un muelle también de su propiedad. Hacia 1850, dos tercios de la harina chilena embarcada hacia California salían por Tomé.',
    sup: 'La forma de las bodegas, del muelle y del velero. El pescante y el farol se describen para el muelle del puerto hacia 1892.',
    fuente: 'Museo Histórico Nacional · Revista Nos, 2020 · Antología histórica' }
];

/* --------------------------------------------------------------------------
   UTILIDADES
   -------------------------------------------------------------------------- */
function ss(a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
function lerp(a, b, t) { return a + (b - a) * t; }
function azar(semilla) {
  var s = semilla >>> 0;
  return function () {
    s += 0x6D2B79F5; var t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
var rnd = azar(1896);
var esTactil = window.matchMedia('(pointer: coarse)').matches;
var pocoMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   RELIEVE (aproximado)
   x crece hacia el puerto; el molino está en el origen.
   -------------------------------------------------------------------------- */
function zEstero(x) { var d = Math.max(0, x - 20); return -24 - d * d * 0.004; }
function lecho(x) { return Math.max(0.4, 5.2 - (x + 60) * 0.02); }
function altura(x, z) {
  var cerro = 42 * Math.exp(-Math.pow((x - 190) / 85, 2) - Math.pow((z - 30) / 170, 2));
  var lomas = 38 * ss(70, 210, z) + 34 * ss(25, 150, zEstero(x) - z) + 30 * ss(-90, -160, x);
  var ruido = 1.5 * Math.sin(x * 0.05 + 1.3) * Math.cos(z * 0.043) + 0.8 * Math.sin(x * 0.11 + z * 0.09);
  var h = 6 + cerro + lomas + ruido;
  h = lerp(6, h, ss(45, 75, Math.hypot(x, z - 8)));
  h = lerp(h, 2.5, ss(290, 345, x));
  var d = Math.abs(z - zEstero(x));
  var b = lecho(x);
  var ancho = 10 + 50 * ss(40, 140, x);
  h = Math.min(h, lerp(b, h, ss(7, 7 + ancho, d)));
  if (d < 7) h = Math.min(h, b - 0.9 * (1 - ss(3, 7, d)));
  h = lerp(h, -4, ss(398, 412, x));
  return h;
}
var MUELLE = { x0: 394, x1: 470, z0: -3, z1: 3, y: 2.5 };
function enMuelle(x, z) { return x >= MUELLE.x0 && x <= MUELLE.x1 && z >= MUELLE.z0 && z <= MUELLE.z1; }
function enMolino(x, z) { return Math.abs(x) < MOLINO.largo / 2 && Math.abs(z) < MOLINO.ancho / 2; }
function suelo(x, z) {
  if (enMuelle(x, z)) return MUELLE.y;
  if (enMolino(x, z)) return MOLINO.suelo + 0.12;
  return altura(x, z);
}

/* --------------------------------------------------------------------------
   ESCENA BASE
   -------------------------------------------------------------------------- */
var render = new T.WebGLRenderer({ canvas: lienzo, antialias: true, powerPreference: 'high-performance' });
render.setPixelRatio(Math.min(window.devicePixelRatio || 1, esTactil ? 1.5 : 2));
render.toneMapping = T.ACESFilmicToneMapping;
render.toneMappingExposure = 1.0;
render.shadowMap.enabled = true;
render.shadowMap.type = T.PCFSoftShadowMap;

var escena = new T.Scene();
var NIEBLA = 0xc6c2b8;
escena.fog = new T.FogExp2(NIEBLA, 0.0019);
var camara = new T.PerspectiveCamera(62, 1, 0.15, 2600);
camara.rotation.order = 'YXZ';

function lienzo2d(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function textura(c, rep) {
  var t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  if (rep) { t.wrapS = t.wrapT = T.RepeatWrapping; }
  t.anisotropy = 4;
  return t;
}

/* Cielo fotográfico (Poly Haven, CC0): fondo y luz ambiente con reflejos */
var TEX = window.MOLINO_TEX || {}, cargador = new T.TextureLoader(), _fotos = {};
function foto(nombre, esColor) {
  if (!TEX[nombre]) return null;
  if (_fotos[nombre]) return _fotos[nombre];
  var t = cargador.load(TEX[nombre]);
  t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 8;
  if (esColor) t.colorSpace = T.SRGBColorSpace;
  _fotos[nombre] = t;
  return t;
}
(function () {
  if (!TEX.cielo) { escena.background = new T.Color(NIEBLA); return; }
  var t = cargador.load(TEX.cielo, function (tx) {
    var pm = new T.PMREMGenerator(render);
    escena.environment = pm.fromEquirectangular(tx).texture;
    pm.dispose();
  });
  t.mapping = T.EquirectangularReflectionMapping; t.colorSpace = T.SRGBColorSpace;
  escena.background = t;
})();

escena.add(new T.HemisphereLight(0xcfdbe6, 0x8a7350, 0.3));
var sol = new T.DirectionalLight(0xffe4bd, 3.6);
sol.castShadow = true;
sol.shadow.mapSize.set(esTactil ? 1024 : 2048, esTactil ? 1024 : 2048);
sol.shadow.camera.left = -75; sol.shadow.camera.right = 75;
sol.shadow.camera.top = 75; sol.shadow.camera.bottom = -75;
sol.shadow.camera.near = 1; sol.shadow.camera.far = 420;
sol.shadow.bias = -0.0006; sol.shadow.normalBias = 0.35;
escena.add(sol); escena.add(sol.target);
var DIR_SOL = new T.Vector3(-112, 63, 141);   // coincide con el sol del cielo fotográfico

/* --------------------------------------------------------------------------
   TEXTURAS DIBUJADAS
   -------------------------------------------------------------------------- */
function texVentana(clara) {
  var c = lienzo2d(64, 96), g = c.getContext('2d');
  g.fillStyle = '#e7dfcc'; g.fillRect(0, 0, 64, 96);
  for (var f = 0; f < 3; f++) for (var k = 0; k < 2; k++) {
    var gr = g.createLinearGradient(0, f * 30, 0, f * 30 + 30);
    if (clara) { gr.addColorStop(0, '#f6efd9'); gr.addColorStop(1, '#d8cfae'); }
    else { gr.addColorStop(0, '#39444b'); gr.addColorStop(1, '#1d2428'); }
    g.fillStyle = gr; g.fillRect(5 + k * 29, 5 + f * 30, 25, 26);
  }
  return textura(c);
}
/* Mapa de relieve de olas (repetible) para el estero y el mar */
function texOlas() {
  var N = 256, c = lienzo2d(N, N), g = c.getContext('2d'), im = g.createImageData(N, N), K = 6.2832 / N, r = azar(13), W = [];
  for (var w = 0; w < 16; w++) {
    var fx = Math.round((r() * 2 - 1) * 11), fy = Math.round((r() * 2 - 1) * 11), f = Math.hypot(fx, fy);
    if (f < 2) { fx = 3; fy = -2; f = 3.6; }
    W.push([fx, fy, r() * 6.283, 1.1 / f]);
  }
  function H(x, y) {
    var u = x * K, v = y * K, h = 0;
    for (var i = 0; i < W.length; i++) h += Math.sin(u * W[i][0] + v * W[i][1] + W[i][2]) * W[i][3];
    return h;
  }
  for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
    var dx = (H(x + 1, y) - H(x - 1, y)) * 3.2, dy = (H(x, y + 1) - H(x, y - 1)) * 3.2, l = Math.hypot(dx, dy, 1), i = (y * N + x) * 4;
    im.data[i] = (-dx / l * 0.5 + 0.5) * 255; im.data[i + 1] = (-dy / l * 0.5 + 0.5) * 255; im.data[i + 2] = (1 / l * 0.5 + 0.5) * 255; im.data[i + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4;
  return t;
}
function texHojas() {
  var c = lienzo2d(256, 256), g = c.getContext('2d'), r = azar(77);
  for (var i = 0; i < 900; i++) {
    var a = r() * 6.283, d = Math.pow(r(), 0.55) * 118;
    g.save(); g.translate(128 + Math.cos(a) * d, 128 + Math.sin(a) * d); g.rotate(r() * 6.283);
    g.fillStyle = 'hsl(' + (76 + r() * 30) + ',' + (30 + r() * 22) + '%,' + (24 + r() * 24) + '%)';
    g.beginPath(); g.ellipse(0, 0, 4.5 + r() * 3.5, 2 + r() * 1.6, 0, 0, 6.283); g.fill(); g.restore();
  }
  return textura(c);
}
function texPasto() {
  var c = lienzo2d(128, 64), g = c.getContext('2d'), r = azar(31);
  g.lineCap = 'round';
  for (var i = 0; i < 110; i++) {
    var x = 6 + r() * 116, h = 18 + r() * 44, dx = (r() - 0.5) * 26;
    g.strokeStyle = 'hsl(' + (48 + r() * 22) + ',' + (22 + r() * 16) + '%,' + (40 + r() * 22) + '%)';
    g.lineWidth = 1 + r() * 1.3;
    g.beginPath(); g.moveTo(x, 64); g.quadraticCurveTo(x + dx * 0.2, 64 - h * 0.6, x + dx, 64 - h); g.stroke();
  }
  return textura(c);
}
function texLetrero() {
  var c = lienzo2d(1024, 64), g = c.getContext('2d');
  g.fillStyle = '#e4d8bb'; g.fillRect(0, 0, 1024, 64);
  g.strokeStyle = '#3a2a20'; g.lineWidth = 3; g.strokeRect(5, 5, 1014, 54);
  g.fillStyle = '#2e221b'; g.font = '600 40px Georgia, "Times New Roman", serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  var txt = 'MOLINO  CALIFORNIA'.split('').join('  ');
  g.fillText(txt, 512, 34);
  return textura(c);
}
function texHumo() {
  var c = lienzo2d(64, 64), g = c.getContext('2d');
  var gr = g.createRadialGradient(32, 32, 2, 32, 32, 31);
  gr.addColorStop(0, 'rgba(255,255,255,.75)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return textura(c);
}

/* Material fotográfico: mosaico = metros que cubre una repetición; tinte multiplica el color */
function mat(nombre, mosaico, tinte, extra) {
  var m = new T.MeshStandardMaterial({ map: foto(nombre, true), normalMap: foto(nombre + 'N'), roughness: 0.92, metalness: 0 });
  if (tinte) m.color.setRGB(tinte[0], tinte[1], tinte[2]);
  if (extra) m.setValues(extra);
  m.userData.mosaico = mosaico;
  return m;
}
var M = {
  ladrillo: mat('ladrillo', 2.0, [1.3, 1.0, 0.9]),
  ladrilloClaro: mat('adobe', 2.4, [1.45, 1.2, 1.0]),
  adobe: mat('adobe', 2.6, [1.8, 1.7, 1.55]),
  madera: mat('tablas', 2.0, [1.05, 1.0, 0.95]),
  maderaOsc: mat('tablas', 2.0, [0.55, 0.5, 0.46]),
  piso: mat('piso', 2.2, [1.15, 1.1, 1.05]),
  pisoInt: mat('piso', 2.2, [1.2, 1.1, 1.0], { envMapIntensity: 0.3 }),
  calamina: mat('calamina', 2.4, [1, 1, 1], { side: T.DoubleSide, roughness: 0.78, metalness: 0.2 }),
  teja: mat('teja', 1.8, [1.05, 1, 1], { side: T.DoubleSide }),
  fierro: new T.MeshStandardMaterial({ color: 0x2e3033, roughness: 0.55, metalness: 0.7 }),
  piedra: new T.MeshStandardMaterial({ color: 0xa9a294, roughness: 0.95 }),
  saco: new T.MeshStandardMaterial({ color: 0xe0d4b6, roughness: 1 }),
  ventana: new T.MeshStandardMaterial({ map: texVentana(false), roughness: 0.22 }),
  ventanaInt: new T.MeshBasicMaterial({ map: texVentana(true) }),
  puerta: mat('tablas', 1.6, [0.42, 0.34, 0.28]),
  oscuro: new T.MeshBasicMaterial({ color: 0x15110d })
};

/* --------------------------------------------------------------------------
   AYUDANTES DE CONSTRUCCIÓN
   -------------------------------------------------------------------------- */
var choques = [];   // cajas {x0,x1,z0,z1} que el visitante no puede atravesar
function choque(x0, x1, z0, z1) { choques.push({ x0: x0, x1: x1, z0: z0, z1: z1 }); }

/* Caja con textura medida en metros (mosaico = tamaño de una repetición) */
function caja(w, h, d, mat, x, y, z, mosaico, padre) {
  var g = new T.BoxGeometry(w, h, d);
  mosaico = (mat.userData && mat.userData.mosaico) || mosaico;
  if (mosaico) {
    var uv = g.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (var c = 0; c < 6; c++) for (var i = 0; i < 4; i++) {
      var k = c * 4 + i;
      uv.setXY(k, uv.getX(k) * dims[c][0] / mosaico, uv.getY(k) * dims[c][1] / mosaico);
    }
  }
  var m = new T.Mesh(g, mat);
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
  (padre || escena).add(m);
  return m;
}
function plano(w, h, mat, x, y, z, rotY, padre) {
  var m = new T.Mesh(new T.PlaneGeometry(w, h), mat);
  m.position.set(x, y, z); m.rotation.y = rotY || 0;
  (padre || escena).add(m);
  return m;
}
function cilindro(r1, r2, h, mat, x, y, z, seg, padre) {
  var m = new T.Mesh(new T.CylinderGeometry(r1, r2, h, seg || 10), mat);
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
  (padre || escena).add(m);
  return m;
}
/* Techo a dos aguas con cumbrera a lo largo de X, más los dos frontones */
function techo(w, d, alto, alero, matTecho, matFronton, mosaico, padre) {
  var a = alero, ye = -a * alto / (d / 2), L = w / 2 + a, Z = d / 2 + a;
  var largoFalda = Math.hypot(Z, alto - ye);
  var p = [ -L, ye, Z,  L, ye, Z,  L, alto, 0,  -L, alto, 0,
             L, ye, -Z, -L, ye, -Z, -L, alto, 0,  L, alto, 0 ];
  var ms = (matTecho.userData && matTecho.userData.mosaico) || 2.2, u = 2 * L / ms, v = largoFalda / ms;
  var uvs = [0, 0, u, 0, u, v, 0, v, 0, 0, u, 0, u, v, 0, v];
  var g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2));
  g.setIndex([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7]);
  g.computeVertexNormals();
  var t = new T.Mesh(g, matTecho); t.castShadow = true; t.receiveShadow = true;
  padre.add(t);
  if (matFronton) {
    var m = (matFronton.userData && matFronton.userData.mosaico) || mosaico || 1.6, fp = [], fuv = [];
    [-w / 2, w / 2].forEach(function (x) {
      fp.push(x, 0, -d / 2, x, 0, d / 2, x, alto, 0);
      fuv.push(0, 0, d / m, 0, d / 2 / m, alto / m);
    });
    var fg = new T.BufferGeometry();
    fg.setAttribute('position', new T.Float32BufferAttribute(fp, 3));
    fg.setAttribute('uv', new T.Float32BufferAttribute(fuv, 2));
    fg.computeVertexNormals();
    var fm = matFronton.clone(); fm.side = T.DoubleSide;
    var f = new T.Mesh(fg, fm); f.castShadow = true;
    padre.add(f);
  }
  return t;
}
/* Galpón o casa cerrada con techo a dos aguas. giro=true pone la cumbrera en Z. */
function edificio(o) {
  var g = new T.Group();
  var base = o.y !== undefined ? o.y : altura(o.x, o.z);
  g.position.set(o.x, base, o.z);
  if (o.giro) g.rotation.y = Math.PI / 2;
  caja(o.w, o.h + 2, o.d, o.muro, 0, o.h / 2 - 1, 0, o.mosaico || 1.6, g);
  var gt = new T.Group(); gt.position.y = o.h; g.add(gt);
  techo(o.w, o.d, o.cumbrera || 2.4, o.alero === undefined ? 0.6 : o.alero, o.techo, o.muro, o.mosaico || 1.6, gt);
  (o.huecos || []).forEach(function (hc) {
    var mat = hc.t === 'v' ? M.ventana : M.puerta;
    var s = hc.lado === '-z' ? -1 : 1;
    plano(hc.w, hc.h, mat, hc.u * s, hc.y + hc.h / 2, s * (o.d / 2 + 0.03), s > 0 ? 0 : Math.PI, g);
  });
  escena.add(g);
  var hw = (o.giro ? o.d : o.w) / 2, hd = (o.giro ? o.w : o.d) / 2;
  choque(o.x - hw, o.x + hw, o.z - hd, o.z + hd);
  return g;
}

/* Sacos: una sola malla instanciada para todas las pilas */
var sacos = new T.InstancedMesh(new T.SphereGeometry(0.5, 8, 6), M.saco, 700);
sacos.castShadow = true; sacos.receiveShadow = true; sacos.count = 0;
escena.add(sacos);
var _m4 = new T.Matrix4(), _q = new T.Quaternion(), _v = new T.Vector3(), _s = new T.Vector3(), _e = new T.Euler();
function saco(x, y, z, ry) {
  if (sacos.count >= 700) return;
  _e.set(0, ry || 0, 0); _q.setFromEuler(_e);
  _m4.compose(_v.set(x, y, z), _q, _s.set(0.86, 0.36, 0.56));
  sacos.setMatrixAt(sacos.count++, _m4);
}
function pila(x, y, z, nx, nz, ny, ry) {
  var c = Math.cos(ry || 0), s = Math.sin(ry || 0);
  for (var j = 0; j < ny; j++) for (var i = 0; i < nx - (j > 1 ? 1 : 0); i++) for (var k = 0; k < nz; k++) {
    var lx = (i - (nx - 1) / 2) * 0.9 + (j % 2) * 0.2, lz = (k - (nz - 1) / 2) * 0.6;
    saco(x + lx * c + lz * s, y + 0.2 + j * 0.33, z - lx * s + lz * c, (ry || 0) + (rnd() - 0.5) * 0.25);
  }
}

/* --------------------------------------------------------------------------
   TERRENO, ESTERO Y MAR
   -------------------------------------------------------------------------- */
var C_SECO = new T.Color(1.0, 0.97, 0.8), C_VERDE = new T.Color(0.6, 0.86, 0.48), C_RIBERA = new T.Color(0.42, 0.72, 0.38),
    C_TIERRA = new T.Color(1.6, 1.5, 1.34), C_ARENA = new T.Color(1.45, 1.4, 1.25), C_FONDO = new T.Color(0.5, 0.56, 0.5);
/* Qué cubre el suelo en un punto: tinte del pasto y proporción de tierra y arena */
function cobertura(x, z, o) {
  var h = altura(x, z), d = Math.abs(z - zEstero(x));
  var n = 0.5 + 0.5 * Math.sin(x * 0.07 + z * 0.05) * Math.cos(z * 0.09 - x * 0.03);
  o.tinte.copy(C_SECO).lerp(C_VERDE, n * 0.75).lerp(C_RIBERA, 1 - ss(6, 26, d));
  var t = 1 - ss(36, 52, Math.hypot(x, z - 8));
  if (x < 70) t = Math.max(t, (1 - ss(2.5, 5, Math.abs(z - 38))) * 0.9);
  t = Math.max(t, ss(325, 350, x));
  var a = ss(388, 399, x);
  o.tinte.lerp(C_TIERRA, t).lerp(C_ARENA, a);
  if (h < 0.3 || d < 6) o.tinte.lerp(C_FONDO, 0.7);
  o.tierra = t * (1 - a); o.arena = a; o.h = h; o.d = d;
  return o;
}
(function () {
  var X0 = -170, X1 = 520, Z0 = -230, Z1 = 230, nx = 172, nz = 115;
  var g = new T.PlaneGeometry(X1 - X0, Z1 - Z0, nx, nz);
  g.rotateX(-Math.PI / 2); g.translate((X0 + X1) / 2, 0, (Z0 + Z1) / 2);
  var p = g.attributes.position, uv = g.attributes.uv, col = new Float32Array(p.count * 3), peso = new Float32Array(p.count * 3);
  var cb = { tinte: new T.Color() };
  for (var i = 0; i < p.count; i++) {
    var x = p.getX(i), z = p.getZ(i);
    cobertura(x, z, cb);
    p.setY(i, cb.h); uv.setXY(i, x / 6, z / 6);
    col[i * 3] = cb.tinte.r; col[i * 3 + 1] = cb.tinte.g; col[i * 3 + 2] = cb.tinte.b;
    peso[i * 3] = cb.tierra; peso[i * 3 + 2] = cb.arena;
  }
  g.setAttribute('color', new T.BufferAttribute(col, 3));
  g.setAttribute('peso', new T.BufferAttribute(peso, 3));
  g.computeVertexNormals();
  var m = new T.MeshStandardMaterial({ map: foto('pasto', true), normalMap: foto('pastoN'), vertexColors: true, roughness: 1 });
  m.onBeforeCompile = function (sh) {
    sh.uniforms.tTierra = { value: foto('tierra', true) };
    sh.uniforms.tArena = { value: foto('arena', true) };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec3 peso;\nvarying vec3 vPeso;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPeso = peso;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D tTierra;\nuniform sampler2D tArena;\nvarying vec3 vPeso;')
      .replace('#include <map_fragment>', [
        '#ifdef USE_MAP',
        '  vec3 cP = mix(texture2D(map, vMapUv).rgb, texture2D(map, vMapUv * 0.17).rgb, 0.42);',
        '  vec3 cT = mix(texture2D(tTierra, vMapUv * 1.4).rgb, texture2D(tTierra, vMapUv * 0.23).rgb, 0.35);',
        '  vec3 cS = texture2D(tArena, vMapUv * 1.1).rgb;',
        '  diffuseColor.rgb *= mix(mix(cP, cT, clamp(vPeso.r, 0.0, 1.0)), cS, clamp(vPeso.b, 0.0, 1.0));',
        '#endif'].join('\n'));
  };
  var terreno = new T.Mesh(g, m);
  terreno.receiveShadow = true;
  escena.add(terreno);
})();

var olasBase = texOlas(), texEstero = olasBase, texMar = olasBase.clone();
(function () {
  var pos = [], uv = [], idx = [], k = 0;
  for (var x = -170; x <= 246; x += 4) {
    var zc = zEstero(x), y = lecho(x) - 0.38;
    pos.push(x, y, zc - 5.2, x, y, zc + 5.2);
    uv.push(0, x / 14, 0.75, x / 14);
    if (k > 0) idx.push(k * 2 - 2, k * 2 - 1, k * 2, k * 2 - 1, k * 2 + 1, k * 2);
    k++;
  }
  var g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  var e = new T.Mesh(g, new T.MeshStandardMaterial({ color: 0x3d605c, roughness: 0.1, normalMap: texEstero,
    normalScale: new T.Vector2(0.4, 0.4), transparent: true, opacity: 0.88, side: T.DoubleSide }));
  e.receiveShadow = true; escena.add(e);

  texMar.needsUpdate = true; texMar.repeat.set(120, 152);
  var mar = new T.Mesh(new T.PlaneGeometry(1500, 1900), new T.MeshStandardMaterial({ color: 0x1d4252, roughness: 0.16,
    normalMap: texMar, normalScale: new T.Vector2(0.38, 0.38) }));
  mar.rotation.x = -Math.PI / 2; mar.position.set(395 + 750, 0, 0); mar.receiveShadow = true;
  escena.add(mar);
})();

/* --------------------------------------------------------------------------
   EL MOLINO
   -------------------------------------------------------------------------- */
var engranajes = [];
(function () {
  var L = MOLINO.largo, A = MOLINO.ancho, y0 = MOLINO.suelo, H = MOLINO.altoPiso * MOLINO.pisos, e = 0.6;
  var g = new T.Group(); g.position.y = y0; escena.add(g);
  var puertaW = 3.2, puertaH = 3.3;

  /* Muros (el frente, hacia +z, tiene el portón) */
  caja(L, H + 2, e, M.ladrillo, 0, H / 2 - 1, -A / 2 + e / 2, 1.6, g);
  caja(e, H + 2, A - 2 * e, M.ladrillo, -L / 2 + e / 2, H / 2 - 1, 0, 1.6, g);
  caja(e, H + 2, A - 2 * e, M.ladrillo, L / 2 - e / 2, H / 2 - 1, 0, 1.6, g);
  var tramo = (L - puertaW) / 2;
  caja(tramo, H + 2, e, M.ladrillo, -(puertaW + tramo) / 2, H / 2 - 1, A / 2 - e / 2, 1.6, g);
  caja(tramo, H + 2, e, M.ladrillo, (puertaW + tramo) / 2, H / 2 - 1, A / 2 - e / 2, 1.6, g);
  caja(puertaW, H - puertaH, e, M.ladrillo, 0, puertaH + (H - puertaH) / 2, A / 2 - e / 2, 1.6, g);
  choque(-L / 2, L / 2, -A / 2, -A / 2 + e);
  choque(-L / 2, -L / 2 + e, -A / 2, A / 2);
  choque(L / 2 - e, L / 2, -A / 2, A / 2);
  choque(-L / 2, -puertaW / 2, A / 2 - e, A / 2);
  choque(puertaW / 2, L / 2, A / 2 - e, A / 2);
  /* hojas del portón abiertas */
  caja(0.1, puertaH, 1.6, M.puerta, -puertaW / 2 - 0.05, puertaH / 2, A / 2 + 0.8, 0, g);
  caja(0.1, puertaH, 1.6, M.puerta, puertaW / 2 + 0.05, puertaH / 2, A / 2 + 0.8, 0, g);

  /* Cornisas, pilastras y zócalo */
  for (var k = 1; k <= MOLINO.pisos; k++) {
    var yy = k * MOLINO.altoPiso - (k === MOLINO.pisos ? 0.12 : 0.35), al = k === MOLINO.pisos ? 0.34 : 0.16;
    caja(L + 0.3, al, 0.16, M.ladrilloClaro, 0, yy, A / 2 + 0.06, 0, g);
    caja(L + 0.3, al, 0.16, M.ladrilloClaro, 0, yy, -A / 2 - 0.06, 0, g);
    caja(0.16, al, A + 0.3, M.ladrilloClaro, L / 2 + 0.06, yy, 0, 0, g);
    caja(0.16, al, A + 0.3, M.ladrilloClaro, -L / 2 - 0.06, yy, 0, 0, g);
  }
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (s) {
    caja(0.95, H, 0.95, M.ladrillo, s[0] * (L / 2 - 0.3), H / 2, s[1] * (A / 2 - 0.3), 1.6, g);
  });

  /* Ventanales: 11 ejes por fachada larga, 4 por testero, en los cuatro pisos */
  var vw = 1.3, vh = 2.0, lista = [], listaInt = [];
  for (var p = 0; p < MOLINO.pisos; p++) {
    var yv = p * MOLINO.altoPiso + 1.05 + vh / 2;
    for (var i = 0; i < 11; i++) {
      var xv = -15.5 + i * 3.1;
      if (!(p === 0 && i === 5)) lista.push([xv, yv, A / 2 + 0.02, 0]);
      lista.push([xv, yv, -A / 2 - 0.02, Math.PI]);
      if (p === 0) {
        if (i !== 5) listaInt.push([xv, yv, A / 2 - e - 0.02, Math.PI]);
        listaInt.push([xv, yv, -A / 2 + e + 0.02, 0]);
      }
    }
    for (var j = 0; j < 4; j++) {
      var zv = -4.5 + j * 3;
      lista.push([L / 2 + 0.02, yv, zv, Math.PI / 2]);
      lista.push([-L / 2 - 0.02, yv, zv, -Math.PI / 2]);
    }
  }
  function instanciar(geo, mat, items, dy, sombra) {
    var im = new T.InstancedMesh(geo, mat, items.length);
    items.forEach(function (it, n) {
      _e.set(0, it[3], 0); _q.setFromEuler(_e);
      _m4.compose(_v.set(it[0], it[1] + (dy || 0), it[2]), _q, _s.set(1, 1, 1));
      im.setMatrixAt(n, _m4);
    });
    im.castShadow = !!sombra; im.receiveShadow = true;
    g.add(im); return im;
  }
  instanciar(new T.PlaneGeometry(vw, vh), M.ventana, lista);
  instanciar(new T.PlaneGeometry(vw, vh), M.ventanaInt, listaInt);
  instanciar(new T.BoxGeometry(vw + 0.3, 0.12, 0.3), M.piedra, lista, -vh / 2 - 0.06, true);
  instanciar(new T.BoxGeometry(vw + 0.3, 0.24, 0.14), M.ladrilloClaro, lista, vh / 2 + 0.12, false);

  /* Letrero pintado (supuesto) */
  plano(21, 1.15, new T.MeshStandardMaterial({ map: texLetrero() }), 0, 2 * MOLINO.altoPiso + 3.05 + 0.92, A / 2 + 0.04, 0, g);

  /* Techo */
  var gt = new T.Group(); gt.position.y = H; g.add(gt);
  techo(L, A, MOLINO.cumbrera, 0.8, M.calamina, M.ladrillo, 1.6, gt);

  /* Chimenea de la caldera (supuesta) y su casa de máquinas */
  var chx = -L / 2 - 6, chz = -3;
  for (var t = 0; t < 4; t++) caja(2.3 - t * 0.28, 6.2, 2.3 - t * 0.28, M.ladrillo, chx, 3 + t * 6.1, chz, 1.6, g);
  caja(1.7, 0.4, 1.7, M.ladrilloClaro, chx, 24.5, chz, 0, g);
  choque(chx - 1.2, chx + 1.2, chz - 1.2, chz + 1.2);
  edificio({ x: -L / 2 - 6, z: 3.2, y: y0, w: 9, d: 7, h: 4.6, cumbrera: 1.8, giro: true, muro: M.ladrillo, techo: M.calamina,
    huecos: [{ lado: '+z', u: 0, y: 0, w: 1.6, h: 2.6 }] });

  /* ---------- Interior del primer piso ---------- */
  var yi = 0.06;
  var piso = caja(L - 2 * e, 0.12, A - 2 * e, M.pisoInt, 0, yi, 0, 1.3, g); piso.castShadow = false;
  var cielo = caja(L - 2 * e, 0.25, A - 2 * e, M.pisoInt, 0, MOLINO.altoPiso, 0, 2.4, g); cielo.castShadow = false;
  for (var b = 0; b < 12; b++) caja(0.25, 0.3, A - 2 * e, M.maderaOsc, -16.5 + b * 3, MOLINO.altoPiso - 0.27, 0, 0, g);
  for (var c2 = 0; c2 < 6; c2++) [-0.4, 4.2].forEach(function (zc) {
    if (Math.abs(-15.5 + c2 * 6.2) > 0.1) caja(0.32, MOLINO.altoPiso, 0.32, M.maderaOsc, -15.5 + c2 * 6.2, MOLINO.altoPiso / 2, zc, 0, g);
  });

  /* Cuatro paradas de piedra (documentadas) con sus tolvas y cañerías */
  var gPiedra = new T.CylinderGeometry(0.85, 0.85, 0.3, 20);
  [-12.4, -6.2, 6.2, 12.4].forEach(function (px) {
    caja(3.2, 0.9, 3, M.madera, px, 0.57, -3.4, 1.2, g);
    cilindro(1.05, 1.05, 0.65, M.maderaOsc, px, 1.35, -3.4, 14, g);
    var muela = new T.Mesh(gPiedra, M.piedra); muela.position.set(px, 1.82, -3.4); g.add(muela);
    engranajes.push({ m: muela, eje: 'y', v: 1.6 });
    var tolva = new T.Mesh(new T.ConeGeometry(0.9, 1.0, 4, 1, true), M.madera);
    tolva.material = M.madera.clone(); tolva.material.side = T.DoubleSide;
    tolva.rotation.x = Math.PI; tolva.rotation.y = Math.PI / 4; tolva.position.set(px, 2.75, -3.4); g.add(tolva);
    [[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]].forEach(function (q) {
      caja(0.09, 1.7, 0.09, M.maderaOsc, px + q[0], 2.2, -3.4 + q[1], 0, g);
    });
    caja(0.34, MOLINO.altoPiso - 3.2, 0.34, M.madera, px, (MOLINO.altoPiso + 3.2) / 2, -3.4, 0, g);
    caja(0.3, MOLINO.altoPiso - 1, 0.3, M.madera, px + 1.9, (MOLINO.altoPiso + 1) / 2, -4.6, 0, g);
    caja(0.3, 0.3, 1.0, M.madera, px + 1.9, 1.1, -4.2, 0, g);
    choque(px - 1.6, px + 1.6, -4.9, -1.9);
    /* engranaje de cada parada sobre el eje principal */
    var rueda = new T.Group(); rueda.position.set(px - 1.2, 0.95, -5.5); g.add(rueda);
    var aro = new T.Mesh(new T.TorusGeometry(0.72, 0.09, 6, 22), M.fierro); aro.rotation.y = Math.PI / 2; rueda.add(aro);
    for (var d2 = 0; d2 < 16; d2++) {
      var di = caja(0.16, 0.12, 0.1, M.fierro, 0, Math.sin(d2 * Math.PI / 8) * 0.84, Math.cos(d2 * Math.PI / 8) * 0.84, 0, rueda);
      di.rotation.x = -d2 * Math.PI / 8; di.castShadow = false;
    }
    for (var r2 = 0; r2 < 3; r2++) { var ra = caja(0.07, 1.4, 0.07, M.fierro, 0, 0, 0, 0, rueda); ra.rotation.x = r2 * Math.PI / 3; ra.castShadow = false; }
    engranajes.push({ m: rueda, eje: 'x', v: 0.9 });
  });
  var eje = cilindro(0.09, 0.09, L - 3, M.fierro, 0, 0.95, -5.5, 8, g); eje.rotation.z = Math.PI / 2;
  engranajes.push({ m: eje, eje: 'x', v: 0.9 });
  choque(-L / 2, L / 2, -A / 2, -4.9);

  pila(-9, y0 + yi + 0.06, 4.3, 4, 3, 4, 0.1);
  pila(8.5, y0 + yi + 0.06, 4.6, 3, 3, 3, -0.15);
  pila(14.5, y0 + yi + 0.06, 1.5, 2, 4, 5, 1.5);
  choque(-11, -7, 3.3, 5.4); choque(7, 10, 3.6, 5.6); choque(13.6, 15.4, -0.2, 3.2);

  [-11, 0, 11].forEach(function (lx) {
    var luz = new T.PointLight(0xffc27a, 26, 17, 2); luz.position.set(lx, 3.1, 0.6); g.add(luz);
    var foco = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), new T.MeshBasicMaterial({ color: 0xffc98a }));
    foco.position.copy(luz.position); g.add(foco);
    caja(0.02, 0.6, 0.02, M.oscuro, lx, 3.45, 0.6, 0, g).castShadow = false;
  });
})();

/* Casa de turbinas junto al estero, cuerpo de unión y canal de madera (supuestos) */
var aguaCanal;
(function () {
  edificio({ x: 0, z: -15, y: 4.1, w: 12, d: 7, h: 6.4, cumbrera: 2.2, muro: M.ladrillo, techo: M.calamina,
    huecos: [{ lado: '-z', u: -3, y: 2.2, w: 1.2, h: 1.8, t: 'v' }, { lado: '-z', u: 3, y: 2.2, w: 1.2, h: 1.8, t: 'v' }] });
  caja(5, 7, 4.6, M.ladrillo, 0, 6.2, -9.2, 1.6);
  choque(-2.5, 2.5, -11.6, -7);
  /* canal elevado */
  var x0 = -76, z0 = -21.2, y0 = 6.0, x1 = -6, z1 = -18.2, y1 = 5.6;
  var largo = Math.hypot(x1 - x0, z1 - z0), ang = Math.atan2(-(z1 - z0), x1 - x0);
  var gc = new T.Group(); gc.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  gc.rotation.y = ang; gc.rotation.z = Math.atan2(y1 - y0, largo); escena.add(gc);
  caja(largo, 0.1, 1.5, M.madera, 0, -0.3, 0, 1.2, gc);
  caja(largo, 0.7, 0.1, M.madera, 0, 0, 0.75, 1.2, gc);
  caja(largo, 0.7, 0.1, M.madera, 0, 0, -0.75, 1.2, gc);
  var ta = olasBase.clone(); ta.needsUpdate = true; ta.repeat.set(largo / 8, 0.18);
  aguaCanal = new T.Mesh(new T.PlaneGeometry(largo, 1.4), new T.MeshStandardMaterial({ color: 0x40635f, roughness: 0.12, normalMap: ta }));
  aguaCanal.rotation.x = -Math.PI / 2; aguaCanal.position.y = 0.12; gc.add(aguaCanal);
  for (var i = 0; i <= 10; i++) {
    var f = i / 10, x = lerp(x0, x1, f), z = lerp(z0, z1, f), y = lerp(y0, y1, f), h = altura(x, z);
    caja(0.2, y - h + 0.6, 0.2, M.maderaOsc, x, (y + h) / 2 - 0.6, z + 0.7, 0);
    caja(0.2, y - h + 0.6, 0.2, M.maderaOsc, x, (y + h) / 2 - 0.6, z - 0.7, 0);
  }
})();

/* Humo de la chimenea */
var humo = [];
(function () {
  var th = texHumo();
  for (var i = 0; i < 26; i++) {
    var sp = new T.Sprite(new T.SpriteMaterial({ map: th, color: 0x8f8a84, transparent: true, depthWrite: false }));
    escena.add(sp); humo.push({ s: sp, t: i / 26 });
  }
})();

/* --------------------------------------------------------------------------
   PATIO: GRANERO, CARRETAS, GENTE, CASAS DE ADOBE
   -------------------------------------------------------------------------- */
edificio({ x: -40, z: 20, w: 22, d: 10, h: 4.4, cumbrera: 2.6, muro: M.madera, techo: M.calamina, mosaico: 1.4,
  huecos: [{ lado: '+z', u: -5, y: 0, w: 3, h: 3.2 }, { lado: '+z', u: 5, y: 0, w: 3, h: 3.2 }] });
pila(-27, 6, 24, 4, 3, 4, 0.3); choque(-29.2, -24.8, 22.8, 25.4);

var gRueda = new T.CylinderGeometry(0.75, 0.75, 0.1, 14);
var gCuerpoBuey = new T.CapsuleGeometry(0.42, 1.15, 5, 12), gPataBuey = new T.CapsuleGeometry(0.085, 0.62, 3, 8), gCabezaBuey = new T.CapsuleGeometry(0.2, 0.3, 4, 10);
var PELAJES = [0x5c3f2c, 0x7d5f45, 0x3f3029].map(function (c) { return new T.MeshStandardMaterial({ color: c, roughness: 0.95 }); });
function buey(x, z, ry, padre) {
  var g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; padre.add(g);
  var m = PELAJES[Math.floor(rnd() * PELAJES.length)];
  function pieza(geo, px, py, pz, rz) { var o = new T.Mesh(geo, m); o.position.set(px, py, pz); o.rotation.z = rz || 0; o.castShadow = true; g.add(o); return o; }
  pieza(gCuerpoBuey, 0, 1.15, 0, Math.PI / 2).scale.set(1, 1, 0.82);
  pieza(gCabezaBuey, 1.22, 1.2, 0, 1.15);
  [[-0.62, -0.22], [-0.62, 0.22], [0.62, -0.22], [0.62, 0.22]].forEach(function (p) { pieza(gPataBuey, p[0], 0.4, p[1]); });
  caja(0.05, 0.05, 0.86, M.piedra, 1.2, 1.5, 0, 0, g);
}
function carreta(x, z, ry, cargada) {
  var g = new T.Group(); g.position.set(x, suelo(x, z), z); g.rotation.y = ry; escena.add(g);
  caja(3, 0.14, 1.5, M.madera, 0, 1.0, 0, 1.2, g);
  caja(3, 0.5, 0.07, M.madera, 0, 1.3, 0.75, 1.2, g); caja(3, 0.5, 0.07, M.madera, 0, 1.3, -0.75, 1.2, g);
  [-0.85, 0.85].forEach(function (s) {
    var r = new T.Mesh(gRueda, M.maderaOsc); r.rotation.x = Math.PI / 2; r.position.set(-0.2, 0.75, s); r.castShadow = true; g.add(r);
  });
  caja(3.4, 0.1, 0.1, M.maderaOsc, 3.1, 1.0, 0, 0, g);
  caja(0.12, 0.12, 1.9, M.maderaOsc, 4.5, 1.5, 0, 0, g);
  buey(4.3, -0.55, 0, g); buey(4.3, 0.55, 0, g);
  if (cargada) {
    var c = Math.cos(ry), s2 = Math.sin(ry);
    for (var j = 0; j < 3; j++) for (var i = 0; i < 3 - (j > 1 ? 1 : 0); i++) for (var k = 0; k < 2; k++) {
      var lx = (i - 1) * 0.9, lz = (k - 0.5) * 0.6;
      saco(x + lx * c + lz * s2, g.position.y + 1.27 + j * 0.33, z - lx * s2 + lz * c, ry);
    }
  }
  choque(x - 2.4, x + 2.4, z - 2.4, z + 2.4);
}
carreta(-12, 24, 0.25, true);
carreta(-22, 34, 0.05, true);
carreta(24, 28, 2.9, false);
carreta(-58, 38, 0.02, true);
carreta(-84, 38.5, -0.03, true);

var gCabeza = new T.SphereGeometry(0.115, 12, 10), gAla = new T.CylinderGeometry(0.29, 0.31, 0.025, 14), gCopa = new T.CylinderGeometry(0.11, 0.13, 0.13, 10);
var gPierna = new T.CapsuleGeometry(0.075, 0.68, 3, 8), gTorso = new T.CapsuleGeometry(0.17, 0.36, 4, 12), gBrazo = new T.CapsuleGeometry(0.052, 0.5, 3, 8);
var matPiel = new T.MeshStandardMaterial({ color: 0xb08460, roughness: 0.8 }), matPaja = new T.MeshStandardMaterial({ color: 0xcdb884, roughness: 1 });
var ROPAS = [0x5a5347, 0x6b5d4a, 0x4c4f58, 0x7a6a52, 0x8c8271, 0x9a927f].map(function (c) { return new T.MeshStandardMaterial({ color: c, roughness: 1 }); });
function persona(x, z, ry, conSaco, escala) {
  var g = new T.Group(), e = escala || 1;
  g.position.set(x, suelo(x, z), z); g.rotation.y = ry; g.scale.setScalar(e); escena.add(g);
  var ropa = ROPAS[Math.floor(rnd() * ROPAS.length)], pant = ROPAS[Math.floor(rnd() * 3)];
  function pieza(geo, m, px, py, pz, rx, rz) { var o = new T.Mesh(geo, m); o.position.set(px, py, pz); o.rotation.set(rx || 0, 0, rz || 0); o.castShadow = true; g.add(o); return o; }
  pieza(gPierna, pant, -0.09, 0.42, 0.05, -0.1); pieza(gPierna, pant, 0.09, 0.42, -0.05, 0.1);
  pieza(gTorso, ropa, 0, 1.13, 0, conSaco ? 0.24 : 0.04).scale.set(1, 1, 0.72);
  pieza(gCabeza, matPiel, 0, 1.55, conSaco ? 0.09 : 0.02);
  pieza(gAla, matPaja, 0, 1.64, conSaco ? 0.09 : 0.02); pieza(gCopa, matPaja, 0, 1.7, conSaco ? 0.09 : 0.02);
  if (conSaco) {
    var s = new T.Mesh(sacos.geometry, M.saco); s.scale.set(0.8, 0.34, 0.5); s.rotation.y = Math.PI / 2;
    s.position.set(0, 1.52, -0.16); s.castShadow = true; g.add(s);
    pieza(gBrazo, ropa, -0.24, 1.42, -0.04, 0.5, 0.25); pieza(gBrazo, ropa, 0.24, 1.42, -0.04, 0.5, -0.25);
  } else {
    pieza(gBrazo, ropa, -0.23, 1.08, 0.01, 0.06, -0.1); pieza(gBrazo, ropa, 0.23, 1.08, 0.01, -0.06, 0.1);
  }
}
persona(1.2, 10.5, 0.2, true); persona(-1.5, 15, 3.0, true); persona(-6, 21, 2.6, true, 0.78);
persona(-9, 26, -1.2, false); persona(-25, 31, 1.7, false); persona(20, 24, -2.2, false);
persona(4.5, 1.2, -1.9, false); persona(-4.5, -0.8, 2.3, true); persona(10, -0.5, 1.2, false, 0.8);
persona(31, 6, -0.6, true); persona(-3, -21.5, 0.4, false);
persona(378, 6, 1.6, true); persona(386, -2, -1.5, true, 0.8); persona(404, 1.2, 1.5, true); persona(441, -1.4, -1.6, false);
persona(371, -12, 0.3, false); persona(458, 1.5, 0.9, false);

[[-30, 54, 0], [-50, 55, 0], [-70, 53, 0], [30, 58, 0], [50, 62, 0], [-98, 30, 1], [-112, 31, 1]].forEach(function (c) {
  edificio({ x: c[0], z: c[1], w: 9 + rnd() * 3, d: 6, h: 2.9, cumbrera: 1.9, alero: 0.7, muro: M.adobe, techo: M.teja, mosaico: 0,
    giro: false, huecos: [
      { lado: c[2] ? '+z' : '-z', u: 0, y: 0, w: 1.1, h: 2.1 },
      { lado: c[2] ? '+z' : '-z', u: -2.8, y: 1.0, w: 0.9, h: 1.2, t: 'v' },
      { lado: c[2] ? '+z' : '-z', u: 2.8, y: 1.0, w: 0.9, h: 1.2, t: 'v' }] });
});

/* --------------------------------------------------------------------------
   FERROCARRIL AÉREO (documentado: 1896, canastas de metal; torres supuestas)
   -------------------------------------------------------------------------- */
var NODOS = [28, 75, 125, 175, 225, 275, 320, 362].map(function (x, i, a) {
  var y = i === 0 ? MOLINO.suelo + 8.6 : (i === a.length - 1 ? 2.5 + 6.6 : altura(x, 0) + 10.5);
  return { x: x, y: y };
});
function puntoCable(u, lado, v) {
  var n = NODOS.length - 1, i = Math.min(n - 1, Math.max(0, Math.floor(u))), f = u - i, a = NODOS[i], b = NODOS[i + 1];
  return v.set(lerp(a.x, b.x, f), lerp(a.y, b.y, f) - 5.6 * f * (1 - f), lado * 1.3);
}
var carros = [];
(function () {
  var matCable = new T.LineBasicMaterial({ color: 0x1c1c1e });
  [-1, 1].forEach(function (lado) {
    var pts = [];
    for (var u = 0; u <= NODOS.length - 1 + 0.001; u += 1 / 14) pts.push(puntoCable(Math.min(u, NODOS.length - 1), lado, new T.Vector3()).clone());
    escena.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), matCable));
  });
  /* torres de madera */
  NODOS.forEach(function (n, i) {
    if (i === 0 || i === NODOS.length - 1) return;
    var base = altura(n.x, 0), h = n.y - base + 0.5, g = new T.Group();
    g.position.set(n.x, base, 0); escena.add(g);
    [-1, 1].forEach(function (s) {
      var p = caja(0.3, h + 1.2, 0.3, M.maderaOsc, 0, h / 2 - 0.5, s * 2.0, 0, g); p.rotation.x = s * 0.17;
      var p2 = caja(0.22, h + 1, 0.22, M.maderaOsc, s * 1.4, h / 2 - 0.5, 0, 0, g); p2.rotation.z = -s * 0.15;
    });
    caja(0.26, 0.26, 4.4, M.maderaOsc, 0, h, 0, 0, g);
    caja(0.16, 0.16, 3.4, M.maderaOsc, 0, h * 0.5, 0, 0, g);
    var x1 = caja(0.12, 0.12, 3.9, M.maderaOsc, 0, h * 0.75, 0, 0, g); x1.rotation.x = 0.62;
    var x2 = caja(0.12, 0.12, 3.9, M.maderaOsc, 0, h * 0.75, 0, 0, g); x2.rotation.x = -0.62;
    choque(n.x - 1.6, n.x + 1.6, -2.6, 2.6);
  });
  /* estaciones */
  function estacion(x, base, yPlat, largo) {
    var g = new T.Group(); g.position.set(x, base, 0); escena.add(g);
    caja(largo, 0.25, 6.4, M.madera, 0, yPlat, 0, 1.2, g);
    [[-1, -1], [-1, 1], [1, -1], [1, 1], [0, -1], [0, 1]].forEach(function (s) {
      caja(0.32, yPlat + 4.2, 0.32, M.maderaOsc, s[0] * (largo / 2 - 0.3), (yPlat + 4.2) / 2, s[1] * 3, 0, g);
    });
    var xa = caja(0.14, 0.14, yPlat * 1.5, M.maderaOsc, 0, yPlat / 2, 3, 0, g); xa.rotation.z = 0.9; xa.rotation.x = Math.PI / 2; xa.rotation.order = 'ZXY';
    var gt = new T.Group(); gt.position.y = yPlat + 4.2; g.add(gt);
    techo(largo, 6.4, 1.5, 0.5, M.calamina, null, 0, gt);
    var polea = new T.Mesh(new T.TorusGeometry(1.25, 0.09, 6, 24), M.fierro);
    polea.rotation.x = Math.PI / 2; polea.position.set(0, yPlat + 2.75, 0); g.add(polea);
    engranajes.push({ m: polea, eje: 'z', v: 1.3 });
    choque(x - largo / 2, x - largo / 2 + 0.6, -3.3, 3.3); choque(x + largo / 2 - 0.6, x + largo / 2, -3.3, 3.3);
    return g;
  }
  var e1 = estacion(26, MOLINO.suelo, 6.2, 9);
  caja(4.4, 0.2, 2.2, M.madera, -6.6, 6.2, 0, 1.2, e1);           // pasarela al molino
  caja(4.4, 0.08, 0.08, M.maderaOsc, -6.6, 7.2, 1.05, 0, e1); caja(4.4, 0.08, 0.08, M.maderaOsc, -6.6, 7.2, -1.05, 0, e1);
  pila(26, MOLINO.suelo + 6.35, 2.2, 3, 2, 2, 0);
  estacion(364, 2.5, 4.2, 9);
  pila(364, 6.85, -2, 3, 2, 2, 0);

  /* carritos: canastas de fierro colgadas del cable */
  for (var i = 0; i < 12; i++) {
    var g = new T.Group(), ida = i < 6;
    caja(0.07, 1.5, 0.07, M.fierro, 0, -0.75, 0, 0, g);
    var r1 = cilindro(0.16, 0.16, 0.08, M.fierro, -0.22, 0.02, 0, 10, g); r1.rotation.x = Math.PI / 2;
    var r2 = cilindro(0.16, 0.16, 0.08, M.fierro, 0.22, 0.02, 0, 10, g); r2.rotation.x = Math.PI / 2;
    caja(1.25, 0.06, 0.8, M.fierro, 0, -2.1, 0, 0, g);
    caja(1.25, 0.6, 0.05, M.fierro, 0, -1.8, 0.4, 0, g); caja(1.25, 0.6, 0.05, M.fierro, 0, -1.8, -0.4, 0, g);
    caja(0.05, 0.6, 0.8, M.fierro, 0.62, -1.8, 0, 0, g); caja(0.05, 0.6, 0.8, M.fierro, -0.62, -1.8, 0, 0, g);
    caja(0.05, 0.05, 0.8, M.fierro, 0, -1.5, 0, 0, g);
    if (ida || i % 2) {
      [[-0.25, -1.9], [0.28, -1.88], [0, -1.6]].forEach(function (p) {
        var s = new T.Mesh(sacos.geometry, M.saco); s.scale.set(0.62, 0.3, 0.5); s.position.set(p[0], p[1], 0); g.add(s);
      });
    }
    escena.add(g);
    carros.push({ g: g, u: ((i % 6) / 6) * (NODOS.length - 1), lado: ida ? 1 : -1, fase: rnd() * 6 });
  }
})();

/* --------------------------------------------------------------------------
   PUERTO: BODEGAS, MUELLE, VELERO
   -------------------------------------------------------------------------- */
(function () {
  var hb = [{ lado: '+z', u: -9, y: 0, w: 3, h: 3.2 }, { lado: '+z', u: 9, y: 0, w: 3, h: 3.2 },
            { lado: '-z', u: -9, y: 0, w: 3, h: 3.2 }, { lado: '-z', u: 9, y: 0, w: 3, h: 3.2 }];
  edificio({ x: 366, z: 23, y: 2.5, w: 36, d: 13, h: 5, cumbrera: 3.2, muro: M.ladrillo, techo: M.calamina, huecos: hb });
  edificio({ x: 366, z: -24, y: 2.5, w: 36, d: 13, h: 5, cumbrera: 3.2, muro: M.ladrillo, techo: M.calamina, huecos: hb });
  edificio({ x: 366, z: -44, y: 2.5, w: 36, d: 13, h: 5, cumbrera: 3.2, muro: M.madera, techo: M.calamina, mosaico: 1.4, huecos: hb });
  pila(388, 2.5, 9, 5, 3, 4, 1.5); pila(391, 2.5, -10, 4, 3, 3, 0.2);
  choque(386.6, 389.4, 6.4, 11.6); choque(388.8, 393.2, -11.4, -8.6);

  /* muelle */
  var largo = MUELLE.x1 - MUELLE.x0, cx = (MUELLE.x0 + MUELLE.x1) / 2;
  var cub = caja(largo, 0.3, 6.6, M.piso, cx, MUELLE.y - 0.15, 0, 2.2);
  var np = Math.floor(largo / 6) + 1, pilotes = new T.InstancedMesh(new T.CylinderGeometry(0.2, 0.22, 8, 7), M.maderaOsc, np * 2);
  for (var i = 0; i < np; i++) [-1, 1].forEach(function (s, j) {
    _m4.makeTranslation(MUELLE.x0 + 1 + i * 6, MUELLE.y - 4.2, s * 2.9); pilotes.setMatrixAt(i * 2 + j, _m4);
  });
  pilotes.castShadow = true; escena.add(pilotes);
  caja(largo, 0.25, 0.25, M.maderaOsc, cx, MUELLE.y - 0.5, 3.1, 0); caja(largo, 0.25, 0.25, M.maderaOsc, cx, MUELLE.y - 0.5, -3.1, 0);
  pila(430, MUELLE.y, -1.6, 4, 2, 3, 0); pila(448, MUELLE.y, 1.7, 3, 2, 3, 0.1);
  choque(428, 432, -2.4, -0.8); choque(446.4, 449.6, 0.9, 2.5);
  /* pescante y farol en el extremo */
  var gp = new T.Group(); gp.position.set(464, MUELLE.y, 2.1); escena.add(gp);
  caja(0.3, 4.4, 0.3, M.maderaOsc, 0, 2.2, 0, 0, gp);
  var bra = caja(0.22, 5, 0.22, M.maderaOsc, 0, 4.6, 1.4, 0, gp); bra.rotation.x = 0.85;
  caja(0.03, 3.6, 0.03, M.oscuro, 0, 4.4, 3.25, 0, gp);
  caja(0.4, 0.14, 0.4, M.fierro, 0, 2.55, 3.25, 0, gp);
  choque(463.4, 464.6, 1.5, 2.7);
  caja(0.14, 3.4, 0.14, M.fierro, 468.6, MUELLE.y + 1.7, -2.3, 0);
  caja(0.34, 0.44, 0.34, new T.MeshBasicMaterial({ color: 0xffd98a }), 468.6, MUELLE.y + 3.6, -2.3, 0);
  caja(0.44, 0.08, 0.44, M.fierro, 468.6, MUELLE.y + 3.86, -2.3, 0);

  /* velero atracado (supuesto) */
  var sh = new T.Shape();
  sh.moveTo(-17, -3); sh.lineTo(10, -3.5); sh.quadraticCurveTo(16, -3, 20, 0);
  sh.quadraticCurveTo(16, 3, 10, 3.5); sh.lineTo(-17, 3); sh.quadraticCurveTo(-19, 0, -17, -3);
  var gh = new T.ExtrudeGeometry(sh, { depth: 4.4, bevelEnabled: false, curveSegments: 6 });
  gh.rotateX(-Math.PI / 2);
  var matCasco = new T.MeshStandardMaterial({ color: 0x2a2521 }), matVela = new T.MeshStandardMaterial({ color: 0xd9cfb6 });
  var barco = new T.Group(); barco.position.set(440, -1.3, 9.2); escena.add(barco);
  var casco = new T.Mesh(gh, matCasco); casco.castShadow = true; barco.add(casco);
  var cubierta = new T.Mesh(new T.ShapeGeometry(sh), M.piso); cubierta.rotation.x = -Math.PI / 2; cubierta.position.y = 4.42; cubierta.scale.set(0.97, 0.9, 1); barco.add(cubierta);
  caja(5, 1.3, 3.4, M.madera, -10, 5.1, 0, 1.2, barco);
  var jarcia = [];
  [[-9, 19], [1, 22], [11, 18]].forEach(function (m) {
    cilindro(0.16, 0.24, m[1], M.maderaOsc, m[0], 4.4 + m[1] / 2, 0, 8, barco);
    [0.5, 0.78].forEach(function (f, n) {
      var y = 4.4 + m[1] * f, w = n ? 7 : 9.5;
      var v = cilindro(0.09, 0.09, w, M.maderaOsc, m[0], y, 0, 6, barco); v.rotation.x = Math.PI / 2;
      var s = cilindro(0.24, 0.24, w * 0.86, matVela, m[0], y - 0.26, 0, 7, barco); s.rotation.x = Math.PI / 2;
    });
    var tope = 4.4 + m[1];
    jarcia.push(m[0], tope, 0, m[0] - 2.4, 4.4, 3.1, m[0], tope, 0, m[0] - 2.4, 4.4, -3.1,
                m[0], tope, 0, m[0] + 1.2, 4.4, 3.2, m[0], tope, 0, m[0] + 1.2, 4.4, -3.2);
  });
  var bau = cilindro(0.1, 0.16, 9, M.maderaOsc, 22.5, 6.2, 0, 6, barco); bau.rotation.z = -Math.PI / 2 + 0.22;
  jarcia.push(11, 22.4, 0, 26.5, 7.1, 0, 1, 26.4, 0, 11, 22.4, 0, -9, 23.4, 0, 1, 26.4, 0, -9, 23.4, 0, -18, 4.6, 0);
  var gj = new T.BufferGeometry(); gj.setAttribute('position', new T.Float32BufferAttribute(jarcia, 3));
  barco.add(new T.LineSegments(gj, new T.LineBasicMaterial({ color: 0x2a2420 })));
  /* lanchas */
  [[414, -14, 0.5], [423, -22, -0.3]].forEach(function (l) {
    var b = new T.Mesh(gh, M.maderaOsc); b.scale.set(0.2, 0.28, 0.26); b.position.set(l[0], -0.55, l[1]); b.rotation.y = l[2]; escena.add(b);
  });
})();

/* --------------------------------------------------------------------------
   ÁRBOLES Y PASTO
   Las copas son racimos de tarjetas con hojas; el pasto, matas cruzadas.
   -------------------------------------------------------------------------- */
function copa(n, rx, ry, rz, tam, r) {
  var pos = [], nor = [], uv = [], col = [], idx = [], e = new T.Euler(), ax = new T.Vector3(), ay = new T.Vector3();
  for (var i = 0; i < n; i++) {
    var u = r() * 2 - 1, a = r() * 6.283, s = Math.sqrt(1 - u * u), k = 0.5 + 0.5 * Math.cbrt(r());
    var cx = s * Math.cos(a) * rx * k, cy = u * ry * k, cz = s * Math.sin(a) * rz * k;
    e.set(r() * 3.14, r() * 3.14, r() * 3.14); ax.set(1, 0, 0).applyEuler(e); ay.set(0, 1, 0).applyEuler(e);
    var h = tam * (0.75 + r() * 0.6), b = pos.length / 3;
    var nx = cx / rx, ny = cy / ry + 0.45, nz = cz / rz, nl = Math.hypot(nx, ny, nz) || 1;
    var luz = (0.5 + 0.5 * k) * (0.72 + 0.28 * (u * 0.5 + 0.5));
    [[-1, -1, 0, 0], [1, -1, 1, 0], [1, 1, 1, 1], [-1, 1, 0, 1]].forEach(function (q) {
      pos.push(cx + (ax.x * q[0] + ay.x * q[1]) * h, cy + (ax.y * q[0] + ay.y * q[1]) * h, cz + (ax.z * q[0] + ay.z * q[1]) * h);
      nor.push(nx / nl, ny / nl, nz / nl); uv.push(q[2], q[3]); col.push(luz, luz, luz);
    });
    idx.push(b, b + 1, b + 2, b, b + 2, b + 3, b, b + 2, b + 1, b, b + 3, b + 2);
  }
  var g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  g.setAttribute('color', new T.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  return g;
}
(function () {
  var N = 620, r = azar(42);
  var matHojas = new T.MeshStandardMaterial({ map: texHojas(), alphaTest: 0.5, vertexColors: true, roughness: 0.9 });
  var troncos = new T.InstancedMesh(new T.CylinderGeometry(0.13, 0.25, 1, 7), M.maderaOsc, N);
  var robles = new T.InstancedMesh(copa(esTactil ? 60 : 95, 1, 0.85, 1, 0.36, r), matHojas, N);
  var sauces = new T.InstancedMesh(copa(esTactil ? 60 : 95, 1.15, 0.7, 1.15, 0.38, r), matHojas, 80);
  var alamos = new T.InstancedMesh(copa(esTactil ? 50 : 80, 0.25, 1, 0.25, 0.13, r), matHojas, 160);
  var nt = 0, nr = 0, ns = 0, na = 0, col = new T.Color();
  function arbol(x, z, tipo) {
    var h = altura(x, z); if (h < 0.8 || nt >= N) return;
    var e = 0.8 + r() * 0.7; _e.set(0, r() * 6.283, 0); _q.setFromEuler(_e);
    if (tipo === 'alamo') {
      if (na >= 160) return;
      _m4.compose(_v.set(x, h + 6.6 * e, z), _q, _s.set(6.2 * e, 6.2 * e, 6.2 * e));
      alamos.setMatrixAt(na, _m4); alamos.setColorAt(na++, col.setHSL(0.2 + r() * 0.04, 0.3, 0.42 + r() * 0.1));
      _m4.compose(_v.set(x, h + 1.4, z), _q, _s.set(1, 3.4, 1)); troncos.setMatrixAt(nt++, _m4);
    } else if (tipo === 'sauce') {
      if (ns >= 80) return;
      var ts = 2.4 * e, rs = 3.5 * e;
      _m4.compose(_v.set(x, h + ts + rs * 0.42, z), _q, _s.set(rs, rs, rs));
      sauces.setMatrixAt(ns, _m4); sauces.setColorAt(ns++, col.setHSL(0.19 + r() * 0.03, 0.42, 0.5 + r() * 0.1));
      _m4.compose(_v.set(x, h + (ts + rs * 0.3) / 2, z), _q, _s.set(1.5 * e, ts + rs * 0.3, 1.5 * e)); troncos.setMatrixAt(nt++, _m4);
    } else {
      var th = 3.1 * e, rc = 2.9 * e;
      _m4.compose(_v.set(x, h + th + rc * 0.55, z), _q, _s.set(rc, rc, rc));
      robles.setMatrixAt(nr, _m4); robles.setColorAt(nr++, col.setHSL(0.22 + r() * 0.07, 0.36, 0.3 + r() * 0.14));
      _m4.compose(_v.set(x, h + (th + rc * 0.5) / 2, z), _q, _s.set(1.5 * e, th + rc * 0.5, 1.5 * e)); troncos.setMatrixAt(nt++, _m4);
    }
  }
  for (var x = -165; x < 240; x += 13) {
    if (Math.abs(x) < 24 || (x > -82 && x < -2)) { if (r() > 0.25) arbol(x + r() * 5, zEstero(x) - 10 - r() * 4, 'sauce'); continue; }
    arbol(x + r() * 5, zEstero(x) + 9.5 + r() * 3, 'sauce');
    if (r() > 0.3) arbol(x + r() * 6, zEstero(x) - 10 - r() * 4, 'sauce');
  }
  for (var xa = -165; xa < -76; xa += 7) arbol(xa, 44 + r(), 'alamo');
  for (var za = 62; za < 86; za += 6) arbol(64 + r() * 2, za, 'alamo');
  var guarda = 0;
  while (nt < N - 4 && guarda++ < 6000) {
    var px = -168 + r() * 500, pz = -228 + r() * 456;
    if (Math.hypot(px, pz - 8) < 62) continue;
    if (px > 318) continue;
    if (Math.abs(pz) < 9 && px > 15) continue;
    if (Math.abs(pz - zEstero(px)) < 12) continue;
    if (pz > 30 && pz < 70 && px < 70 && px > -125) continue;
    var hh = altura(px, pz), dens = ss(8, 30, hh);
    if (r() > 0.25 + dens * 0.75) continue;
    arbol(px, pz, r() > 0.86 ? 'alamo' : 'roble');
  }
  troncos.count = nt; robles.count = nr; sauces.count = ns; alamos.count = na;
  [troncos, robles, sauces, alamos].forEach(function (m) { m.castShadow = true; m.receiveShadow = true; escena.add(m); });
})();

(function () {
  var N = esTactil ? 6000 : 20000, r = azar(5), pos = [], nor = [], uv = [], idx = [];
  [0, Math.PI / 2].forEach(function (a, k) {
    var c = Math.cos(a) * 0.5, s = Math.sin(a) * 0.5, b = k * 4;
    pos.push(-c * 0.8, 0, -s * 0.8, c * 0.8, 0, s * 0.8, c * 0.8, 0.4, s * 0.8, -c * 0.8, 0.4, -s * 0.8);
    nor.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0); uv.push(0, 0, 1, 0, 1, 1, 0, 1);
    idx.push(b, b + 1, b + 2, b, b + 2, b + 3, b, b + 2, b + 1, b, b + 3, b + 2);
  });
  var g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  var matas = new T.InstancedMesh(g, new T.MeshStandardMaterial({ map: texPasto(), alphaTest: 0.4, roughness: 1 }), N);
  var n = 0, guarda = 0, cb = { tinte: new T.Color() }, col = new T.Color();
  while (n < N && guarda++ < N * 10) {
    var q = r(), x, z;
    if (q < 0.5) { var a = r() * 6.283, d = 40 + r() * 100; x = Math.cos(a) * d; z = 8 + Math.sin(a) * d; }
    else if (q < 0.86) { x = 55 + r() * 280; z = (r() * 2 - 1) * 46; }
    else { x = -160 + r() * 390; z = zEstero(x) + (r() > 0.5 ? 1 : -1) * (7 + r() * 16); }
    cobertura(x, z, cb);
    if (cb.tierra > 0.3 || cb.arena > 0.02 || cb.h < 0.8 || cb.d < 6.6) continue;
    var libre = true;
    for (var i = 0; i < choques.length; i++) { var c = choques[i]; if (x > c.x0 - 0.3 && x < c.x1 + 0.3 && z > c.z0 - 0.3 && z < c.z1 + 0.3) { libre = false; break; } }
    if (!libre) continue;
    var e = 0.7 + r() * 1.2;
    _e.set(0, r() * 6.283, 0); _q.setFromEuler(_e);
    _m4.compose(_v.set(x, cb.h - 0.03, z), _q, _s.set(e, e * (0.8 + r() * 0.6), e));
    matas.setMatrixAt(n, _m4);
    matas.setColorAt(n++, col.copy(cb.tinte).multiplyScalar(0.95 + r() * 0.4));
  }
  matas.count = n; matas.receiveShadow = true;
  escena.add(matas);
})();

/* --------------------------------------------------------------------------
   FICHAS: aros que marcan los puntos de información
   -------------------------------------------------------------------------- */
var aros = [];
(function () {
  var g = new T.TorusGeometry(0.42, 0.035, 6, 28), mat = new T.MeshBasicMaterial({ color: 0xd9b25c, transparent: true, opacity: 0.9 });
  FICHAS.forEach(function (f) {
    var a = new T.Mesh(g, mat); a.position.set(f.x, suelo(f.x, f.z) + 1.25, f.z); escena.add(a); aros.push(a);
    var p = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 0.85, 5), mat); p.position.set(f.x, suelo(f.x, f.z) + 0.42, f.z); escena.add(p);
  });
})();

/* --------------------------------------------------------------------------
   VISITANTE: movimiento, mirada y choques
   -------------------------------------------------------------------------- */
var yo = { x: 14, z: 40, y: 0, giro: 0, cabeceo: 0 };
var OJOS = 1.65, activo = false;
var teclas = {}, palanca = { x: 0, y: 0 };

function mirarHacia(m) {
  var dx = m[0] - yo.x, dz = m[2] - yo.z, dy = m[1] - (suelo(yo.x, yo.z) + OJOS);
  yo.giro = Math.atan2(-dx, -dz);
  yo.cabeceo = Math.max(-0.5, Math.min(0.6, Math.atan2(dy, Math.hypot(dx, dz))));
}
function permitido(x, z) {
  if (x < -160 || x > 505 || z < -220 || z > 220) return false;
  if (!enMuelle(x, z) && altura(x, z) < 0.25) return false;
  return true;
}
function resolver(x, z) {
  var R = 0.45;
  for (var i = 0; i < choques.length; i++) {
    var c = choques[i];
    if (x > c.x0 - R && x < c.x1 + R && z > c.z0 - R && z < c.z1 + R) {
      var a = x - (c.x0 - R), b = (c.x1 + R) - x, d = z - (c.z0 - R), e = (c.z1 + R) - z, m = Math.min(a, b, d, e);
      if (m === a) x = c.x0 - R; else if (m === b) x = c.x1 + R; else if (m === d) z = c.z0 - R; else z = c.z1 + R;
    }
  }
  return [x, z];
}
function mover(dt) {
  var av = (teclas.KeyW || teclas.ArrowUp ? 1 : 0) - (teclas.KeyS || teclas.ArrowDown ? 1 : 0) - palanca.y;
  var la = (teclas.KeyD ? 1 : 0) - (teclas.KeyA ? 1 : 0) + palanca.x;
  var gi = (teclas.ArrowLeft ? 1 : 0) - (teclas.ArrowRight ? 1 : 0);
  yo.giro += gi * 1.7 * dt;
  var mod = Math.hypot(av, la);
  if (mod > 0.05) {
    if (mod > 1) { av /= mod; la /= mod; }
    var vel = (teclas.ShiftLeft || teclas.ShiftRight ? 9.5 : 4.4) * dt;
    var s = Math.sin(yo.giro), c = Math.cos(yo.giro);
    var nx = yo.x + (-s * av + c * la) * vel, nz = yo.z + (-c * av - s * la) * vel;
    var r = resolver(nx, nz); nx = r[0]; nz = r[1];
    if (permitido(nx, nz)) { yo.x = nx; yo.z = nz; }
    else if (permitido(nx, yo.z)) yo.x = nx;
    else if (permitido(yo.x, nz)) yo.z = nz;
  }
  var obj = suelo(yo.x, yo.z) + OJOS;
  yo.y += (obj - yo.y) * Math.min(1, dt * 10);
}

window.addEventListener('keydown', function (e) {
  if (!activo) return;
  if (/^(Key[WASD]|Arrow|Shift)/.test(e.code)) { teclas[e.code] = true; if (e.code.indexOf('Arrow') === 0) e.preventDefault(); }
});
window.addEventListener('keyup', function (e) { teclas[e.code] = false; });
window.addEventListener('blur', function () { teclas = {}; });

/* mirar arrastrando (ratón o dedo) */
var arrastre = null;
lienzo.addEventListener('pointerdown', function (e) {
  if (!activo) return;
  arrastre = { id: e.pointerId, x: e.clientX, y: e.clientY };
  try { lienzo.setPointerCapture(e.pointerId); } catch (err) {}
});
lienzo.addEventListener('pointermove', function (e) {
  if (!arrastre || e.pointerId !== arrastre.id) return;
  var k = e.pointerType === 'touch' ? 0.0052 : 0.0034;
  yo.giro -= (e.clientX - arrastre.x) * k;
  yo.cabeceo = Math.max(-1.2, Math.min(1.2, yo.cabeceo - (e.clientY - arrastre.y) * k));
  arrastre.x = e.clientX; arrastre.y = e.clientY;
});
function soltar(e) { if (arrastre && e.pointerId === arrastre.id) arrastre = null; }
lienzo.addEventListener('pointerup', soltar); lienzo.addEventListener('pointercancel', soltar);

/* palanca táctil */
(function () {
  var base = document.getElementById('palanca'), perilla = document.getElementById('palancaPerilla'), id = null, R = 44;
  if (!base) return;
  function fijar(e) {
    var b = base.getBoundingClientRect(), dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2);
    var m = Math.hypot(dx, dy); if (m > R) { dx *= R / m; dy *= R / m; }
    palanca.x = dx / R; palanca.y = dy / R;
    perilla.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
  }
  function fin(e) { if (e.pointerId !== id) return; id = null; palanca.x = palanca.y = 0; perilla.style.transform = ''; }
  base.addEventListener('pointerdown', function (e) { id = e.pointerId; try { base.setPointerCapture(id); } catch (err) {} fijar(e); e.preventDefault(); });
  base.addEventListener('pointermove', function (e) { if (e.pointerId === id) fijar(e); });
  base.addEventListener('pointerup', fin); base.addEventListener('pointercancel', fin);
})();

/* --------------------------------------------------------------------------
   SONIDO (sintetizado; no usa archivos)
   -------------------------------------------------------------------------- */
var audio = null, sonidoActivo = true;
function iniciarAudio() {
  if (audio || !sonidoActivo) return;
  var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  var ctx = new AC(), n = ctx.sampleRate * 3, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0), u = 0;
  for (var i = 0; i < n; i++) { var w = Math.random() * 2 - 1; u = (u + 0.02 * w) / 1.02; d[i] = u * 3.2; }
  var maestro = ctx.createGain(); maestro.gain.value = 0.9; maestro.connect(ctx.destination);
  function capa(tipo, frec, q) {
    var s = ctx.createBufferSource(); s.buffer = buf; s.loop = true;
    var f = ctx.createBiquadFilter(); f.type = tipo; f.frequency.value = frec; f.Q.value = q || 0.7;
    var g = ctx.createGain(); g.gain.value = 0;
    s.connect(f); f.connect(g); g.connect(maestro); s.start(0, Math.random() * 2);
    return g;
  }
  audio = { ctx: ctx, maestro: maestro, agua: capa('highpass', 500, 0.5), molino: capa('lowpass', 120, 1.2), mar: capa('lowpass', 420, 0.6), viento: capa('bandpass', 300, 0.4) };
}
function bocina() {
  iniciarAudio(); if (!audio) return;
  var ctx = audio.ctx, t = ctx.currentTime, g = ctx.createGain(), f = ctx.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = 900; f.connect(g); g.connect(audio.maestro);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.32, t + 0.25);
  g.gain.setValueAtTime(0.32, t + 2.4); g.gain.linearRampToValueAtTime(0, t + 3.1);
  [156, 208, 311].forEach(function (hz) {
    var o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(hz * 0.9, t);
    o.frequency.linearRampToValueAtTime(hz, t + 0.35); o.connect(f); o.start(t); o.stop(t + 3.2);
  });
}
function mezclar(t) {
  if (!audio) return;
  var k = sonidoActivo && activo ? 1 : 0, ahora = audio.ctx.currentTime;
  var dAgua = Math.abs(yo.z - zEstero(yo.x)), dMol = Math.hypot(yo.x, yo.z), dentro = enMolino(yo.x, yo.z);
  function a(g, v) { g.gain.setTargetAtTime(v * k, ahora, 0.25); }
  a(audio.agua, 0.2 * (1 - ss(4, 45, dAgua)));
  a(audio.molino, dentro ? 0.75 : 0.5 * (1 - ss(8, 70, dMol)));
  a(audio.mar, 0.4 * ss(330, 400, yo.x) * (0.7 + 0.3 * Math.sin(t * 0.7)));
  a(audio.viento, 0.05 + 0.1 * ss(10, 45, altura(yo.x, yo.z)));
}

/* --------------------------------------------------------------------------
   INTERFAZ
   -------------------------------------------------------------------------- */
var $ = function (id) { return document.getElementById(id); };
var velo = $('velo'), ficha = $('ficha'), fichaActual = -1, fichaCerrada = -1;

function irA(l) {
  velo.classList.add('velo--visible');
  setTimeout(function () {
    yo.x = l.x; yo.z = l.z; yo.y = suelo(l.x, l.z) + OJOS; mirarHacia(l.mira);
    velo.classList.remove('velo--visible');
  }, pocoMovimiento ? 0 : 320);
  document.querySelectorAll('.lugares__boton').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === l.id ? 'true' : 'false'); });
}
(function () {
  var cont = $('lugares');
  LUGARES.forEach(function (l) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'lugares__boton'; b.textContent = l.nombre; b.dataset.id = l.id;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { irA(l); });
    cont.appendChild(b);
  });
})();

function mostrarFicha(i) {
  var f = FICHAS[i];
  $('fichaTitulo').textContent = f.titulo;
  $('fichaDoc').textContent = f.doc;
  $('fichaSup').textContent = f.sup;
  $('fichaFuente').textContent = f.fuente;
  $('fichaAccion').hidden = f.accion !== 'bocina';
  ficha.hidden = false;
}
function revisarFichas() {
  var mejor = -1, dm = 1e9;
  for (var i = 0; i < FICHAS.length; i++) {
    var d = Math.hypot(yo.x - FICHAS[i].x, yo.z - FICHAS[i].z);
    if (d < FICHAS[i].r && d < dm) { dm = d; mejor = i; }
  }
  if (mejor !== fichaActual) {
    fichaActual = mejor;
    if (mejor === -1) { ficha.hidden = true; fichaCerrada = -1; }
    else if (mejor !== fichaCerrada) mostrarFicha(mejor);
  }
}
$('fichaCerrar').addEventListener('click', function () { ficha.hidden = true; fichaCerrada = fichaActual; });
$('fichaAccion').addEventListener('click', bocina);

$('entrar').addEventListener('click', function () {
  document.body.classList.add('en-recorrido');
  $('portada').hidden = true;
  activo = true;
  yo.x = LUGARES[0].x; yo.z = LUGARES[0].z; yo.y = suelo(yo.x, yo.z) + OJOS; mirarHacia(LUGARES[0].mira);
  iniciarAudio();
  lienzo.focus();
});
$('botonEpoca').addEventListener('click', function () {
  var on = document.body.classList.toggle('modo-epoca');
  this.setAttribute('aria-pressed', on ? 'true' : 'false');
});
$('botonSonido').addEventListener('click', function () {
  sonidoActivo = !sonidoActivo;
  this.setAttribute('aria-pressed', sonidoActivo ? 'true' : 'false');
  this.querySelector('span').textContent = sonidoActivo ? 'Sonido' : 'Silencio';
  if (sonidoActivo) { iniciarAudio(); if (audio) audio.ctx.resume(); }
});
$('botonAyuda').addEventListener('click', function () {
  var a = $('ayuda'); a.hidden = !a.hidden;
  this.setAttribute('aria-expanded', a.hidden ? 'false' : 'true');
});
$('ayudaCerrar').addEventListener('click', function () { $('ayuda').hidden = true; $('botonAyuda').setAttribute('aria-expanded', 'false'); });

/* --------------------------------------------------------------------------
   BUCLE
   -------------------------------------------------------------------------- */
function ajustar() {
  var w = window.innerWidth, h = window.innerHeight;
  render.setSize(w, h, false);
  camara.aspect = w / h; camara.fov = w < h ? 74 : 62; camara.updateProjectionMatrix();
}
window.addEventListener('resize', ajustar); ajustar();

var reloj = new T.Clock(), tiempo = 0, ultimaRevision = 0, _p = new T.Vector3();
function animar() {
  requestAnimationFrame(animar);
  var dt = Math.min(0.05, reloj.getDelta());
  if (document.hidden) return;
  tiempo += dt;

  if (activo) {
    mover(dt);
    camara.position.set(yo.x, yo.y, yo.z);
    camara.rotation.set(yo.cabeceo, yo.giro, 0);
    if (tiempo - ultimaRevision > 0.2) { ultimaRevision = tiempo; revisarFichas(); mezclar(tiempo); }
  } else {
    var a = 0.72 + (pocoMovimiento ? 0 : tiempo * 0.035);
    camara.position.set(Math.sin(a) * 64, 23, Math.cos(a) * 64 + 6);
    camara.lookAt(4, 13, 0);
    yo.x = camara.position.x; yo.z = camara.position.z;
  }
  sol.target.position.set(yo.x, suelo(yo.x, yo.z), yo.z);
  sol.position.copy(sol.target.position).add(DIR_SOL);

  /* andarivel */
  var total = NODOS.length - 1;
  for (var i = 0; i < carros.length; i++) {
    var c = carros[i];
    c.u += c.lado * dt * 0.034;
    if (c.u > total) c.u -= total; if (c.u < 0) c.u += total;
    puntoCable(c.u, c.lado, _p);
    c.g.position.copy(_p);
    c.g.rotation.x = Math.sin(tiempo * 1.3 + c.fase) * 0.035;
  }
  for (var e = 0; e < engranajes.length; e++) engranajes[e].m.rotation[engranajes[e].eje] += engranajes[e].v * dt;
  for (var h = 0; h < humo.length; h++) {
    var hu = humo[h]; hu.t = (hu.t + dt * 0.055) % 1;
    var t = hu.t, esc = 2 + t * 13;
    hu.s.position.set(-24 + t * t * 46 + Math.sin(h * 2.1 + tiempo * 0.3) * t * 3, MOLINO.suelo + 25 + t * 26, -3 - t * 14);
    hu.s.scale.set(esc, esc, 1);
    hu.s.material.opacity = 0.5 * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (1 - t * 0.5);
  }
  texEstero.offset.y = -tiempo * 0.09;
  texMar.offset.x = tiempo * 0.021; texMar.offset.y = tiempo * 0.034;
  if (aguaCanal) aguaCanal.material.normalMap.offset.x = -tiempo * 0.2;
  for (var r = 0; r < aros.length; r++) aros[r].rotation.y = tiempo * 1.1 + r;

  render.render(escena, camara);
}
document.body.classList.add('listo');
animar();

})();
