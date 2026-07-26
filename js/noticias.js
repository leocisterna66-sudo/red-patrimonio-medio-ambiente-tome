/* ==========================================================================
   NOTICIAS DE LA RED — "Red en Acción"
   Red de Patrimonio y Medio Ambiente — Dirección de Educación de Tomé
   --------------------------------------------------------------------------
   CÓMO AGREGAR UNA NOTICIA

   Toda la sección "Red en Acción" se arma sola a partir de la lista NOTICIAS
   de más abajo. Para publicar una noticia nueva:

     1. Descarga la fotografía de la publicación y guárdala en la carpeta img/
        con un nombre corto y sin espacios (por ejemplo: nota-04.jpg).

     2. Copia uno de los bloques de ejemplo de abajo y pégalo DENTRO de los
        corchetes de NOTICIAS, arriba de todo (la más nueva va primera).

     3. Cambia los datos: fecha, lugar, titulo, resumen, cuerpo y foto.

     4. Guarda el archivo. La noticia aparecerá sola en la página, y la más
        reciente se mostrará destacada de forma automática.

   Si prefieres no escribir el bloque a mano, abre el archivo
   "agregar-noticia.html" en el navegador: llenas un formulario y te entrega
   el bloque ya listo para copiar y pegar aquí.

   Campos de cada noticia:
     fecha    Fecha en formato 'AAAA-MM-DD' (año-mes-día). Ordena las noticias.
     lugar    Dónde ocurrió. Aparece junto a la fecha.
     titulo   Título de la noticia.
     resumen  Una o dos frases que se ven en la tarjeta.
     cuerpo   Texto completo, que se abre al pulsar "Leer la nota completa".
              Es una lista de párrafos, cada uno entre comillas y separado por
              coma. Si no hay texto largo, dejar los corchetes vacíos: []
     foto     Nombre del archivo de imagen dentro de la carpeta img/
     alt      Descripción breve de la foto para lectores de pantalla.
   ========================================================================== */

