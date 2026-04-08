# Copilot Instructions

## ASDD Workflow (Agent Spec Software Development) — k6 Performance Testing

Este repositorio sigue el flujo **ASDD** adaptado para **pruebas de rendimiento con k6**: toda prueba nueva se ejecuta en cuatro fases orquestadas por agentes especializados.

```
[Orchestrator] → [Spec Generator] → [k6 Developer] → [QA] → [Doc]
```

### Fases del flujo ASDD
1. **Spec**: El agente `spec-generator` genera la spec en `.github/specs/<test-name>.spec.md`.
2. **Implementación**: `k6-developer` escribe los scripts k6 en `scripts/`.
3. **QA**: `qa-agent` genera estrategia de performance, Gherkin, riesgos y plan de ejecución.
4. **Doc (opcional)**: `documentation-agent` genera README updates y reportes de resultados.

### Skills disponibles (slash commands):
- `/asdd-orchestrate` — orquesta el flujo completo ASDD o consulta estado
- `/generate-spec` — genera spec técnica en `.github/specs/`
- `/implement-k6` — implementa script k6 completo (modular, con thresholds y checks)
- `/gherkin-case-generator` — escenarios Given-When-Then de performance
- `/risk-identifier` — clasificación de riesgos ASD (Alto/Medio/Bajo)
- `/automation-flow-proposer` — propuesta de automatización con ROI
- `/performance-analyzer` — planificación y análisis de pruebas de performance (Load, Stress, Spike, Soak)

### Requerimientos y Specs
- Los requerimientos de negocio viven en `.github/requirements/`. Son la entrada al pipeline ASDD.
- Las specs técnicas viven en `.github/specs/`. Cada spec es la fuente de verdad para implementar.
- Antes de escribir cualquier script, debe existir una spec aprobada en `.github/specs/`.
- Flujo: `requirements/<test-name>.md` → `/generate-spec` → `specs/<test-name>.spec.md` (APPROVED)

---

## Mapa de Archivos ASDD

### Agentes
| Agente | Fase | Ruta |
|---|---|---|
| Orchestrator | Entry point | `.github/agents/orchestrator.agent.md` |
| Spec Generator | Fase 1 | `.github/agents/spec-generator.agent.md` |
| k6 Developer | Fase 2 | `.github/agents/k6-developer.agent.md` |
| QA Agent | Fase 3 | `.github/agents/qa.agent.md` |
| Documentation Agent | Fase 4 | `.github/agents/documentation.agent.md` |

### Skills
| Skill | Agente | Ruta |
|---|---|---|
| `/asdd-orchestrate` | Orchestrator | `.github/skills/asdd-orchestrate/SKILL.md` |
| `/generate-spec` | Spec Generator | `.github/skills/generate-spec/SKILL.md` |
| `/implement-k6` | k6 Developer | `.github/skills/implement-k6/SKILL.md` |
| `/gherkin-case-generator` | QA Agent | `.github/skills/gherkin-case-generator/SKILL.md` |
| `/risk-identifier` | QA Agent | `.github/skills/risk-identifier/SKILL.md` |
| `/automation-flow-proposer` | QA Agent | `.github/skills/automation-flow-proposer/SKILL.md` |
| `/performance-analyzer` | QA Agent | `.github/skills/performance-analyzer/SKILL.md` |

### Instructions (path-scoped)
| Scope | Ruta | Se aplica a |
|---|---|---|
| k6 Scripts | `.github/instructions/k6.instructions.md` | `scripts/**/*.js` |
| Performance Tests | `.github/instructions/tests.instructions.md` | `scripts/**/*.js` · `docs/output/**` |

### Lineamientos y Contexto
| Documento | Ruta |
|---|---|
| Lineamientos de Desarrollo k6 | `.github/docs/lineamientos/dev-guidelines.md` |
| Lineamientos QA | `.github/docs/lineamientos/qa-guidelines.md` |
| Stack k6 + Convenciones | `.github/instructions/k6.instructions.md` |

### Lineamientos generales para todos los agentes
- **Reglas de Oro**: ver `.github/AGENTS.md` — rigen TODAS las interacciones.
- **Specs activas**: `.github/specs/` — consultar siempre antes de implementar.

---

## Reglas de Oro

> Principio rector: todas las contribuciones de la IA deben ser seguras, transparentes, con propósito definido y alineadas con las instrucciones explícitas del usuario.

### I. Integridad del Código y del Sistema
- **No código no autorizado**: no escribir, generar ni sugerir código nuevo a menos que el usuario lo solicite explícitamente.
- **No modificaciones no autorizadas**: no modificar, refactorizar ni eliminar código, archivos o estructuras existentes sin aprobación explícita.
- **Preservar la lógica existente**: respetar los patrones de modularización, convenciones de naming y thresholds definidos en la spec.

### II. Clarificación de Requisitos
- **Clarificación obligatoria**: si la solicitud es ambigua, incompleta o poco clara, detenerse y solicitar clarificación antes de proceder.
- **No realizar suposiciones**: basar todas las acciones estrictamente en información explícita provista por el usuario.

### III. Transparencia Operativa
- **Explicar antes de actuar**: antes de cualquier acción, explicar qué se hará y posibles implicaciones.
- **Detención ante la incertidumbre**: si surge inseguridad o conflicto con estas reglas, detenerse y consultar al usuario.
- **Acciones orientadas a un propósito**: cada acción debe ser directamente relevante para la solicitud explícita.

---

## Diccionario de Dominio

Términos canónicos a usar en specs, código y mensajes:

| Término | Definición | Sinónimos rechazados |
|---------|-----------|---------------------|
| **Script** (`script`) | Archivo principal k6 (`.js`) con la lógica del test | Test, prueba, archivo |
| **Escenario** (`scenario`) | Tipo de prueba de carga (Load, Stress, Spike, Soak) | Caso de prueba |
| **Stage** (`stage`) | Fase de ramp-up/hold/ramp-down dentro de un escenario | Paso, etapa |
| **VU** (`vu`) | Virtual User — usuario simulado por k6 | Hilo, worker, conexión |
| **TPS** (`tps`) | Transacciones por Segundo —  throughput del sistema | RPS, QPM |
| **Threshold** (`threshold`) | Umbral de aceptación (SLA) que define si el test pasa o falla | Límite, criterio |
| **Check** (`check`) | Validación de la respuesta HTTP (status, body, headers) | Assertion, validación |
| **Think Time** (`sleep`) | Pausa entre requests para simular comportamiento real | Delay, wait |
| **SharedArray** (`data`) | Conjunto de datos parametrizados cargado eficientemente desde CSV | Dataset |
| **Group** (`group`) | Agrupación lógica de transacciones para métricas | Bloque, sección |
| **Endpoint** (`endpoint`) | URL objetivo del test de performance | Ruta, URL, servicio |
| **p(95)** | Percentil 95 del tiempo de respuesta | Latencia máxima |
| `BASE_URL` | Variable de entorno con la URL base del sistema bajo prueba | URL hardcodeada |

**Reglas:** Nunca hardcodear `BASE_URL` ni credenciales — siempre `__ENV`. Datos sensibles en `users.csv`, nunca en el script. `Threshold` define el contrato de calidad. `Check` es validación funcional dentro de un test de performance.

---

## Estructura del Proyecto k6

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
```

## Project Overview

> Ver `README.md` en la raíz del proyecto.
