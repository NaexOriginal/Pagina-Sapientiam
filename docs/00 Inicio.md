---
tipo: indice
actualizado: 2026-09-10
---

# Sapientiam — Vault del equipo

Memoria compartida del proyecto **Plataforma Sapientiam** (semillero de seguridad de la ETITC).
Acá registramos avances, cambios, decisiones, pendientes, errores y actas. El código vive en `apps/`, y esta carpeta (`docs/`) es el vault.

> [!tip] Cómo abrirlo
> En Obsidian: *Open folder as vault* → selecciona `Pagina-Sapientiam/docs`.
> La carpeta `.obsidian/` **no se versiona** (issue #5). Cada quien configura su Obsidian. Recomendado: *Settings → Core plugins → Templates* con la carpeta de plantillas `_plantillas`, y *Files & links → New link format: Shortest path*.

## Mapa del vault

| Carpeta | Para qué | Quién escribe |
|---|---|---|
| [[Vision y alcance\|01 Proyecto]] | Qué es el proyecto, arquitectura, stack, mapa del código, flujo de trabajo | Todos (cambios consensuados) |
| [[Estado actual\|02 Estado]] | Foto actual, pendientes, deuda técnica, roadmap | Todos |
| [[Decisiones\|03 Decisiones]] | Una nota por decisión técnica (DEC-xxx) | Quien propone la decisión |
| [[Errores\|04 Errores]] | Una nota por bug o problema (ERR-xxx) | Quien lo encuentra |
| [[Reuniones\|05 Reuniones]] | Actas de reuniones | Quien toma nota |
| [[Historial de cambios\|06 Bitacora]] | Changelog del proyecto por fecha | Quien mergea el PR |
| [[Equipo]] | Carpetas personales: perfil, tareas y bitácora diaria | Cada quien la suya |
| `_plantillas` | Plantillas para notas nuevas | — |

## Acceso rápido

- 📍 [[Estado actual]]: dónde estamos hoy
- ✅ [[Pendientes]]: qué falta y quién lo tiene
- 🧱 [[Deuda tecnica]]: hallazgos del análisis del código
- 🗺️ [[Roadmap]]: fases del proyecto
- 🏗️ [[Arquitectura actual]] · [[Mapa del codigo]] · [[Stack y comandos]]
- 🔀 [[Flujo de trabajo]]: ramas, issues, PRs y reglas del vault
- 🧩 [[Guia crear un reto]]: paso a paso para agregar un reto nuevo a `/ejercicios`

## Reglas básicas (para no pisarnos en git)

1. **Una entrada = un archivo.** Errores, decisiones, actas y bitácoras van en notas separadas. Así casi nunca hay conflictos de merge.
2. **Tu carpeta personal es tuya.** No edites la carpeta de otro integrante. Si tienes algo para esa persona, déjalo en [[Pendientes]] o en un acta.
3. **Tablas compartidas** ([[Pendientes]], [[Historial de cambios]]): agrega filas al final y no reordenes. Si hay conflicto, deja las dos filas.
4. **Enlaza todo.** Menciona issues como `#4` y notas como `[[ERR-001 ...]]`. Los backlinks de Obsidian hacen el resto.
5. **Fechas en formato `AAAA-MM-DD`.** Los nombres de archivo van sin tildes para evitar problemas entre Windows, macOS y Linux.

Más detalle en [[Flujo de trabajo#Reglas del vault]].
