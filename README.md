# XXI FITU 2026 · Sitio de programación

Sitio estático (HTML, CSS y JS, sin dependencias ni compilación) con la programación del
XXI Festival Internacional de Teatro Universitario y el VI Coloquio Internacional de
Investigación Creación en Artes Escénicas (Universidad de Caldas, 27 al 30 de octubre de 2026).

## Publicar en Vercel (plan gratuito)

**Opción 1 · desde GitHub (sin terminal)**
1. En GitHub, crea un repositorio nuevo (por ejemplo `fitu-2026`).
2. "Add file → Upload files" y arrastra el contenido de esta carpeta (no la carpeta misma).
   GitHub admite 100 archivos por carga: si te lo pide, sube primero todo menos la carpeta `cal/`
   y luego `cal/` en una segunda carga.
3. En vercel.com → "Add New… → Project" → importa el repositorio → "Deploy".
   No hay que configurar nada: Framework Preset "Other", sin comando de build.

**Opción 2 · con la terminal**
```
npx vercel --prod
```
desde esta carpeta.

## Después de publicar
- Cambia `SITE_URL` (en las etiquetas `og:image` de cada página) si el dominio final no es
  `fitu-2026.vercel.app`; es solo la imagen que aparece al compartir el enlace.
- `vercel.json` activa URLs limpias (`/dia-28` en vez de `/dia-28.html`).

## Estructura
- `index.html` inicio · `programacion.html` la semana · `dia-27…30.html` por día
- `escenarios.html` · `obras.html` + `obra-*.html` · `coloquio.html` + `coloquio-*.html`
- `sedes.html` · `creditos.html`
- `cal/*.ics` y `programa-fitu-2026.ics`: eventos para añadir al calendario.
