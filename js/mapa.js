/* ==========================================================================
   MAPA PATRIMONIAL Y AMBIENTAL DE LA COMUNA DE TOMÉ
   Red de Patrimonio y Medio Ambiente — Dirección de Educación de Tomé
   --------------------------------------------------------------------------
   CÓMO EDITAR LOS PUNTOS

   Toda la información del mapa está en el arreglo PUNTOS de más abajo. Para
   agregar, corregir o quitar un punto basta con editar ese arreglo.

   Cada punto tiene:
     categoria    'patrimonio' | 'ambiente' | 'establecimiento' | 'localidad'
     nombre       Título que aparece en la ficha del marcador
     detalle      Descripción breve, una o dos frases
     lat, lon     Coordenadas en grados decimales (sur y oeste son negativos)
     verificado   true  = coordenada obtenida de OpenStreetMap
                  false = ubicación aproximada, pendiente de corregir en terreno

   Para obtener la coordenada exacta de un lugar: abrir openstreetmap.org,
   hacer clic derecho sobre el punto y elegir "Mostrar dirección"; también
   sirve Google Maps, haciendo clic derecho y copiando el par de números.
   ========================================================================== */

var PUNTOS = [

  /* ---------- PATRIMONIO ---------- */
  {
    categoria: 'patrimonio',
    nombre: 'El Vagón, Círculo de Bellas Artes',
    detalle: 'Antiguo vagón de ferrocarril recuperado en el Barrio Explanada, sede del Círculo de Bellas Artes. La Red sesionó aquí en septiembre de 2025.',
    lat: -36.6255, lon: -72.9540, verificado: false
  },
  {
    categoria: 'patrimonio',
    nombre: 'Ex Estación de Ferrocarriles',
    detalle: 'Emplazamiento de la desaparecida estación de ferrocarriles de Tomé, eje del patrimonio industrial de la comuna.',
    lat: -36.6240, lon: -72.9550, verificado: false
  },
  {
    categoria: 'patrimonio',
    nombre: 'Muelle Hinrichsen',
    detalle: 'Muelle histórico vinculado a la actividad portuaria e industrial. Extremo de la ruta patrimonial escolar Muelle Hinrichsen – Vagón.',
    lat: -36.6120, lon: -72.9660, verificado: false
  },
  {
    categoria: 'patrimonio',
    nombre: 'Barrio y fábrica Bellavista',
    detalle: 'Conjunto industrial y barrio obrero de la antigua fábrica textil Bellavista Oveja Tomé, origen de la identidad textil de la comuna.',
    lat: -36.63684, lon: -72.95130, verificado: true
  },

  /* ---------- MEDIO AMBIENTE ---------- */
  {
    categoria: 'ambiente',
    nombre: 'Vivero Municipal de Tomé',
    detalle: 'Espacio de aprendizaje práctico de la Red: huertos, hierbas medicinales y germinación del Queule, especie endémica de la zona.',
    lat: -36.6080, lon: -72.9490, verificado: false
  },
  {
    categoria: 'ambiente',
    nombre: 'Playa El Morro',
    detalle: 'Borde costero urbano de Tomé, espacio de trabajo sobre ecosistemas marinos y cuidado del litoral.',
    lat: -36.61518, lon: -72.96427, verificado: true
  },
  {
    categoria: 'ambiente',
    nombre: 'Playa Bellavista',
    detalle: 'Sector costero contiguo al barrio industrial, donde patrimonio y medio ambiente se superponen en un mismo paisaje.',
    lat: -36.63299, lon: -72.95677, verificado: true
  },
  {
    categoria: 'ambiente',
    nombre: 'Caleta Cocholgüe',
    detalle: 'Caleta pesquera con patrimonio inmaterial vivo y ecosistemas costeros de interés para el trabajo escolar.',
    lat: -36.5850, lon: -72.9750, verificado: false
  },
  {
    categoria: 'ambiente',
    nombre: 'Península de Coliumo',
    detalle: 'Área de alto valor ecológico en el extremo norte de la comuna, con bosque nativo y borde costero.',
    lat: -36.52702, lon: -72.95441, verificado: true
  },

  /* ---------- ESTABLECIMIENTOS DE LA RED ---------- */
  {
    categoria: 'establecimiento',
    nombre: 'Escuela Menque',
    detalle: 'Enseñanza básica, sector rural interior.',
    lat: -36.55314, lon: -72.86708, verificado: true
  },
  {
    categoria: 'establecimiento',
    nombre: 'Escuela Caleta del Medio',
    detalle: 'Enseñanza básica, sector costero norte.',
    lat: -36.53842, lon: -72.96018, verificado: true
  },
  {
    categoria: 'establecimiento',
    nombre: 'Escuela Vegas de Coliumo',
    detalle: 'Enseñanza básica, península de Coliumo.',
    lat: -36.55640, lon: -72.95913, verificado: true
  },
  {
    categoria: 'establecimiento',
    nombre: 'Escuela Cerro Estanque',
    detalle: 'Enseñanza básica, sector urbano de Tomé.',
    lat: -36.61143, lon: -72.94742, verificado: true
  },
  {
    categoria: 'establecimiento',
    nombre: 'Escuela Ignacio Serrano Montaner',
    detalle: 'Enseñanza básica, sector urbano de Tomé.',
    lat: -36.60973, lon: -72.95933, verificado: true
  },
  {
    categoria: 'establecimiento',
    nombre: 'Escuela Cocholgüe',
    detalle: 'Enseñanza básica, sector costero de Cocholgüe.',
    lat: -36.60128, lon: -72.97118, verificado: true
  },
  {
    categoria: 'establecimiento',
    nombre: 'Escuela Millahue',
    detalle: 'Enseñanza básica, sector rural sur oriente.',
    lat: -36.70564, lon: -72.78126, verificado: true
  },
  {
    categoria: 'establecimiento',
    nombre: 'Escuela Artística de Panamá',
    detalle: 'Enseñanza básica con modalidad artística, sector Panamá.',
    lat: -36.62612, lon: -72.95337, verificado: true
  },
  {
    categoria: 'establecimiento',
    nombre: 'Liceo República del Ecuador',
    detalle: 'Enseñanza media. Sede de la reunión de la Red de julio de 2025.',
    lat: -36.61592, lon: -72.95306, verificado: true
  },
  {
    categoria: 'establecimiento',
    nombre: 'Liceo Comercial',
    detalle: 'Enseñanza media técnico profesional.',
    lat: -36.61427, lon: -72.95666, verificado: true
  },
  {
    categoria: 'establecimiento',
    nombre: 'Liceo Vicente Palacios',
    detalle: 'Enseñanza media.',
    lat: -36.61072, lon: -72.95549, verificado: true
  },

  /* ---------- LOCALIDADES DE LA COMUNA ---------- */
  {
    categoria: 'localidad',
    nombre: 'Tomé',
    detalle: 'Centro urbano de la comuna y sede de la Dirección de Educación Municipal.',
    lat: -36.61708, lon: -72.95750, verificado: true
  },
  {
    categoria: 'localidad',
    nombre: 'Dichato',
    detalle: 'Localidad costera del norte de la comuna.',
    lat: -36.54863, lon: -72.93644, verificado: true
  },
  {
    categoria: 'localidad',
    nombre: 'Punta de Parra',
    detalle: 'Localidad costera del sur de la comuna.',
    lat: -36.67352, lon: -72.96478, verificado: true
  },
  {
    categoria: 'localidad',
    nombre: 'Rafael',
    detalle: 'Localidad del interior rural, sector oriente.',
    lat: -36.63146, lon: -72.79189, verificado: true
  },
  {
    categoria: 'localidad',
    nombre: 'Menque',
    detalle: 'Localidad del interior rural, sector nororiente.',
    lat: -36.55573, lon: -72.86550, verificado: true
  }

];


