---
name: k6-task
description: Implementa un script k6 completo y modular basado en una spec ASDD aprobada.
argument-hint: "<nombre-test> (debe existir .github/specs/<nombre-test>.spec.md)"
agent: k6 Developer
tools:
  - edit/createFile
  - edit/editFiles
  - read/readFile
  - search/listDirectory
  - search
  - execute/runInTerminal
---

Implementa el script k6 para el test especificado, siguiendo la spec aprobada.

**Test**: ${input:testName:nombre del test en kebab-case}

## Pasos obligatorios:

1. **Lee la spec** en `.github/specs/${input:testName}.spec.md` — si no existe, detente e informa al usuario.
2. **Lee el stack k6** en `.github/instructions/k6.instructions.md`.
3. **Implementa en orden**:
   - `scripts/data/users.csv` — CSV con encabezados `user,passwd` y datos sintéticos
   - `scripts/config/options.js` — thresholds y stages de la spec
   - `scripts/checks/responses.js` — validaciones con `check()`
   - `scripts/helpers/requests.js` — función HTTP parametrizada
   - `scripts/${input:testName}.js` — script principal con `SharedArray`, `group()`, `sleep()`
4. **Verifica sintaxis** (si k6 está instalado): `k6 run --dry-run scripts/${input:testName}.js`

## Restricciones:
- `BASE_URL` siempre desde `__ENV.BASE_URL` — NUNCA hardcodeada.
- Credenciales siempre desde CSV via `SharedArray`.
- `sleep(1)` obligatorio entre iteraciones.
- Thresholds obligatorios: `http_req_duration` y `http_req_failed`.
