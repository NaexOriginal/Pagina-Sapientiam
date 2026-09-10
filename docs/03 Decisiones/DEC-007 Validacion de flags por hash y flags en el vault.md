---
tipo: decision
id: DEC-007
estado: aceptada
fecha: 2026-09-10
responsable: Joseph
issue: 4
---

# DEC-007 Validación de flags por hash y flags en el vault

## Contexto
Sin backend, la flag se valida en el navegador. Además, el repo es **público**.

## Decisión
- El código solo guarda el **SHA-256** de cada flag (`flagHash`). La validación calcula el hash de lo que escribe el estudiante (después de quitarle los espacios de los extremos) y lo compara.
- El hash se calcula con `crypto.subtle`, que solo existe en HTTPS o `localhost`. Si no está disponible, se usa una implementación de SHA-256 en JS, porque el hosting aún no está definido (P-14).
- Las **flags en claro se documentan en el vault** ([[Flags de los retos]]), por comodidad del equipo, aunque sean visibles en GitHub.
- El progreso se guarda en `localStorage` (sin cuentas).

## Riesgos aceptados
- Quien lea el bundle o el repo puede ver las explicaciones, el artefacto del reto 02 y la nota de flags. Para retos de práctica no importa.
- Cuando existan retos con puntaje (fase 3 del [[Roadmap]]), la validación **tiene que** pasar al backend y las flags **no** pueden estar en el repo.

## Alternativas descartadas
- **Flags en texto plano en el código:** ni siquiera obliga a esforzarse.
- **Flags fuera del repo** (solo en el chat del equipo): era la opción recomendada, pero el equipo prefirió tenerlas a mano en el vault.
