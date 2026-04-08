---
description: 'Ejecuta el QA Agent con los 3 skills de performance para generar el plan de calidad completo basado en la spec aprobada.'
agent: QA Agent
---

Ejecuta el QA Agent completo para el test de performance especificado.

**Test**: ${input:testName:nombre del test en kebab-case}

**Instrucciones para @QA Agent:**

1. Lee `.github/docs/lineamientos/qa-guidelines.md` como primer paso
2. Lee la spec en `.github/specs/${input:testName}.spec.md`
3. Ejecuta los skills en orden estricto:
   - SKILL 1: `/performance-analyzer`    → `docs/output/qa/${input:testName}-performance-plan.md`
   - SKILL 2: `/gherkin-case-generator`  → `docs/output/qa/${input:testName}-gherkin.md`
   - SKILL 3: `/risk-identifier`         → `docs/output/qa/${input:testName}-risks.md`
4. Genera resumen consolidado al finalizar

**Prerequisito:** Debe existir `.github/specs/${input:testName}.spec.md` con estado APPROVED. Si no, ejecutar `/generate-spec` primero.