var NOTICIAS = [  
{
    fecha: '2026-07-23',
    lugar: 'Escuela Republica de Panamá',
    titulo: 'Jornada de Capacitación.',
    resumen: 'La Red de Patrimonio y Medio Ambiente del DEM Tomé fortalece el aprendizaje docente a través de la obra de Héctor Herrera "El Pajarero".',
    cuerpo: [
      'En una lluviosa jornada de julio, docentes de las Comunidades de Aprendizaje de Profesionales (CAP) de la Red de Patrimonio y Medio Ambiente del DEM Tomé se reunieron en la Biblioteca de la Escuela Artística Panamá para participar en una enriquecedora capacitación dedicada a la vida y obra del destacado artista tomecino Héctor Herrera Sanhueza, "El Pajarero". La actividad fue guiada por Alejandra Villarroel Sánchez, periodista encargada de Comunicaciones y Mediación Territorial del Archivo Héctor Herrera en la Región del Biobío, quien presentó el legado artístico del creador, abordando sus técnicas, procesos creativos y el profundo vínculo de su obra con la identidad cultural de Tomé. Uno de los momentos más significativos de la jornada fue la lectura de un cuento de Héctor Herrera, registrada por el recordado Darwin Rodríguez, material que forma parte del Archivo en su área de Educación y que emocionó a las y los asistentes. Esta instancia permitió fortalecer el trabajo pedagógico que desarrollan las comunidades educativas en torno al patrimonio local, promoviendo valores como el respeto por la historia, la identidad territorial, la convivencia democrática, la creatividad y el compromiso con el entorno. Participaron la directora de la Escuela Artística Panamá, Kirna Rivas, junto a docentes de la Escuela Artística Panamá, Centro de Educación Bicentenario Altos de Frutillares, Escuela Cocholgüe, Escuela Ignacio Serrano, Escuela Caleta del Medio, Escuela Menque y Escuela Patrimonial California. La jornada fue coordinada por Lorenna Arce Orellana, encargada de Patrimonio y Medio Ambiente del DEM Tomé, reafirmando el compromiso de la educación pública con la valoración y preservación del patrimonio cultural de nuestra comuna.'
    ],
    foto: 'nota-04.jpg',
    alt: 'Alejandra Villarroel Sánchez, del Archivo Héctor Herrera, durante la capacitación en la Escuela Artística Panamá'
  },

  {
    fecha: '2026-05-20',
    lugar: 'Vivero Municipal',
    titulo: 'La Red se capacita en el Vivero Municipal: huertos, hierbas medicinales y el Queule',
    resumen: 'Braulio Quezada compartió saberes ancestrales sobre cultivo y hierbas medicinales; Ricardo Cuevas explicó la germinación del Queule y el valor del bosque nativo, y Yanina Palavicino junto a Gustavo Toledo abordaron el cambio climático.',
    cuerpo: [
      'Con el propósito de fortalecer la política del Ministerio de Educación en Patrimonio y Medio Ambiente, y de potenciar la asignatura y los talleres en los establecimientos de enseñanza básica y media de la comuna, se desarrolló una nueva jornada de capacitación dirigida a los docentes de la Red. La actividad se realizó en el Vivero Municipal de Tomé, donde los participantes adquirieron conocimientos mediante experiencias prácticas y vivenciales.',
      'Uno de los talleres estuvo a cargo de Braulio Quezada, quien compartió saberes sobre prácticas ancestrales vinculadas al cultivo de huertos y al uso de hierbas medicinales como la menta, el toronjil, la salvia, la lavanda y la ruda. Se promovió además la implementación de huertos escolares como metodología de aprendizaje basada en el método científico.',
      'Ricardo Cuevas explicó el proceso de germinación de semillas, especialmente del Queule (<em>Gomortega keule</em>), especie endémica presente entre Tomé y Talca, destacando su relevancia histórica y ecológica y el papel del bosque nativo como regulador de ecosistemas, temperatura y humedad. La jornada cerró con la presentación de Yanina Palavicino y Gustavo Toledo sobre cambio climático, educación ambiental, reciclaje y prácticas sustentables.'
    ],
    foto: 'nota-01.jpg',
    alt: 'Jornada de capacitación en el invernadero del Vivero Municipal de Tomé'
  },

  {
    fecha: '2025-09-10',
    lugar: 'Barrio Explanada',
    titulo: 'Sesión en El Vagón: patrimonio industrial e inmaterial en el Barrio Explanada',
    resumen: 'La Red se reunió en la sede del Círculo de Bellas Artes para trabajar la memoria de la desaparecida Estación de Ferrocarriles. Su presidente, Mario Sanhueza, y la secretaria Margot Quilaqueo abrieron la sede a los estudiantes de la comuna.',
    cuerpo: [
      'Docentes de establecimientos de enseñanza básica y media de la comuna participaron de la reunión mensual de la Red, fortaleciendo el ecosistema comunal de educación patrimonial: la relación permanente con los distintos agentes que trabajan objetivos patrimoniales y ambientales en el territorio.',
      'El encuentro se realizó en el renovado Vagón del Círculo de Bellas Artes, ubicado en el Barrio Explanada. Durante la jornada se abordaron temas de patrimonio industrial, a propósito del propio Vagón y del sector cercano a la desaparecida Estación de Ferrocarriles de Tomé.',
      'También se trataron temas de patrimonio inmaterial, considerando que el Círculo de Bellas Artes ha sido un actor fundamental en el desarrollo y promoción de las artes en la comuna. La Red fue recibida por su presidente, el pintor Mario Sanhueza, y por la secretaria Margot Quilaqueo, quienes señalaron que la sede queda abierta para las y los estudiantes de Tomé.'
    ],
    foto: 'nota-02.jpg',
    alt: 'Fotografía grupal de los docentes de la Red frente al vagón del Círculo de Bellas Artes'
  },

  {
    fecha: '2025-07-09',
    lugar: 'Liceo República del Ecuador',
    titulo: 'Balance del Mes de los Patrimonios y revisión de guías en el Liceo República del Ecuador',
    resumen: 'La sesión repasó las acciones del Mes de los Patrimonios —rutas urbanas, concurso de relatos, exposiciones museales y el Hito Comunal— y revisó las guías sobre Guanehue, la ruta Muelle Hinrichsen–Vagón, el Queule y los fanzines.',
    cuerpo: [
      'La Red realizó su reunión mensual para fortalecer la educación patrimonial y ambiental que se implementa en escuelas y liceos de la comuna, a través de la asignatura de Patrimonio y Medio Ambiente y de los talleres de esas áreas. El encuentro se desarrolló en el Liceo República del Ecuador, con la participación de docentes de los establecimientos y de la Coordinación de Patrimonio y Medio Ambiente del Departamento Técnico Pedagógico.',
      'Durante la jornada se presentaron las acciones realizadas por los establecimientos en la celebración del Día y el Mes de los Patrimonios: charlas temáticas de expertos, concurso de relatos, valoración de objetos escolares, rutas urbanas, visitas a monumentos históricos nacionales, exposiciones de temáticas museales y un Hito Comunal de Educación Patrimonial.',
      'Se abordaron además los aspectos centrales de las políticas de educación patrimonial y ambiental, y se revisaron las guías de enseñanza-aprendizaje sobre patrimonio material, inmaterial e industrial de Tomé, Guanehue y los antiguos habitantes, la ruta patrimonial escolar Muelle Hinrichsen–Vagón, el Queule y los fanzines.'
    ],
    foto: 'nota-03.jpg',
    alt: 'Publicación patrimonial sobre el poeta tomecino Alfonso Mora, material de trabajo de la Red'
  }

];


