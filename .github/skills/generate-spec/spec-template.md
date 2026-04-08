---
id: SPEC-###
status: DRAFT
test-name: nombre-del-test
endpoint: https://example.com/api/resource
method: POST
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: spec-generator
version: "1.0"
related-specs: []
---

# Spec: [Nombre del Test de Performance]

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Resumen del test de performance en 2-3 oraciones. Qué se prueba, bajo qué carga y qué SLAs deben cumplirse.

### Requerimiento de Performance
El requerimiento original tal como fue proporcionado por el usuario (o copiado de `.github/requirements/<test-name>.md`).

### Objetivo del Test

| Campo | Valor |
|-------|-------|
| **Endpoint** | `POST https://...` |
| **Tipo de prueba** | Load / Stress / Spike / Soak |
| **TPS objetivo** | ≥ X transacciones por segundo |
| **VUs máximos** | X usuarios virtuales |
| **Duración total** | X minutos |
| **Ambiente** | staging / producción |
| **Versión k6** | v0.45.0 o superior |

### Criterios de Aceptación — Thresholds

```
THRESHOLD-1: Tiempo de respuesta p(95) < 1500ms
THRESHOLD-2: Tasa de error < 3% del total de peticiones
THRESHOLD-3: (opcional) TPS mínimo: rate > X
```

### Criterios BDD

**Happy Path**
```gherkin
CRITERIO-1: Carga exitosa dentro de SLA
  Dado que:  el sistema recibe X VUs simultáneos
  Cuando:    se ejecuta el test de [tipo] durante [duración]
  Entonces:  el p(95) de tiempo de respuesta es menor a 1500ms
  Y:         la tasa de error es menor al 3%
```

**Error Path**
```gherkin
CRITERIO-2: Degradación controlada bajo estrés
  Dado que:  el sistema supera la carga esperada
  Cuando:    se incrementan los VUs por encima del target
  Entonces:  el sistema responde con errores controlados (no crashes)
  Y:         el tiempo de recuperación es aceptable
```

### Parametrización de Datos
- **Archivo CSV:** `scripts/data/users.csv`
- **Columnas requeridas:** `user,passwd`
- **Cantidad de registros:** mínimo X filas

---

## 2. DISEÑO

### Stages (configuración de carga)

```javascript
// scripts/config/options.js
export const options = {
  thresholds: {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.03'],
  },
  stages: [
    { duration: '1m', target: X },   // ramp-up
    { duration: '3m', target: X },   // carga sostenida
    { duration: '30s', target: 0 },  // ramp-down
  ],
};
```

### Estructura del Script

```
scripts/
├── <test-name>.js          ← script principal
├── config/
│   └── options.js          ← thresholds y stages
├── data/
│   └── users.csv           ← user,passwd
├── helpers/
│   └── requests.js         ← función makeLoginRequest() o equivalente
└── checks/
    └── responses.js        ← función checkLoginResponse() o equivalente
```

### Contrato del Request

```http
POST [endpoint]
Content-Type: application/json

{
  "username": "<user del CSV>",
  "password": "<passwd del CSV>"
}
```

### Contrato del Response esperado

```json
{
  "token": "<jwt_token>"
}
```

| Campo de validación | Check |
|---------------------|-------|
| Status HTTP | `200` |
| Body contiene token | `res.json('token') !== undefined` |
| Tiempo de respuesta | Controlado por threshold |

### Think Time
- `sleep(1)` entre cada iteración para simular comportamiento real.

---

## 3. LISTA DE TAREAS

### k6 Developer
- [ ] Crear `scripts/data/users.csv` con encabezados `user,passwd` y datos sintéticos
- [ ] Implementar `scripts/config/options.js` con thresholds y stages de la spec
- [ ] Implementar `scripts/checks/responses.js` con validaciones de status y token
- [ ] Implementar `scripts/helpers/requests.js` con la función HTTP parametrizada
- [ ] Implementar `scripts/<test-name>.js` como orquestador con `SharedArray`, `group()` y `sleep()`
- [ ] Verificar que `BASE_URL` se lee desde `__ENV.BASE_URL`
- [ ] Verificar que el script ejecuta sin errores de sintaxis

### QA
- [ ] Ejecutar `/performance-analyzer` y generar `docs/output/qa/<test-name>-performance-plan.md`
- [ ] Ejecutar `/gherkin-case-generator` y generar `docs/output/qa/<test-name>-gherkin.md`
- [ ] Ejecutar `/risk-identifier` y generar `docs/output/qa/<test-name>-risks.md`
- [ ] Validar que los thresholds del script coinciden con los criterios de la spec

- **Request Body**:
  ```json
  { "name": "string", "description": "string (opcional)" }
  ```
- **Response 201**:
  ```json
  { "uid": "uuid", "name": "string", "created_at": "iso8601", "updated_at": "iso8601" }
  ```
- **Response 400**: campo obligatorio faltante o inválido
- **Response 401**: token ausente o expirado
- **Response 409**: ya existe un recurso con ese nombre

