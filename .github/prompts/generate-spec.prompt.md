---
name: generate-spec
description: Genera una especificación técnica ASDD para un test de performance k6. Usa este comando con el nombre e descripción del test.
argument-hint: "<nombre-test>: <descripción del requerimiento de performance>"
agent: Spec Generator
tools:
  - edit/createFile
  - read/readFile
  - search/listDirectory
  - search
---

Genera una especificación técnica completa en `.github/specs/` para el siguiente requerimiento de performance.

**Test**: ${input:testName:nombre del test en kebab-case (ej: login-load)}
**Requerimiento**: ${input:requirement:descripción del test — o "ver requirements" para cargar desde .github/requirements/}

## Pasos a seguir:

1. **Si el requerimiento no se proporcionó**, busca en `.github/requirements/${input:testName}.md`. Si existe, úsalo como fuente.
2. Lee el stack k6: `.github/instructions/k6.instructions.md`.
3. Genera la spec usando la plantilla en `.github/skills/generate-spec/spec-template.md`.
4. Guarda el archivo como `.github/specs/${input:testName}.spec.md` con estado `DRAFT`.
5. Confirma la creación con un resumen de la spec al usuario.

## La spec debe cubrir:
- Objetivo del test (endpoint, método, tipo de prueba)
- SLAs y thresholds de aceptación (p(95), error rate, TPS)
- Diseño de stages y VUs (ramp-up, carga sostenida, ramp-down)
- Estructura del script k6 (config, helpers, checks, data)
- Plan de tareas para k6 Developer y QA

