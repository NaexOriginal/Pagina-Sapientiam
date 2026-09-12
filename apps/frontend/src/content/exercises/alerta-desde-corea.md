Eres analista N1 en el SOC de una empresa de servicios. A las 14:04 el SIEM levantó una alerta: una conexión HTTPS desde el exterior hacia un servidor de la DMZ, **aceptada por el firewall** y abierta durante horas.

En el chat del turno, un compañero ya escribió: *"¡Nos está atacando Corea del Norte! Hay que escalar ya."*

Antes de escalar, analiza el log del firewall (FortiGate) y verifica la IP de origen con herramientas públicas: un whois/RDAP (por ejemplo, `rdap.arin.net`) o VirusTotal.

Responde con dos hallazgos en este formato: `SAPIENTIAM{pais_dueño}`

- **pais:** código ISO 3166-1 de dos letras del país de origen, en minúsculas.
- **dueño:** la empresa que tiene registrada la IP de origen según whois/RDAP, en una sola palabra y en minúsculas.

Ejemplo del formato (no es la respuesta): `SAPIENTIAM{co_empresa}`.
