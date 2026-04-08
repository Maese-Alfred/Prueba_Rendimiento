---
description: 'Orquesta el flujo completo ASDD para k6: Spec → k6 Developer → QA → DOC (opcional). Requiere un requerimiento de performance como input.'
agent: Orchestrator
---

Inicia el flujo completo ASDD para un test de performance con k6.

**Test**: ${input:testName:nombre del test en kebab-case (ej: login-load)}
**Requerimiento**: ${input:requirement:descripción del test — endpoint, tipo de prueba, SLAs}

**El @Orchestrator ejecuta automáticamente:**

1. **[FASE 1 — Secuencial]** `Spec Generator` → genera `.github/specs/${input:testName}.spec.md`
2. **[FASE 2]** al aprobar la spec:
   - `k6 Developer` → implementa `scripts/${input:testName}.js` + config/ + helpers/ + checks/ + data/
3. **[FASE 3]** al completar implementación:
   - `QA Agent` → genera `docs/output/qa/` (performance plan, Gherkin, riesgos)
4. **[FASE 4 — Opcional]** `Documentation Agent` → si el usuario lo solicita

**El requerimiento se puede buscar también en** `.github/requirements/`.