#### GET /api/v1/[features]
- **Descripción**: Lista todos los recursos
- **Auth requerida**: sí
- **Response 200**:
  ```json
  [{ "uid": "uuid", "name": "string", ... }]
  ```

#### GET /api/v1/[features]/{uid}
- **Descripción**: Obtiene un recurso por uid
- **Auth requerida**: sí
- **Response 200**: recurso completo
- **Response 404**: no encontrado

#### PUT /api/v1/[features]/{uid}
- **Descripción**: Actualiza un recurso existente
- **Auth requerida**: sí
- **Request Body**: campos opcionales a actualizar
- **Response 200**: recurso actualizado
- **Response 404**: no encontrado

#### DELETE /api/v1/[features]/{uid}
- **Descripción**: Elimina un recurso
- **Auth requerida**: sí
- **Response 204**: eliminado exitosamente
- **Response 404**: no encontrado

### Diseño Frontend

#### Componentes nuevos
| Componente | Archivo | Props principales | Descripción |
|------------|---------|------------------|-------------|
| `FeatureCard` | `components/FeatureCard` | `item, onDelete, onEdit` | Tarjeta de un ítem |
| `FeatureFormModal` | `components/FeatureFormModal` | `isOpen, onSubmit, onClose` | Modal de creación/edición |

#### Páginas nuevas
| Página | Archivo | Ruta | Protegida |
|--------|---------|------|-----------|
| `FeaturePage` | `pages/FeaturePage` | `/features` | sí / no |

#### Hooks y State
| Hook | Archivo | Retorna | Descripción |
|------|---------|---------|-------------|
| `useFeature` | `hooks/useFeature` | `{ items, loading, error, create, update, remove }` | CRUD del feature |

#### Services (llamadas API)
| Función | Archivo | Endpoint |
|---------|---------|---------|
| `getFeatures(token)` | `services/featureService` | `GET /api/v1/features` |
| `createFeature(data, token)` | `services/featureService` | `POST /api/v1/features` |
| `updateFeature(uid, data, token)` | `services/featureService` | `PUT /api/v1/features/{uid}` |
| `deleteFeature(uid, token)` | `services/featureService` | `DELETE /api/v1/features/{uid}` |

### Arquitectura y Dependencias
- Paquetes nuevos requeridos: ninguno / listar si aplica
- Servicios externos: listar integraciones (auth, storage, third-party APIs)
- Impacto en punto de entrada de la app: registrar router/módulo si aplica

### Notas de Implementación
> Observaciones técnicas, decisiones de diseño o advertencias para los agentes de desarrollo.

---

## 3. LISTA DE TAREAS

> Checklist accionable para todos los agentes. Marcar cada ítem (`[x]`) al completarlo.
> El Orchestrator monitorea este checklist para determinar el progreso.

### Backend

#### Implementación
- [ ] Crear modelos `[Feature]Create`, `[Feature]Update`, `[Feature]Response`, `[Feature]Document`
- [ ] Implementar `[Feature]Repository` — métodos CRUD
- [ ] Implementar `[Feature]Service` — lógica de negocio de HU-01
- [ ] Implementar router/controller `/api/v1/[features]` — endpoints CRUD
- [ ] Registrar en punto de entrada de la app

#### Tests Backend
- [ ] `test_[service]_create_success` — happy path creación
- [ ] `test_[service]_create_duplicate_raises_conflict` — error unicidad
- [ ] `test_[service]_get_not_found_raises_error` — error not found
- [ ] `test_[repo]_insert_returns_document` — repositorio insert
- [ ] `test_[router]_post_returns_201` — endpoint creación
- [ ] `test_[router]_post_returns_401_no_token` — sin autenticación
- [ ] `test_[router]_get_returns_200` — listado

### Frontend

#### Implementación
- [ ] Crear `[feature]Service` — funciones para todos los endpoints
- [ ] Crear `use[Feature]` — hook/store con estado, loading, error y acciones CRUD
- [ ] Implementar `[Feature]Card` + estilos
- [ ] Implementar `[Feature]FormModal` + estilos
- [ ] Implementar `[Feature]Page` + estilos — layout completo
- [ ] Registrar ruta `/[features]` en el sistema de rutas

#### Tests Frontend
- [ ] `[FeatureCard] renders name correctly`
- [ ] `[FeatureCard] calls onDelete when button clicked`
- [ ] `[FeatureFormModal] submits form with correct data`
- [ ] `use[Feature] loads items on mount`
- [ ] `use[Feature] handles create error gracefully`
- [ ] `[FeaturePage] renders list of items`

### QA
- [ ] Ejecutar skill `/gherkin-case-generator` → criterios CRITERIO-1.1, 1.2, 1.3
- [ ] Ejecutar skill `/risk-identifier` → clasificación ASD de riesgos
- [ ] Revisar cobertura de tests contra criterios de aceptación
- [ ] Validar que todas las reglas de negocio están cubiertas
- [ ] Actualizar estado spec: `status: IMPLEMENTED`