/* ==========================================================================
   A partir de aquí no es necesario editar nada: la página se arma sola.
   ========================================================================== */
(function () {
  'use strict';

  var contenedor = document.getElementById('rejaNoticias');
  if (!contenedor) return;

  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
               'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  // Ordena de la más nueva a la más antigua
  var lista = NOTICIAS.slice().sort(function (a, b) {
    return (b.fecha || '').localeCompare(a.fecha || '');
  });

  function fechaCorta(iso) {
    var p = String(iso).split('-');
    if (p.length !== 3) return iso;
    return p[2] + '.' + p[1] + '.' + p[0];
  }

  function tarjeta(noticia, indice) {
    var destacada = indice === 0 ? ' nota--destacada' : '';
    var idPanel = 'nota-completa-' + indice;

    var html = '<article class="nota' + destacada + '">';

    html += '<div class="marco marco--bajo">' +
              '<img src="img/' + noticia.foto + '" alt="' + (noticia.alt || '') + '" loading="lazy">' +
            '</div>';

    html += '<p class="nota__meta">' +
              '<time datetime="' + noticia.fecha + '">' + fechaCorta(noticia.fecha) + '</time>' +
              (noticia.lugar ? '<span class="nota__categoria">' + noticia.lugar + '</span>' : '') +
            '</p>';

    html += '<h3 class="nota__titulo">' + noticia.titulo + '</h3>';

    if (noticia.resumen) {
      html += '<p class="nota__extracto">' + noticia.resumen + '</p>';
    }

    var cuerpo = noticia.cuerpo || [];
    if (cuerpo.length) {
      html += '<button class="nota__enlace" type="button" aria-expanded="false" aria-controls="' + idPanel + '">' +
                'Leer la nota completa' +
              '</button>';
      html += '<div class="nota__completa" id="' + idPanel + '" hidden>';
      cuerpo.forEach(function (parrafo) { html += '<p>' + parrafo + '</p>'; });
      html += '</div>';
    }

    html += '</article>';
    return html;
  }

  contenedor.innerHTML = lista.map(tarjeta).join('');

})();
