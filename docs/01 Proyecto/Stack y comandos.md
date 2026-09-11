---
tipo: proyecto
actualizado: 2026-09-10
---

# Stack y comandos

## Stack (apps/frontend/package.json)

| Paquete | Versión | Uso |
|---|---|---|
| react / react-dom | ^19.2.8 | UI |
| react-router | ^8.3.1 | Ruteo SPA (`createBrowserRouter`) |
| lucide-react | ^1.43.0 | Íconos (Footer: `Mail`, `MapPin`) |
| vite | ^8.2.2 | Dev server y build |
| @vitejs/plugin-react | ^6.1.0 | JSX / Fast Refresh |
| tailwindcss + @tailwindcss/vite | ^4.3.3 | Estilos |
| typescript | ~6.0.2 | Tipado (`tsc -b` en el build) |
| oxlint | ^1.79.0 | Linter |

Package manager: **Bun** (hay `bun.lock`, no uses npm/yarn para no generar otro lockfile).

## Comandos
Todo se corre desde `apps/frontend`:

```bash
cd apps/frontend
bun install        # dependencias
bun run dev        # servidor de desarrollo (Vite)
bun run build      # tsc -b && vite build → dist/
bun run lint       # oxlint
bun run preview    # sirve el build local
```

Antes de abrir un PR: `bun run lint && bun run build` sin errores.

> [!warning] Si no tienes Node instalado (solo Bun)
> Los ejecutables de oxlint arrancan con `#!/usr/bin/env node`. Sin Node, usa `bun run --bun lint`: el `--bun` hace que Bun reemplace a Node. Verificado el 2026-09-10 con Bun 1.4.2 y oxlint 1.81.0: detecta errores (probado con un `debugger`), y si el proyecto está limpio no imprime nada y sale con código 0.
> Además, `bun install` con Bun 1.4.x agrega `"configVersion": 0` al `bun.lock`. Es solo metadata: no lo commitees si no cambiaste dependencias.

## Setup del entorno
- **Bun**: `curl -fsSL https://bun.sh/install | bash` (Linux/WSL/macOS) o `powershell -c "irm bun.sh/install.ps1 | iex"` (Windows).
- **Node** (lo usan los ejecutables de Vite y oxlint): recomendado con nvm → `nvm install --lts`. Vite 8 requiere Node ≥ 20.19.
- **WSL + Windows**: cuidado con los finales de línea. Ver [[ERR-001 Finales de linea CRLF marcan todo como modificado]].
- **WSL + Node en Windows**: si Windows tiene Node instalado, `/mnt/c/Program Files/nodejs` entra al PATH de WSL. Verifica con `which node` que apunte a Linux (`~/.nvm/...`), no a `/mnt/c/...`. Mezclarlos da errores raros con binarios nativos como oxlint.
- Editor: VS Code funciona bien. `.vscode/` está ignorado salvo `extensions.json`.

## Theme (src/index.css)
| Token | Color | Uso típico |
|---|---|---|
| `background` | `#05070d` | Fondo general |
| `foreground` | `#edf2f2` | Texto principal |
| `muted` | `#84909e` | Texto secundario |
| `line` | `#202b3b` | Bordes / separadores |
| `panel` | `#0a101c` | Paneles, menú móvil |
| `lime` | `#b8ff3d` | Acento principal, CTAs |
| `cyan` | `#5ed8e6` | Énfasis en títulos |
| `purple` | `#ad7cff` | Detalles (terminal del hero) |

Se usan como clases de Tailwind: `bg-lime`, `text-muted`, `border-line`, etc. También hay una utilidad propia: `animate-blink` (cursor del hero).
