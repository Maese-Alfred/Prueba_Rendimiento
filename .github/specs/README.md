# Specs — Fuente de Verdad del Proyecto ASDD (k6)

Este directorio contiene las especificaciones técnicas de cada test de performance. Son la fuente de verdad para el `k6 Developer` y el `QA Agent`.

## Ciclo de Vida

```
DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED
```

| Estado | Quién | Condición |
|--------|-------|-----------|
| `DRAFT` | spec-generator | Spec generada, pendiente de revisión humana |
| `APPROVED` | Usuario / Tech Lead | Revisada y aprobada — verde para implementar |
| `IN_PROGRESS` | orchestrator | Implementación en curso |
| `IMPLEMENTED` | orchestrator | Script + QA completos |
| `DEPRECATED` | Usuario | Descartada o reemplazada por otra spec |

> **Regla:** Sin `status: APPROVED` en el frontmatter → ningún agente implementa scripts.

## Convención de Nombres

```
.github/specs/<nombre-test-en-kebab-case>.spec.md
```

## Índice de Specs

| ID | Test | Archivo | Estado | Fecha |
|----|------|---------|--------|-------|
| — | *(sin specs aún)* | — | — | — |

> Actualizar esta tabla cada vez que se crea o cambia el estado de una spec.

## Cómo crear una spec nueva

**Opción 1 — Desde un requerimiento existente:**
```
/generate-spec login-load
```

**Opción 2 — Desde cero:**
```
/generate-spec
> Nombre del test: login-load
> Requerimiento: Test de carga para POST /auth/login con 20 TPS, p(95)<1500ms, error<3%
```

**Opción 3 — Orquestación completa (spec → implementación → QA):**
```
/asdd-orchestrate
> Test: login-load
```

## Frontmatter requerido en toda spec

```yaml
---
id: SPEC-001
status: DRAFT
test-name: nombre-del-test
endpoint: https://...
method: POST
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: spec-generator
version: "1.0"
related-specs: []
---
```

## Template

Ver `.github/skills/generate-spec/spec-template.md`

