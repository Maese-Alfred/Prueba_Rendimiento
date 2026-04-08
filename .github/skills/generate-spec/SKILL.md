---
name: generate-spec
description: Genera una spec técnica ASDD para un test de performance k6 en .github/specs/<test-name>.spec.md. Obligatorio antes de cualquier implementación.
argument-hint: "<nombre-test>: <descripción del requerimiento de performance>"
---

# Generate Spec — k6 Performance Testing

## Definition of Ready — validar antes de generar

Una spec puede generarse solo si cumple:

- [ ] Endpoint objetivo definido (URL + método HTTP)
- [ ] Tipo de prueba definido (Load / Stress / Spike / Soak)
- [ ] Objetivo de TPS o VUs especificado (ej. "alcanzar 20 TPS")
- [ ] Thresholds de aceptación claros (p(95) en ms y tasa de error en %)
- [ ] Fuente de datos de parametrización indicada (ej. CSV con user/passwd)
- [ ] Dependencias identificadas (ambiente, versión de k6)

Si el requerimiento no cumple el DoR → listar las preguntas pendientes antes de generar.

## Proceso

1. Busca requerimiento en `.github/requirements/<test-name>.md` (si existe, úsalo)
2. Lee el stack k6: `.github/instructions/k6.instructions.md`
3. Valida DoR (arriba) — si hay ambigüedades, lista preguntas antes de continuar
4. Usa plantilla: `.github/skills/generate-spec/spec-template.md` EXACTAMENTE
5. Guarda en `.github/specs/<nombre-en-kebab-case>.spec.md`

## Frontmatter obligatorio

```yaml
---
id: SPEC-###
status: DRAFT
test-name: nombre-del-test
endpoint: https://...
method: POST|GET|PUT|DELETE
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: spec-generator
version: "1.0"
related-specs: []
---
```

## Secciones obligatorias

- `## 1. REQUERIMIENTOS` — objetivo del test, tipo de prueba, SLAs (thresholds), criterios de aceptación Gherkin
- `## 2. DISEÑO` — configuración de stages/VUs, estructura del script, parametrización CSV, thresholds
- `## 3. LISTA DE TAREAS` — checklists accionables para k6 Developer `[ ]` y QA `[ ]`

## Restricciones

- Solo leer + crear. No modificar código existente.
- Status siempre `DRAFT`. El usuario aprueba antes de implementar.
