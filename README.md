# Prueba de Rendimiento — k6 Performance Testing

Repositorio de scripts de performance testing con **k6**, siguiendo el flujo **ASDD** (Agent Spec Software Development).

## Stack

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| k6 | v0.45.0+ | Motor de performance testing |
| papaparse | 5.1.1 | Lectura de CSV en k6 |
| GitHub Copilot | — | Agentes ASDD para desarrollo asistido |

## Estructura del Proyecto

```
scripts/
├── <test-name>.js          ← script principal del test
├── config/
│   └── options.js          ← thresholds y stages centralizados
├── data/
│   └── users.csv           ← datos parametrizados (user, passwd)
├── helpers/
│   └── requests.js         ← funciones HTTP reutilizables
└── checks/
    └── responses.js        ← validaciones de respuesta
docs/
└── output/
    └── qa/                 ← artefactos QA (performance-plan, gherkin, risks)
.github/
└── ...                     ← framework ASDD (agentes, skills, specs)
```

## Ejecutar un Script

```bash
# Requisito: k6 instalado (https://k6.io/docs/getting-started/installation/)
k6 run --env BASE_URL=https://fakestoreapi.com scripts/<test-name>.js
```

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `BASE_URL` | URL base del sistema bajo prueba | `https://fakestoreapi.com` |

## Flujo ASDD para nuevos tests

```
1. Crear requerimiento en .github/requirements/<test-name>.md
2. /generate-spec <test-name>     ← genera la spec técnica
3. Aprobar spec (status: APPROVED)
4. /implement-k6 <test-name>      ← implementa el script k6
5. /performance-analyzer          ← genera el plan QA
```

Ver `.github/README.md` para la guía completa del framework ASDD.
