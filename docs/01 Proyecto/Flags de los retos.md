---
tipo: referencia
actualizado: 2026-09-10
responsable: Joseph
---

# Flags de los retos

> [!warning] Esta nota es pública
> El repo `NaexOriginal/Pagina-Sapientiam` es **público**, así que cualquiera que abra esta nota en GitHub ve las respuestas. Se aceptó a propósito ([[DEC-007 Validacion de flags por hash y flags en el vault]]) porque son retos de práctica. Si más adelante hay retos con puntaje, sus flags **no** van aquí.

El código solo guarda el `flagHash` (SHA-256 de la flag exacta). Si cambias una flag, recalcula su hash así:
```bash
printf '%s' 'SAPIENTIAM{...}' | sha256sum
```

| # | Slug | Flag | SHA-256 |
|---|---|---|---|
| 01 | `mensaje-interceptado` | `SAPIENTIAM{codificar_no_es_cifrar}` | `a7322899f4a22b4d0b3c2332f72d66c942b3ce375c879d4bb02a64fbb2ff3ddc` |
| 02 | `nada-es-lo-que-parece` | `SAPIENTIAM{el_payload_se_lee}` | `5521d0a105ff80c180d260a61baf43d2dadc73550ff85b80a2035c650943d416` |
| 03 | `quien-toco-la-puerta` | `SAPIENTIAM{203.0.113.47}` | `f46ff9bcfe8bab345bc4f3e5efb79b17ba3652e5a4af15421390cab68d75d72a` |
| 04 | `alerta-desde-corea` | `SAPIENTIAM{kr_microsoft}` | `b900a79e8dc06454691baaf65f5f9facac00cadfbc5239ee27d53fdff87a56cc` |

## Cadenas de cada reto
- **01:**
  - Texto que ve el estudiante: `VkRTTEhRV0xEUHtmcmdsaWxmZHVfcXJfaHZfZmxpdWR1fQ==`
  - Al decodificar el Base64 queda `VDSLHQWLDP{frglilfdu_qr_hv_fliudu}`, y al aplicar César −3 sale la flag.
- **02:** la flag va en el campo `debug` del payload del JWT que devuelve `apps/frontend/public/api/v1/sesion.json` (firma HS256 con la clave de laboratorio `sapientiam-lab-2026`). Si cambias la flag, regenera el token y su hash. Hasta el 2026-09-10 la flag era `SAPIENTIAM{inspecciona_el_dom}` y estaba en el DOM.
- **03:** la IP atacante es `203.0.113.47`, dentro de `quien-toco-la-puerta.auth.log`.
- **04:** dos hallazgos del log `alerta-desde-corea.fortigate.log`: país `kr` (`srccountry="Korea, Republic of"`, Corea del Sur) y dueño `microsoft` (RDAP de ARIN para `4.230.8.104`: Microsoft Corporation, Azure `koreacentral`). La IP interna `10.20.5.17` (`tranip`, por `trandisp="dnat"`) no entra en la flag; se analiza en la explicación. La IP de origen es real; todo lo del destino es inventado (IP de documentación, serial `FG10E0TB00000000`, UUIDs, MAC).

Diseño completo: [[2026-09-10 Diseno pagina ejercicios]]
