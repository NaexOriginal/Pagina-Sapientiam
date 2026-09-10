## Qué aprendiste

- Esto fue un ataque de **fuerza bruta**: la misma IP probó un usuario y una contraseña tras otra (`root`, `admin`, `test`...) hasta que una funcionó.
- La señal clave en un log es el **patrón**: muchos `Failed password` seguidos de un `Accepted password` desde la misma IP. Una persona real se equivoca una o dos veces, no catorce.

## Cómo se defiende

- **fail2ban** (o similar): bloquea automáticamente las IPs con muchos intentos fallidos.
- **Llaves SSH en vez de contraseñas**: `PasswordAuthentication no` en `/etc/ssh/sshd_config`.
- **Sin login directo de root**: `PermitRootLogin no`.
- Revisar los logs con regularidad (o centralizarlos en un SIEM) para detectarlo a tiempo.
