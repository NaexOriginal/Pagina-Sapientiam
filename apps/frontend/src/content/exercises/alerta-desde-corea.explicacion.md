## Qué aprendiste

- **Leer despacio evita falsas alarmas.** `srccountry="Korea, Republic of"` es **Corea del Sur** (`kr`). Corea del Norte aparece como *"Korea, Democratic People's Republic of"* (`kp`). Una palabra mal leída casi escala un incidente internacional.
- **Geolocalizar no es atribuir.** La IP `4.230.8.104` está registrada a **Microsoft** (whois/RDAP), y el propio log lo sugiere: `srcinetsvc="Microsoft-Web"` y `srcregion="koreacentral"`, una región de **Azure**. Cualquier persona, desde cualquier país, puede alquilar una máquina en esa región.
- **La reputación no es inocencia.** `srcreputation=5` es el nivel más alto de FortiGuard ("sitios conocidos y verificados"): el firewall reconoce el rango de Microsoft, no a quien lo está usando.

## Lo que sí merece una segunda mirada

- `action="accept"`: la política `587` permitió la conexión.
- **La IP pública no es el servidor.** `dstip` es la IP pública a la que llegó el paquete; con `trandisp="dnat"` el firewall la tradujo a `tranip=10.20.5.17`, el servidor interno que realmente atendió la conexión. Ese es el equipo que hay que revisar.
- `duration=60211`: la sesión duró cerca de **16,7 horas**, con tráfico casi simétrico (unos 200 KB y 4907 paquetes en cada sentido). Puede ser un monitoreo o una conexión persistente legítima… o un canal que alguien mantiene abierto.
- `appcat="unscanned"`: el HTTPS no se inspeccionó, así que el firewall no sabe qué viajó dentro.

## Cómo sigue un SOC

- Revisar los logs web de `10.20.5.17` a esa hora: qué rutas pidió la IP y qué respondió el servidor.
- Preguntar a infraestructura si hay un proveedor o un monitoreo legítimo en Azure (por ejemplo, un servicio de disponibilidad o una integración).
- Consultar la IP en fuentes de inteligencia (VirusTotal, AbuseIPDB) sin tomar un solo veredicto como verdad.
- Con esa evidencia, decidir: cerrar como falso positivo, o escalar con datos y no con suposiciones.
