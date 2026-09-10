## Qué aprendiste

- **Base64 no es cifrado.** Es una *codificación*: convierte bytes en texto imprimible y cualquiera la revierte sin clave. Se reconoce por su alfabeto (`A-Z`, `a-z`, `0-9`, `+`, `/`) y por el relleno `=` al final.
- **César tampoco protege.** Solo hay 25 desplazamientos posibles: se rompe probándolos todos en segundos (fuerza bruta).

## Cómo se defiende

Para proteger información de verdad se usan algoritmos modernos como **AES** o **ChaCha20**, con claves largas y aleatorias. Si alguien te dice que sus datos están "cifrados en Base64", ya sabes que no lo están.
