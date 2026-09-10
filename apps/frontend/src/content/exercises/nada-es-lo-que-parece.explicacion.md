## Qué aprendiste

- El navegador recibe **mucho más** de lo que muestra: elementos ocultos, atributos, comentarios y scripts. Con **DevTools** (F12 o clic derecho → *Inspeccionar*) todo eso queda a la vista.
- En una SPA como esta, *Ver código fuente* (Ctrl+U) solo muestra el `index.html` inicial, casi vacío. El contenido real lo construye JavaScript, por eso hay que inspeccionar el **DOM** ya renderizado.

## Cómo se defiende

**Nunca pongas secretos en el frontend**: claves de API, contraseñas, flags o reglas de permisos. Todo lo que llega al navegador lo puede leer el usuario. Los secretos se quedan en el servidor.
