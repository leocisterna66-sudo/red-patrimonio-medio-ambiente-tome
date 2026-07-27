/* ==========================================================================
   RED DE PATRIMONIO Y MEDIO AMBIENTE — TOMÉ
   Comportamiento de la interfaz
   --------------------------------------------------------------------------
   01. Navegación móvil
   02. Estado del encabezado al desplazar
   03. Enlace activo según sección visible
   04. Filtro de establecimientos
   05. Aparición progresiva de secciones
   06. Formulario de contacto
   07. Año del pie de página
   ========================================================================== */

(function () {
  'use strict';

  var reduceMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ----------------------------------------------------------------------
     01. NAVEGACIÓN MÓVIL
     ---------------------------------------------------------------------- */
  var navBoton = document.getElementById('navBoton');
  var navPrincipal = document.getElementById('navPrincipal');

  function cerrarNav() {
    if (!navPrincipal || !navBoton) return;
    navPrincipal.classList.remove('nav--abierto');
    navBoton.setAttribute('aria-expanded', 'false');
    navBoton.setAttribute('aria-label', 'Abrir menú de navegación');
  }

  if (navBoton && navPrincipal) {
    navBoton.addEventListener('click', function () {
      var abierto = navPrincipal.classList.toggle('nav--abierto');
      navBoton.setAttribute('aria-expanded', String(abierto));
      navBoton.setAttribute('aria-label', abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    });

    // Cerrar al elegir una sección
    navPrincipal.addEventListener('click', function (evento) {
      if (evento.target.closest('.nav__enlace')) cerrarNav();
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape') cerrarNav();
    });

    // Cerrar al pasar a disposición de escritorio
    window.matchMedia('(min-width: 1024px)').addEventListener('change', cerrarNav);
  }


  /* ----------------------------------------------------------------------
     01b. CARRUSEL DE PORTADA
     ----------------------------------------------------------------------
     Avanza solo cada 7 segundos. Se detiene al pasar el cursor, al enfocar
     con el teclado y si el sistema pide reducir el movimiento.
     ---------------------------------------------------------------------- */
  var carrusel = document.getElementById('carrusel');

  if (carrusel) {
    var diapos = Array.prototype.slice.call(carrusel.querySelectorAll('.diapo'));
    var contenedorPuntos = document.getElementById('carruselPuntos');
    var actual = 0;
    var temporizador = null;
    var INTERVALO = 7000;

    var puntos = diapos.map(function (diapo, indice) {
      var punto = document.createElement('button');
      punto.type = 'button';
      punto.className = 'carrusel__punto' + (indice === 0 ? ' carrusel__punto--activo' : '');
      punto.setAttribute('aria-label', 'Ir a la diapositiva ' + (indice + 1));
      punto.addEventListener('click', function () { mostrar(indice); reiniciar(); });
      contenedorPuntos.appendChild(punto);
      return punto;
    });

    function mostrar(indice) {
      actual = (indice + diapos.length) % diapos.length;
      diapos.forEach(function (diapo, i) {
        diapo.classList.toggle('diapo--activa', i === actual);
        diapo.setAttribute('aria-hidden', String(i !== actual));
      });
      puntos.forEach(function (punto, i) {
        punto.classList.toggle('carrusel__punto--activo', i === actual);
      });
    }

    function avanzar() { mostrar(actual + 1); }

    function arrancar() {
      if (reduceMovimiento || diapos.length < 2) return;
      temporizador = window.setInterval(avanzar, INTERVALO);
    }
    function detener() { window.clearInterval(temporizador); }
    function reiniciar() { detener(); arrancar(); }

    document.getElementById('carruselPrevio').addEventListener('click', function () {
      mostrar(actual - 1); reiniciar();
    });
    document.getElementById('carruselSiguiente').addEventListener('click', function () {
      mostrar(actual + 1); reiniciar();
    });

    carrusel.addEventListener('mouseenter', detener);
    carrusel.addEventListener('mouseleave', arrancar);
    carrusel.addEventListener('focusin', detener);
    carrusel.addEventListener('focusout', arrancar);

    // Flechas del teclado cuando el carrusel tiene el foco
    carrusel.addEventListener('keydown', function (evento) {
      if (evento.key === 'ArrowLeft')  { mostrar(actual - 1); reiniciar(); }
      if (evento.key === 'ArrowRight') { mostrar(actual + 1); reiniciar(); }
    });

    // Desplazamiento táctil
    var inicioX = null;
    carrusel.addEventListener('touchstart', function (e) { inicioX = e.touches[0].clientX; }, { passive: true });
    carrusel.addEventListener('touchend', function (e) {
      if (inicioX === null) return;
      var recorrido = e.changedTouches[0].clientX - inicioX;
      if (Math.abs(recorrido) > 45) { mostrar(actual + (recorrido < 0 ? 1 : -1)); reiniciar(); }
      inicioX = null;
    });

    mostrar(0);
    arrancar();
  }


  /* ----------------------------------------------------------------------
     02. ESTADO DEL ENCABEZADO AL DESPLAZAR
     ---------------------------------------------------------------------- */
  var encabezado = document.getElementById('encabezado');

  if (encabezado) {
    var actualizarEncabezado = function () {
      encabezado.classList.toggle('encabezado--fijo', window.scrollY > 24);
    };
    actualizarEncabezado();
    window.addEventListener('scroll', actualizarEncabezado, { passive: true });
  }


  /* ----------------------------------------------------------------------
     03. ENLACE ACTIVO SEGÚN SECCIÓN VISIBLE
     ---------------------------------------------------------------------- */
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('.nav__enlace'));
  var secciones = enlaces
    .map(function (enlace) { return document.querySelector(enlace.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && secciones.length) {
    var observadorSecciones = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        enlaces.forEach(function (enlace) {
          enlace.classList.toggle(
            'nav__enlace--activo',
            enlace.getAttribute('href') === '#' + entrada.target.id
          );
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    secciones.forEach(function (seccion) { observadorSecciones.observe(seccion); });
  }


  /* ----------------------------------------------------------------------
     04. FILTRO DE ESTABLECIMIENTOS
     ---------------------------------------------------------------------- */
  var botonesFiltro = Array.prototype.slice.call(document.querySelectorAll('#establecimientos .filtro'));
  var fichas = Array.prototype.slice.call(document.querySelectorAll('#rejaFichas .ficha'));

  if (botonesFiltro.length && fichas.length) {
    botonesFiltro.forEach(function (boton) {
      boton.addEventListener('click', function () {
        var sector = boton.getAttribute('data-sector');

        botonesFiltro.forEach(function (otro) {
          otro.classList.toggle('filtro--activo', otro === boton);
        });

        fichas.forEach(function (ficha) {
          var coincide = sector === 'todos' || ficha.getAttribute('data-sector') === sector;
          ficha.hidden = !coincide;
        });
      });
    });
  }


  /* ----------------------------------------------------------------------
     04b. DESPLIEGUE DEL TEXTO COMPLETO DE LAS NOTAS
     ----------------------------------------------------------------------
     Las notas no tienen página propia: el texto completo se despliega en la
     misma tarjeta. Se usa <button> y no <a href="#"> porque un ancla vacía
     devuelve al inicio de la página al pulsarla.
     ---------------------------------------------------------------------- */
  Array.prototype.slice.call(document.querySelectorAll('.nota__enlace')).forEach(function (boton) {
    var panel = document.getElementById(boton.getAttribute('aria-controls'));
    if (!panel) return;

    boton.addEventListener('click', function () {
      var abierto = boton.getAttribute('aria-expanded') === 'true';
      boton.setAttribute('aria-expanded', String(!abierto));
      panel.hidden = abierto;
    });
  });


  /* ----------------------------------------------------------------------
     05. APARICIÓN PROGRESIVA DE SECCIONES
     ---------------------------------------------------------------------- */
  if (!reduceMovimiento && 'IntersectionObserver' in window) {
    var elementos = Array.prototype.slice.call(
      document.querySelectorAll('.seccion__encabezado, .reja-articulo, .bloque-objetivos, .diptico, .ficha, .hitos-bloque, .agenda__item, .nota, .registro, .grupo-recursos, .reja-contacto')
    );

    elementos.forEach(function (elemento) { elemento.classList.add('revelar'); });

    var observadorRevelar = new IntersectionObserver(function (entradas, observador) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('revelar--visible');
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    elementos.forEach(function (elemento) { observadorRevelar.observe(elemento); });
  }


  /* ----------------------------------------------------------------------
     06. FORMULARIO DE CONTACTO
     ----------------------------------------------------------------------
     El sitio es estático: no existe servidor que procese el envío. El
     formulario compone un correo electrónico con los datos ingresados y lo
     abre en el cliente de correo del usuario.

     Para recibir los mensajes directamente en una bandeja de entrada sin
     abrir el cliente de correo, reemplazar el valor de DESTINO por el
     correo institucional definitivo y considerar un servicio de formularios
     (por ejemplo Formspree o Google Forms) apuntando el atributo "action".
     ---------------------------------------------------------------------- */
  var DESTINO = 'lorenna.patrimonio.tome@gmail.com';

  var formulario = document.getElementById('formulario');
  var aviso = document.getElementById('formularioAviso');

  if (formulario && aviso) {
    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();

      var obligatorios = ['nombre', 'correo', 'motivo', 'mensaje'];
      var incompleto = false;

      obligatorios.forEach(function (nombre) {
        var campo = formulario.elements[nombre];
        var vacio = !campo.value.trim();
        campo.setAttribute('aria-invalid', String(vacio));
        if (vacio && !incompleto) { incompleto = true; campo.focus(); }
      });

      if (incompleto) {
        aviso.textContent = 'Complete los campos obligatorios antes de enviar el mensaje.';
        return;
      }

      var correo = formulario.elements.correo.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        formulario.elements.correo.setAttribute('aria-invalid', 'true');
        formulario.elements.correo.focus();
        aviso.textContent = 'Revise el formato del correo electrónico ingresado.';
        return;
      }

      var asunto = 'Red de Patrimonio y Medio Ambiente: ' + formulario.elements.motivo.value;
      var cuerpo = [
        'Nombre: ' + formulario.elements.nombre.value.trim(),
        'Correo electrónico: ' + correo,
        'Establecimiento: ' + (formulario.elements.establecimiento.value.trim() || 'No indicado'),
        'Motivo: ' + formulario.elements.motivo.value,
        '',
        'Mensaje:',
        formulario.elements.mensaje.value.trim()
      ].join('\n');

      window.location.href = 'mailto:' + DESTINO +
        '?subject=' + encodeURIComponent(asunto) +
        '&body=' + encodeURIComponent(cuerpo);

      aviso.textContent = 'Se abrirá su cliente de correo con el mensaje redactado. Si no ocurre, escriba directamente a ' + DESTINO + '.';
    });
  }


  /* ----------------------------------------------------------------------
     07. AÑO DEL PIE DE PÁGINA
     ---------------------------------------------------------------------- */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());

})();
