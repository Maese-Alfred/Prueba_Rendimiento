# Requirements — Requerimientos de Performance Testing

Este directorio contiene los requerimientos de performance que están **listos para ser especificados** pero aún no tienen una spec generada.

## ¿Qué es un Requerimiento de Performance?

Un requerimiento describe **qué endpoint se quiere probar**, bajo qué carga y con qué criterios de aceptación (SLAs). Es la entrada al pipeline ASDD para el `Spec Generator`.

## Lifecycle

```
requirements/<test-name>.md  →  /generate-spec  →  specs/<test-name>.spec.md
  (requerimiento de performance)   (Spec Generator)   (especificación técnica)
```

## Cómo Crear un Requerimiento

Crear un archivo `<test-name>.md` con al menos:

```markdown
# Requerimiento: [Nombre del Test]

## Endpoint
- URL: https://...
- Método: POST / GET / ...

## Tipo de Prueba
Load / Stress / Spike / Soak

## Objetivo de Carga
- TPS objetivo: ≥ X
- VUs máximos: X
- Duración: X minutos

## Thresholds (SLAs)
- Tiempo de respuesta: p(95) < Xms
- Tasa de error: < X%

## Parametrización
- Fuente de datos: CSV con columnas user, passwd
- Cantidad de registros: X

## Ambiente
- URL base: https://...
- Versión k6: v0.45.0+
```

## Convención de Nombres

```
.github/requirements/<nombre-test-kebab-case>.md
```

## Requerimientos Pendientes

| Test | Archivo | Estado |
|------|---------|--------|
| *(sin requerimientos aún)* | — | — |

> Actualiza esta tabla al agregar o procesar requerimientos.