/* ==========================================================================
   A partir de aquí no es necesario editar nada.
   ========================================================================== */
(function () {
  'use strict';

  var contenedor = document.getElementById('mapaComuna');
  if (!contenedor || typeof L === 'undefined') return;

  var COLORES = {
    patrimonio:      '#A2542F',
    ambiente:        '#2E9E68',
    establecimiento: '#1E3F32',
    localidad:       '#8A928C'
  };

  var ETIQUETAS = {
    patrimonio:      'Patrimonio',
    ambiente:        'Medio ambiente',
    establecimiento: 'Establecimiento de la Red',
    localidad:       'Localidad'
  };

  var mapa = L.map('mapaComuna', {
    scrollWheelZoom: false,   // evita capturar el desplazamiento de la página
    zoomControl: true
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; colaboradores de <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
  }).addTo(mapa);

  // El desplazamiento con rueda se activa solo al hacer clic dentro del mapa.
  mapa.on('click', function () { mapa.scrollWheelZoom.enable(); });
  mapa.on('mouseout', function () { mapa.scrollWheelZoom.disable(); });

  var marcadores = [];

  PUNTOS.forEach(function (punto) {
    var color = COLORES[punto.categoria] || COLORES.localidad;

    var icono = L.divIcon({
      className: 'marcador',
      html: '<span class="marcador__punto" style="background:' + color + '"></span>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10]
    });

    var ficha =
      '<p class="ficha-mapa__categoria" style="color:' + color + '">' + ETIQUETAS[punto.categoria] + '</p>' +
      '<h3 class="ficha-mapa__nombre">' + punto.nombre + '</h3>' +
      '<p class="ficha-mapa__detalle">' + punto.detalle + '</p>' +
      (punto.verificado ? '' : '<p class="ficha-mapa__aviso">Ubicación aproximada, pendiente de precisar.</p>');

    var marcador = L.marker([punto.lat, punto.lon], {
      icon: icono,
      title: punto.nombre,
      alt: punto.nombre
    }).bindPopup(ficha);

    marcador.addTo(mapa);
    marcadores.push({ capa: marcador, categoria: punto.categoria });
  });

  mapa.fitBounds(L.latLngBounds(PUNTOS.map(function (p) { return [p.lat, p.lon]; })), {
    padding: [36, 36]
  });

  // Filtros por categoría
  var botones = Array.prototype.slice.call(document.querySelectorAll('.filtro-mapa'));

  botones.forEach(function (boton) {
    boton.addEventListener('click', function () {
      var categoria = boton.getAttribute('data-categoria');

      botones.forEach(function (otro) {
        otro.classList.toggle('filtro--activo', otro === boton);
      });

      var visibles = [];

      marcadores.forEach(function (item) {
        var mostrar = categoria === 'todos' || item.categoria === categoria;
        if (mostrar) {
          item.capa.addTo(mapa);
          visibles.push(item.capa.getLatLng());
        } else {
          mapa.removeLayer(item.capa);
        }
      });

      if (visibles.length) {
        mapa.fitBounds(L.latLngBounds(visibles), { padding: [36, 36], maxZoom: 14 });
      }
    });
  });

})();
