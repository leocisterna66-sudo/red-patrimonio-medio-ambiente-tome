# Red de Patrimonio y Medio Ambiente — Tomé

Sitio web institucional de la Red de Patrimonio y Medio Ambiente,
dependiente de la Dirección de Educación de la Ilustre Municipalidad de Tomé.

## Estructura de archivos

```
/
├── index.html            Página completa (una sola página con anclas)
├── agregar-noticia.html  Asistente interno: pestañas "Nueva noticia" y "Nueva actividad"
├── SUBIR-CAMBIOS.bat     Publica los cambios a internet con doble clic
├── css/estilos.css       Hoja de estilos única
├── js/main.js            Navegación, filtros, notas desplegables, formulario
├── js/noticias.js        Lista de noticias de "Red en Acción"
├── js/agenda.js          Lista de actividades de "La Agenda"
├── js/mapa.js            Mapa de la comuna y sus 25 puntos
└── img/                  Imágenes del sitio (ver más abajo)
    └── originales/       Fotografías sin recortar, por si se necesita otro encuadre
```

## El carrusel de portada

La portada es un carrusel de tres diapositivas a pantalla completa, con la
fotografía de fondo y el texto superpuesto. Avanza solo cada 7 segundos y se
detiene al pasar el cursor, al navegar con el teclado o si el sistema pide
reducir el movimiento. Funciona con flechas, con los puntos inferiores, con las
teclas de dirección y con deslizamiento táctil en celular.

Para agregar o cambiar una diapositiva, duplicar un bloque
`<article class="diapo">` en `index.html`: el carrusel se adapta solo a la
cantidad que haya y genera los puntos automáticamente. Las imágenes de fondo son
`img/portada-01.jpg` a `portada-03.jpg`, en proporción 16:9.

> `portada-02.jpg` mide 809 px de ancho, contra los 1536 de las otras dos: es el
> máximo que entregaba Facebook para el álbum del Vivero. En pantallas grandes
> se ve algo más blanda. Si consigues el original de esa fotografía, reemplázala
> manteniendo la proporción 16:9.

## El mapa de la comuna

La sección Mapa usa **Leaflet sobre OpenStreetMap**. Los 25 puntos están en el
arreglo `PUNTOS`, al comienzo de `js/mapa.js`, con instrucciones de edición en
el propio archivo. Cada punto lleva categoría, nombre, descripción, coordenadas
y un campo `verificado`.

Veinte coordenadas provienen de OpenStreetMap. **Cinco son aproximadas** y
aparecen marcadas como tales en su ficha: el Vagón, la ex Estación de
Ferrocarriles, el Muelle Hinrichsen, el Vivero Municipal y la caleta de
Cocholgüe. Conviene corregirlas: se obtiene la coordenada exacta haciendo clic
derecho sobre el lugar en Google Maps y copiando el par de números.

> El mapa requiere conexión a internet: carga la librería Leaflet y las
> imágenes del mapa desde servidores externos. El resto del sitio funciona sin
> conexión.

Para ver el sitio basta con abrir `index.html` en cualquier navegador. No
requiere servidor ni instalación.

## El logo

El logo lo aportó la coordinación. En el sitio se usa así:

- `logo.png` — logo completo original (ilustración + nombre), con fondo color
  papel. **Sirve para documentos, oficios, presentaciones y redes sociales.**
- `img/logo-emblema.png` — solo la ilustración, **con fondo transparente**
  (recortado del original). Es lo que aparece en el encabezado del sitio, junto
  al nombre escrito.
- `img/insignia.png` — versión cuadrada de la ilustración, para el ícono del
  navegador (favicon).

En el encabezado se muestra el emblema **más** el nombre escrito, porque la
ilustración por sí sola no se lee a tamaño pequeño y el texto ayuda a la
legibilidad y a los buscadores. El pie de página queda solo con el nombre
escrito: el fondo verde oscuro del pie ocultaría el trazado del emblema.

Si quieres cambiar el logo en el futuro, reemplaza `img/logo-emblema.png`
(fondo transparente) e `img/insignia.png` manteniendo esos nombres.

