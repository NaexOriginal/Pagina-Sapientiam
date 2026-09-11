## Qué aprendiste

- El navegador registra cada petición que hace una página. En **DevTools → Network** (F12) ves la URL, las cabeceras y la **respuesta completa** de cada una, aunque la página no muestre nada en pantalla.
- El `token` de la sesión es un **JWT**: tres partes en Base64URL separadas por puntos (`encabezado.payload.firma`). La firma evita que alguien lo **modifique**, pero **no oculta** nada: cualquiera puede decodificar el payload y leerlo.

## Cómo se defiende

- **No pongas secretos en un JWT** ni en las respuestas de una API: envía solo lo mínimo que el cliente necesita (un identificador y sus permisos). Un campo de depuración olvidado es una fuga de datos.
- Revisa qué devuelve cada endpoint: devolver datos de más es un riesgo frecuente (*exposición excesiva de datos*, OWASP API Security Top 10).
- Si el contenido de un token tiene que ser confidencial, se **cifra** (JWE); firmarlo no basta.
