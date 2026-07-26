/* ==========================================================================
   AGENDA DE LA RED — actividades futuras ("La Agenda")
   Red de Patrimonio y Medio Ambiente — Dirección de Educación de Tomé
   --------------------------------------------------------------------------
   CÓMO AGREGAR UNA ACTIVIDAD

   La sección "La Agenda" se arma sola a partir de la lista ACTIVIDADES de más
   abajo. Para publicar una actividad nueva:

     1. (Opcional) Si tiene afiche o invitación, guarda la imagen en la carpeta
        img/ con un nombre corto y sin espacios (por ejemplo: afiche-01.jpg).

     2. Copia un bloque de ejemplo y pégalo DENTRO de los corchetes de
        ACTIVIDADES. El orden no importa: la página las ordena solas por fecha,
        de la más próxima a la más lejana.

     3. Cambia los datos. Guarda el archivo.

   La forma más fácil es usar el asistente: abre "agregar-noticia.html" en el
   navegador y ve a la pestaña "Nueva actividad".

   Las actividades cuya fecha ya pasó se ocultan automáticamente.

   Campos de cada actividad:
     fecha          Fecha en formato 'AAAA-MM-DD'. Ordena y decide si ya pasó.
                    Si solo sabes el mes, usa el día 01 (ej. '2026-09-01').
     etiquetaFecha  Texto que se ve en el recuadro de fecha. Si lo dejas vacío,
                    se usa el mes de la fecha. Sirve para rangos: 'Sep–Oct'.
     eje            'patrimonio' | 'ambiente' | 'ambos'
     titulo         Título de la actividad.
     detalle        Descripción breve.
     imagen         (Opcional) Afiche o invitación: nombre del archivo en img/.
                    Si no hay, dejar '' (comillas vacías).
     alt            Descripción de la imagen para lectores de pantalla.
   ========================================================================== */

var ACTIVIDADES = [

  {
    fecha: '2026-08-01',
    etiquetaFecha: 'Agosto',
    eje: 'ambos',
    titulo: 'Certificación ambiental y balance de la asignatura',
    detalle: 'Trabajo en torno al Sistema Nacional de Certificación Ambiental de Establecimientos (SINCAE) y análisis FODA del primer semestre de la asignatura de Patrimonio y Medio Ambiente.',
    imagen: '',
    alt: ''
  },

  {
    fecha: '2026-09-01',
    etiquetaFecha: 'Sep–Oct',
    eje: 'patrimonio',
    titulo: 'Sesiones en sedes patrimoniales y salidas de terreno',
    detalle: 'Reuniones de la Red en lugares patrimoniales de la comuna y salidas de terreno con estudiantes de los establecimientos.',
    imagen: '',
    alt: ''
  },

  {
    fecha: '2026-11-01',
    etiquetaFecha: 'Noviembre',
    eje: 'ambiente',
    titulo: 'Jornada de educación ambiental en el Vivero Municipal',
    detalle: 'Trabajo en el Vivero Municipal y actividades de educación ambiental con las comunidades educativas.',
    imagen: '',
    alt: ''
  },

  {
    fecha: '2026-12-01',
    etiquetaFecha: 'Diciembre',
    eje: 'ambos',
    titulo: 'Evaluación del año y proyección 2027',
    detalle: 'Sesión de cierre para evaluar el trabajo del año y proyectar la planificación del período siguiente.',
    imagen: '',
    alt: ''
  }

];


/* ==========================================================================
   A partir de aquí no es necesario editar nada: la página se arma sola.
   ========================================================================== */
(function () {
  'use strict';

  var contenedor = document.getElementById('listaAgenda');
  if (!contenedor) return;

  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
               'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  var EJES = {
    patrimonio: { clase: 'marca-eje--patrimonio', texto: 'Patrimonio' },
    ambiente:   { clase: 'marca-eje--ambiente',   texto: 'Medio ambiente' },
    ambos:      { clase: 'marca-eje--ambos',      texto: 'Ambos ejes' }
  };

  // Fecha de hoy en formato AAAA-MM-DD (hora local)
  var hoy = new Date();
  var hoyISO = hoy.getFullYear() + '-' +
               String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
               String(hoy.getDate()).padStart(2, '0');

  function mesDe(iso) {
    var p = String(iso).split('-');
    var m = parseInt(p[1], 10);
    return (m >= 1 && m <= 12) ? MESES[m - 1].charAt(0).toUpperCase() + MESES[m - 1].slice(1) : '';
  }
  function anioDe(iso) { return String(iso).split('-')[0] || ''; }

  // Solo futuras (o sin fecha), ordenadas de la más próxima a la más lejana
  var lista = ACTIVIDADES
    .filter(function (a) { return !a.fecha || a.fecha >= hoyISO; })
    .sort(function (a, b) { return (a.fecha || '').localeCompare(b.fecha || ''); });

  if (!lista.length) {
    contenedor.innerHTML =
      '<li class="agenda__vacia">Pronto publicaremos nuevas actividades. Te invitamos a volver a visitarnos.</li>';
    return;
  }

  contenedor.innerHTML = lista.map(function (a) {
    var eje = EJES[a.eje] || EJES.ambos;
    var mes = a.etiquetaFecha ? a.etiquetaFecha : mesDe(a.fecha);
    var anio = anioDe(a.fecha);

    var afiche = '';
    if (a.imagen) {
      afiche = '<a class="agenda__afiche" href="img/' + a.imagen + '" target="_blank" rel="noopener">' +
                 '<img src="img/' + a.imagen + '" alt="' + (a.alt || 'Afiche de la actividad') + '" loading="lazy">' +
               '</a>';
    }

    return '<li class="agenda__item">' +
             '<div class="agenda__fecha">' +
               '<span class="agenda__mes">' + mes + '</span>' +
               (anio ? '<span class="agenda__anio">' + anio + '</span>' : '') +
             '</div>' +
             '<div class="agenda__cuerpo">' +
               afiche +
               '<span class="marca-eje ' + eje.clase + '">' + eje.texto + '</span>' +
               '<h3 class="agenda__titulo">' + a.titulo + '</h3>' +
               '<p class="agenda__detalle">' + a.detalle + '</p>' +
             '</div>' +
           '</li>';
  }).join('');

})();
