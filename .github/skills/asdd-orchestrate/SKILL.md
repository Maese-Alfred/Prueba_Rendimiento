---
name: asdd-orchestrate
description: Orquesta el flujo ASDD completo para k6. Fase 1 (Spec) → Fase 2 (k6 Developer) → Fase 3 (QA) → Fase 4 (Doc opcional).
argument-hint: "<nombre-test> | status"
---

# ASDD Orchestrate — k6 Performance Testing

## Flujo

```
[FASE 1 — SECUENCIAL]
  spec-generator → .github/specs/<test-name>.spec.md  (DRAFT → APPROVED)

[FASE 2 — SECUENCIAL]
  k6-developer → scripts/<test-name>.js + config/ + helpers/ + checks/ + data/

[FASE 3 — SECUENCIAL]
  qa-agent → /performance-analyzer, /gherkin-case-generator, /risk-identifier

[FASE 4 — OPCIONAL]
  documentation-agent → README, performance reports
```

## Proceso
1. Busca `.github/specs/<test-name>.spec.md`
   - No existe → ejecuta `/generate-spec` y espera
   - `DRAFT` → presenta la spec al usuario y pide aprobación
   - `APPROVED` → actualiza a `IN_PROGRESS` y continúa
2. Lanza Fase 2: `k6-developer` implementa en `scripts/`
3. Cuando Fase 2 completa → lanza Fase 3: `qa-agent`
4. Actualiza spec a `IMPLEMENTED` y reporta estado final

## Comando status
Al recibir `status`: lista specs en `.github/specs/` con su estado y próxima acción pendiente.

## Reglas
- Sin spec `APPROVED` → no hay scripts — sin excepciones
- No implementar directamente — solo coordinar y delegar
- Si una fase falla → detener el flujo y notificar al usuario con contexto
- Fase 4 (doc) solo si el usuario la solicita explícitamente
