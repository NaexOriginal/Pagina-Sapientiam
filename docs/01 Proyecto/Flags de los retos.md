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
| 02 | `nada-es-lo-que-parece` | `SAPIENTIAM{inspecciona_el_dom}` | `e0fa55158156b5e99a60c26578fb58063f32326a29fab58abb86f139e924db32` |
| 03 | `quien-toco-la-puerta` | `SAPIENTIAM{203.0.113.47}` | `f46ff9bcfe8bab345bc4f3e5efb79b17ba3652e5a4af15421390cab68d75d72a` |

## Cadenas de cada reto
- **01:**
  - Texto que ve el estudiante: `VkRTTEhRV0xEUHtmcmdsaWxmZHVfcXJfaHZfZmxpdWR1fQ==`
  - Al decodificar el Base64 queda `VDSLHQWLDP{frglilfdu_qr_hv_fliudu}`, y al aplicar César −3 sale la flag.
- **02:** la flag va en el artefacto `hidden` de `exercises.json`.
- **03:** la IP atacante es `203.0.113.47`, dentro de `quien-toco-la-puerta.auth.log`.

Diseño completo: [[2026-09-10 Diseno pagina ejercicios]]