## Decisiones de diseño

| Aspecto | Definición |
|---|---|
| Color primario | Verde bosque profundo `#1E3F32` — eje medio ambiente |
| Color de acento | Terracota `#A2542F` — patrimonio industrial, ladrillo, archivo |
| Acento activo | Verde vivo `#2E9E68` — enlaces, marcadores del mapa, estados |
| Fondo | Papel `#F6F3EC`, alternado con blanco puro en algunas secciones |
| Tipografía display | EB Garamond, serif de tradición editorial |
| Tipografía de cuerpo | Source Sans 3 |
| Tipografía de interfaz | Barlow Condensed, en versalitas con espaciado amplio |

El sitio es responsivo con enfoque *mobile-first*. Puntos de quiebre en
768px (tablet), 1024px (escritorio) y 1280px (escritorio amplio).

## Pendientes de completar

### 1. Docentes representantes
Los once establecimientos están cargados con datos reales, tomados del registro
de participación publicado por el DEM Tomé: ocho escuelas (Menque, Caleta del
Medio, Vegas de Coliumo, Cerro Estanque, Ignacio Serrano Montaner, Cocholgüe,
Millahue y Artística de Panamá) y tres liceos (República del Ecuador, Comercial
y Vicente Palacios).

Lo que falta es el **nombre del docente representante** de cada uno: todos dicen
"Por confirmar". Están en `index.html`, sección `<section id="establecimientos">`.

Para agregar un establecimiento nuevo, duplicar un bloque
`<article class="ficha">` y ajustar:

- El número correlativo (`ficha__numero`)
- El nombre (`ficha__nombre`)
- El atributo `data-sector`: `basica` o `media` (es lo que usa el filtro)

### 2. Imágenes
**Ya están las doce fotografías del sitio**, extraídas del Facebook institucional
del DEM Tomé y recortadas a las proporciones de cada espacio. Los originales sin
procesar quedaron en `img/originales/` por si se necesita otro recorte.

| Archivo | Uso | Origen |
|---|---|---|
| `portada.jpg` | Portada, vertical 4:5 | Vivero Municipal, mayo 2026 |
| `eje-patrimonio.jpg` | Eje patrimonio, 16:10 | Exterior del vagón, septiembre 2025 |
| `eje-ambiente.jpg` | Eje medio ambiente, 16:10 | Invernadero del Vivero, mayo 2026 |
| `nota-01.jpg` | Novedad de mayo, 16:9 | Vivero Municipal |
| `nota-02.jpg` | Novedad de septiembre, 16:9 | Grupal frente al vagón |
| `nota-03.jpg` | Novedad de julio, 16:9 | Material patrimonial (ver nota abajo) |
| `registro-01` a `-06` | Registro fotográfico, 1:1 | Ambas sesiones |

> **Sobre `nota-03.jpg`**: no existe registro fotográfico publicado de la sesión
> de julio en el Liceo República del Ecuador. La imagen usada es un material
> patrimonial de la Red (publicación sobre el poeta tomecino Alfonso Mora), que
> ilustra el tema de la nota pero **no fue tomada en esa sesión**. Reemplazar si
> aparece una fotografía propia de esa jornada.

Falta únicamente `insignia.png`, el ícono del navegador: cuadrado, 64 × 64 px.

Para cambiar cualquier fotografía, reemplazar el archivo en `img/` manteniendo el
nombre y una proporción similar. Las clases de proporción son:

- `marco--alto` (4:5, retrato — portada)
- `marco--medio` (16:10 — ejes de trabajo)
- `marco--bajo` (16:9 — notas de novedades)
- `marco--cuadro` (1:1 — registro fotográfico)

### 3. Datos de contacto
Ya están cargados el correo de la coordinación
(`lorenna.patrimonio.tome@gmail.com`), la dirección (Ignacio Serrano 1055,
Tomé), el sitio institucional `demtome.cl` y el Facebook `/educaciontome`.

Falta únicamente en `index.html`:

