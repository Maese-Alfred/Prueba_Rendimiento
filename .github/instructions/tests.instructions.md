---
applyTo: "scripts/**/*.js,docs/output/**"
---

# Instrucciones para Pruebas de Performance con k6

## Principios

- **Independencia**: cada script es autónomo — no depende de estado externo entre ejecuciones.
- **Parametrización**: datos de prueba siempre desde CSV via `SharedArray` — nunca hardcodeados.
- **Thresholds como contrato**: los thresholds en `config/options.js` definen el pass/fail de la prueba.
- **Checks obligatorios**: validar al menos status code y campo clave de la respuesta.

## Estructura AAA para scripts k6

```javascript
// GIVEN — configurar datos y usuarios virtuales (init code + SharedArray)
// WHEN  — ejecutar la acción HTTP (helpers/requests.js)
// THEN  — verificar el resultado (checks/responses.js)
```

## Convenciones de Nomenclatura

- Nombre del script: `<endpoint-o-flujo>-<tipo>.js` (ej: `login-load.js`)
- Nombre de grupos: `group('Nombre Descriptivo del Flujo', function () {...})`
- Nombre de checks: string descriptivo en español (ej: `'status es 200'`, `'contiene token'`)

## CSV de Datos de Prueba

```csv
user,passwd
johnd,m38rmF$
mor_2314,83r5^_
```

- Encabezados siempre en minúsculas: `user`, `passwd`
- Datos sintéticos únicamente — NUNCA datos reales de producción
- Mínimo 10-20 filas para evitar repetición excesiva bajo alta carga

## Thresholds Mínimos Requeridos

```javascript
thresholds: {
  'http_req_duration': ['p(95)<1500'],  // tiempo respuesta p95 < 1.5s
  'http_req_failed': ['rate<0.03'],     // tasa de error < 3%
}
```

## Ejecución

```bash
# Ejecución básica
k6 run --env BASE_URL=https://fakestoreapi.com scripts/<test-name>.js

# Con output a JSON
k6 run --env BASE_URL=https://fakestoreapi.com --out json=results.json scripts/<test-name>.js
```

## Nunca hacer

- Hardcodear `BASE_URL` o credenciales.
- Omitir `sleep()` — simular think time siempre.
- Omitir `check()` — siempre validar respuestas.
- Usar `console.log` con datos sensibles.
- Ejecutar tests de performance contra producción sin autorización explícita.

## DoR de Performance (antes de ejecutar)

- [ ] Spec con status `APPROVED` en `.github/specs/`
- [ ] CSV con datos sintéticos disponible en `scripts/data/users.csv`
- [ ] Thresholds alineados con los SLAs de la spec
- [ ] Ambiente de pruebas estable y disponible
- [ ] `BASE_URL` del ambiente de pruebas confirmada

## DoD de Performance (al finalizar)

- [ ] Script ejecuta sin errores de sintaxis
- [ ] Todos los `check()` definidos aparecen en el reporte
- [ ] Thresholds evaluados (verde o rojo) en el output de k6
- [ ] Artefactos QA generados en `docs/output/qa/`


# Instrucciones para Archivos de Pruebas Unitarias

## Principios

- **Independencia**: cada test es 100% independiente — sin estado compartido entre tests.
- **Aislamiento**: mockear SIEMPRE dependencias externas (DB, Firebase, API REST, sistema de archivos).
- **Claridad**: nombre del test debe describir la función bajo prueba y el escenario (qué pasa cuando X).
- **Cobertura**: cubrir happy path, error path y edge cases para cada unidad.

## Backend (pytest)

### Estructura de archivos
```
backend/tests/
  conftest.py                        ← fixtures compartidas
  services/test_<feature>_service.py
  repositories/test_<feature>_repository.py
  routes/test_<feature>_router.py
```

### Convenciones
- Nombre: `test_[función]_[escenario]` (ej: `test_create_user_success`, `test_create_user_duplicate_email`)
- Usar `@pytest.mark.asyncio` para funciones asíncronas.
- Mockear repositorios en tests de servicios con `AsyncMock`.
- Usar `AsyncClient` + `ASGITransport` para tests de endpoints.

```python
# Ejemplo mínimo de test de servicio
@pytest.mark.asyncio
async def test_create_user_success():
    mock_repo = MagicMock()
    mock_repo.create = AsyncMock(return_value={"uid": "abc"})
    service = UserService(mock_repo)
    result = await service.create({"uid": "abc", "email": "a@b.com"})
    assert result["uid"] == "abc"
```

## Frontend (Vitest + Testing Library)

### Estructura de archivos
```
frontend/src/__tests__/
  [ComponentName].test.jsx
  use[HookName].test.js
```

### Convenciones
- Nombre del describe: nombre del componente/hook.
- Nombre del it/test: `[verbo] [qué hace] [condición]` (ej: `renders login button when unauthenticated`).
- Usar `vi.mock()` para mockear módulos externos (Firebase, fetch).
- Siempre limpiar mocks con `beforeEach(() => vi.clearAllMocks())`.

```jsx
// Ejemplo mínimo de test de componente
describe('LoginPage', () => {
  it('renders email input', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
```

## Nunca hacer

- Tests que dependen del orden de ejecución.
- Llamadas reales a Firebase, MongoDB o APIs externas.
- `console.log` permanentes en tests.
- Lógica condicional dentro de un test (if/else).
- Usar `sleep` para sincronización temporal (cero tests "flaky").

---

> Para quality gates, pirámide de testing, TDD, CDC y nomenclatura Gherkin, ver `.github/docs/lineamientos/dev-guidelines.md` §7 y `.github/docs/lineamientos/qa-guidelines.md`.

### Estructura AAA obligatoria
```python
# GIVEN — preparar datos y contexto
# WHEN  — ejecutar la acción bajo prueba
# THEN  — verificar el resultado esperado
```

### DoR de Automatización
Antes de automatizar un flujo, verificar:
- [ ] Caso ejecutado exitosamente en manual sin bugs críticos
- [ ] Caso de prueba detallado con datos identificados
- [ ] Viabilidad técnica comprobada
- [ ] Ambiente estable disponible
- [ ] Aprobación del equipo

### DoD de Automatización
Un script finaliza cuando:
- [ ] Código revisado por pares (pull request review)
- [ ] Datos desacoplados del código
- [ ] Integrado al pipeline de CI
- [ ] Con documentación y trazabilidad hacia la HU
