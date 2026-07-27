/* ==========================================================================
   ESTABLECIMIENTOS DE LA RED
   Red de Patrimonio y Medio Ambiente — Dirección de Educación de Tomé
   --------------------------------------------------------------------------
   Aquí van TODOS los establecimientos municipales (dependientes del DEM) de la
   comuna de Tomé. La página arma las tarjetas solas a partir de esta lista.

   CÓMO EDITAR UN ESTABLECIMIENTO

     - Para poner la INSIGNIA: guarda el logo del establecimiento en la carpeta
       img/insignias/ (créala si no existe) con un nombre corto sin espacios, y
       escribe ese nombre en el campo "insignia". Si se deja vacío, la tarjeta
       muestra las iniciales del establecimiento.

     - Para el DOCENTE o DOCENTES representantes: escribe el o los nombres en la
       lista "docentes". Pueden ser varios, separados por coma dentro de los
       corchetes: docentes: ['Nombre Uno', 'Nombre Dos'].

     - Para la RESEÑA o los PROYECTOS: escribe el texto en "resena". Aparece un
       botón "Ver reseña" que lo despliega. Si se deja vacío, no aparece.

     - Para agregar un establecimiento nuevo: copia un bloque completo { ... },
       y cámbialo.

   Campos de cada establecimiento:
     nombre     Nombre del establecimiento.
     tipo       'basica' o 'media'  (es lo que usa el filtro Escuelas / Liceos).
     nivel      Texto que se muestra (ej. 'Enseñanza básica', 'Enseñanza media
                · Técnico profesional').
     insignia   Nombre del archivo del logo en img/insignias/ . '' = iniciales.
     docentes   Lista de nombres. ['Por confirmar'] mientras no se sepa.
     resena     Texto opcional con reseña o proyectos del establecimiento.
     sitio      (Opcional) Dirección web del establecimiento. '' si no tiene.
   ========================================================================== */

var ESTABLECIMIENTOS = [

  { nombre: 'Escuela Menque',                 tipo: 'basica', nivel: 'Enseñanza básica',
    insignia: '', docentes: ['Por confirmar'], resena: '', sitio: '' },

  { nombre: 'Escuela Caleta del Medio',       tipo: 'basica', nivel: 'Enseñanza básica',
    insignia: '', docentes: ['Por confirmar'], resena: '', sitio: '' },

  { nombre: 'Escuela Vegas de Coliumo',       tipo: 'basica', nivel: 'Enseñanza básica',
    insignia: '', docentes: ['Por confirmar'], resena: '', sitio: '' },

  { nombre: 'Escuela Cerro Estanque',         tipo: 'basica', nivel: 'Enseñanza básica',
    insignia: '', docentes: ['Por confirmar'], resena: '', sitio: '' },

  { nombre: 'Escuela Ignacio Serrano Montaner', tipo: 'basica', nivel: 'Enseñanza básica',
    insignia: '', docentes: ['Por confirmar'], resena: '', sitio: '' },

  { nombre: 'Escuela Cocholgüe',              tipo: 'basica', nivel: 'Enseñanza básica',
    insignia: '', docentes: ['Por confirmar'], resena: '', sitio: '' },

  { nombre: 'Escuela Millahue',               tipo: 'basica', nivel: 'Enseñanza básica',
    insignia: '', docentes: ['Por confirmar'], resena: '', sitio: '' },

  { nombre: 'Escuela Artística de Panamá',    tipo: 'basica', nivel: 'Enseñanza básica · Modalidad artística',
    insignia: '', docentes: ['Por confirmar'], resena: '', sitio: '' },

  { nombre: 'Escuela Patrimonial California',  tipo: 'basica', nivel: 'Enseñanza básica',
    insignia: '', docentes: ['Por confirmar'], resena: '', sitio: 'https://www.escuelapatrimonialcalifornia.cl' },

  { nombre: 'Centro de Educación Bicentenario Altos de Frutillares', tipo: 'basica', nivel: 'Establecimiento municipal',
    insignia: '', docentes: ['Por confirmar'], resena: '', sitio: '' },

  { nombre: 'Liceo República del Ecuador',    tipo: 'media',  nivel: 'Enseñanza media',
    insignia: '', docentes: ['Por confirmar'], resena: '', sitio: '' },

  { nombre: 'Liceo Comercial',                tipo: 'media',  nivel: 'Enseñanza media · Técnico profesional',
    insignia: '', docentes: ['Por confirmar'], resena: '', sitio: '' },

  { nombre: 'Liceo Vicente Palacios',         tipo: 'media',  nivel: 'Enseñanza media',
    insignia: '', docentes: ['Por confirmar'], resena: '', sitio: '' }

];


/* ==========================================================================
   A partir de aquí no es necesario editar nada.
   ========================================================================== */
(function () {
  'use strict';

  var contenedor = document.getElementById('rejaFichas');
  if (!contenedor) return;

  function esc(t) { return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function iniciales(nombre) {
    var limpio = nombre.replace(/^(Escuela|Liceo|Colegio|Centro de Educación|Centro Educacional|Centro)\s+/i, '');
    var sig = limpio.split(/\s+/).filter(function (w) { return !/^(de|del|la|el|los|las|y|en)$/i.test(w); });
    var ini = sig.slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
    return ini || nombre.charAt(0).toUpperCase();
  }

  contenedor.innerHTML = ESTABLECIMIENTOS.map(function (e, i) {
    var insignia = e.insignia
      ? '<span class="ficha__insignia"><img src="img/insignias/' + esc(e.insignia) + '" alt="Insignia de ' + esc(e.nombre) + '"></span>'
      : '<span class="ficha__insignia"><span class="ficha__iniciales" aria-hidden="true">' + esc(iniciales(e.nombre)) + '</span></span>';

    var docentes = (e.docentes && e.docentes.length) ? e.docentes.join(', ') : 'Por confirmar';
    var rotulo = (e.docentes && e.docentes.length > 1) ? 'Docentes representantes' : 'Docente representante';

    var html = '<article class="ficha" data-sector="' + esc(e.tipo) + '">' +
                 insignia +
                 '<h3 class="ficha__nombre">' + esc(e.nombre) + '</h3>' +
                 '<dl class="ficha__datos">' +
                   '<dt>Nivel</dt><dd>' + esc(e.nivel) + '</dd>' +
                   '<dt>' + rotulo + '</dt><dd>' + esc(docentes) + '</dd>' +
                 '</dl>';

    if (e.resena) {
      var idR = 'resena-' + i;
      html += '<button class="ficha__mas" type="button" aria-expanded="false" aria-controls="' + idR + '">Ver reseña</button>' +
              '<div class="ficha__resena" id="' + idR + '" hidden><p>' + esc(e.resena) + '</p></div>';
    }

    if (e.sitio) {
      html += '<a class="ficha__enlace" href="' + esc(e.sitio) + '" target="_blank" rel="noopener">Sitio del establecimiento <span aria-hidden="true">&#8599;</span></a>';
    }

    html += '</article>';
    return html;
  }).join('');

  // Desplegar / ocultar las reseñas
  Array.prototype.slice.call(contenedor.querySelectorAll('.ficha__mas')).forEach(function (boton) {
    var panel = document.getElementById(boton.getAttribute('aria-controls'));
    if (!panel) return;
    boton.addEventListener('click', function () {
      var abierto = boton.getAttribute('aria-expanded') === 'true';
      boton.setAttribute('aria-expanded', String(!abierto));
      boton.textContent = abierto ? 'Ver reseña' : 'Ocultar reseña';
      panel.hidden = abierto;
    });
  });

})();