- **Teléfono de contacto** — en la sección de contacto dice "Ingresar número"
- **Instagram**, si la Red o el DEM tienen cuenta (enlace del pie)

### 4. Formulario de contacto
Al ser un sitio estático, el formulario abre el cliente de correo del usuario
con el mensaje redactado. Si se requiere que los mensajes lleguen directamente
a una bandeja de entrada, las opciones habituales son un servicio de
formularios externo (Formspree, Getform) o un Google Form embebido.

### 5. Documentos y enlaces
En la sección `<section id="recursos">` los enlaces apuntan a `#`. Reemplazar
por las rutas de los archivos PDF (colocarlos en una carpeta `docs/`) o por
las direcciones de los sitios institucionales.

### 6. Red en Acción y La Agenda
La página se organiza en torno a las noticias. Hay dos secciones para eso:

- **Red en Acción** (`<section id="red-en-accion">`) — lo ya realizado. Es la
  primera sección tras la portada. Contiene las noticias, el "Registro de
  sesiones" (línea de tiempo de las jornadas documentadas) y el registro
  fotográfico.

  Las noticias **ya no se escriben en el HTML**: viven en una lista dentro de
  `js/noticias.js` y la página las dibuja sola, ordenadas de la más nueva a la
  más antigua, con la más reciente destacada de forma automática.

  **Dos formas de agregar una noticia:**
  1. *Con el asistente (recomendado):* abrir **`agregar-noticia.html`** en el
     navegador (doble clic), llenar el formulario, pulsar "Copiar el bloque" y
     pegarlo en `js/noticias.js` justo después de `var NOTICIAS = [`. La foto se
     descarga aparte y se guarda en `img/`.
  2. *A mano:* copiar un bloque de ejemplo dentro de `js/noticias.js` y cambiar
     los datos. El propio archivo tiene las instrucciones al comienzo.

  Para sumar una sesión al "Registro de sesiones", duplicar un
  `<li class="hito">` en `index.html`.
- **La Agenda** (`<section id="agenda">`) — lo que viene. Al igual que las
  noticias, **las actividades ya no se escriben en el HTML**: viven en una lista
  dentro de `js/agenda.js` y la página las arma sola, ordenadas por fecha (de la
  más próxima a la más lejana) y **ocultando automáticamente las que ya pasaron**.

  Se agregan con el mismo asistente: abrir **`agregar-noticia.html`** y usar la
  pestaña **"Nueva actividad"**. Cada actividad puede llevar un **afiche o
  invitación** opcional: se guarda la imagen en `img/` y se escribe su nombre en
  el campo correspondiente; en la tarjeta aparece como miniatura que, al pulsarla,
  abre el afiche completo. Si no hay afiche, se deja ese campo vacío.

  A mano también se puede: copiar un bloque de ejemplo dentro de `js/agenda.js`
  (el archivo tiene las instrucciones al comienzo).

## Publicar los cambios (subir a internet)

El sitio está publicado en GitHub Pages:
**https://leocisterna66-sudo.github.io/red-patrimonio-medio-ambiente-tome/**

Después de editar cualquier cosa (una noticia, una actividad, una foto, un dato),
para que el cambio se vea en internet basta con **hacer doble clic en el archivo
`SUBIR-CAMBIOS.bat`**, escribir una descripción breve y esperar 30–60 segundos.

## Origen de los contenidos

Los datos de establecimientos, actividades, coordinación y ejes de trabajo
fueron extraídos de las publicaciones públicas de **DEM Tomé** en Facebook
(`facebook.com/educaciontome`), correspondientes a abril y julio de 2025,
septiembre de 2025 y mayo de 2026. Las notas de la sección Red en Acción son
resúmenes redactados a partir de esas publicaciones, no transcripciones.

## Publicación en línea

El sitio es estático, por lo que puede publicarse en cualquier servicio de
alojamiento. Alternativas gratuitas habituales: Netlify, Vercel o GitHub
Pages, arrastrando la carpeta completa. Si se contrata un dominio propio
(por ejemplo `redpatrimoniotome.cl`), se apunta desde el panel del servicio.
