# Prueba de Rendimiento — k6 Performance Testing

Repositorio de scripts de performance testing con **k6**, siguiendo el flujo **ASDD** (Agent Spec Software Development).

## Stack

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| k6 | v1.7.1 | Motor de performance testing |
| papaparse | 5.1.1 | Lectura de CSV en k6 |
| GitHub Copilot | — | Agentes ASDD para desarrollo asistido |

## Estructura del Proyecto

```
scripts/
├── login-load-test.js      ← script principal: autenticación FakeStore API
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
    ├── login-load-test-report.html  ← reporte HTML generado automáticamente
    └── qa/                          ← artefactos QA (performance-plan, gherkin, risks)
.github/
└── ...                     ← framework ASDD (agentes, skills, specs)
```

## Tests disponibles

| Script | Endpoint | Tipo | VUs | Duración |
|--------|----------|------|-----|----------|
| `login-load-test.js` | `POST /auth/login` | Load | 20 | ~4m30s |

## Ejecutar el test de carga (completo)

```bash
k6 run --env BASE_URL=https://fakestoreapi.com scripts/login-load-test.js
```

## Ejecutar smoke test (verificación rápida)

```bash
k6 run --env BASE_URL=https://fakestoreapi.com --vus 2 --duration 15s scripts/login-load-test.js
```

## Reporte HTML

Al finalizar cada ejecución se genera automáticamente un reporte HTML en:

```
docs/output/login-load-test-report.html
```

Abrir en cualquier navegador. Incluye métricas de latencia (p(50)/p(95)/p(99)), tasa de error, TPS, checks y stages.

## Thresholds (SLAs)

| Métrica | Umbral | Descripción |
|---------|--------|-------------|
| `http_req_duration` | `p(95) < 1500ms` | Tiempo de respuesta en percentil 95 |
| `http_req_failed` | `rate < 3%` | Tasa de error máxima permitida |
| `http_reqs` | `rate > 20/s` | TPS mínimo (aplica solo en carga completa con 20 VUs) |

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
