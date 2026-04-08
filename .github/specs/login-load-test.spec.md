---
id: SPEC-001
status: APPROVED
test-name: login-load-test
endpoint: https://fakestoreapi.com/auth/login
method: POST
created: 2026-04-08
updated: 2026-04-08
author: spec-generator
version: "1.0"
related-specs: []
---

# Spec: Login Load Test

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Test de carga para el endpoint de autenticación (login) de FakeStore API. El objetivo es validar que el sistema puede manejar 20 transacciones por segundo durante 5 minutos, manteniendo un tiempo de respuesta p(95) menor a 1500ms y una tasa de error menor al 3%.

### Requerimiento de Performance
```
Endpoint: https://fakestoreapi.com/auth/login (POST)
Objetivo de carga: ≥ 20 TPS con máximo 20 VUs
Duración: 5 minutos
SLA Tiempo de respuesta: p(95) < 1500ms
SLA Tasa de error: < 3%
Datos de entrada: CSV con user/passwd (mínimo 10 registros)
```

### Objetivo del Test

| Campo | Valor |
|-------|-------|
| **Endpoint** | `POST https://fakestoreapi.com/auth/login` |
| **Tipo de prueba** | Load (Prueba de Carga) |
| **TPS objetivo** | ≥ 20 transacciones por segundo |
| **VUs máximos** | 20 usuarios virtuales |
| **Duración total** | 5 minutos (1 min ramp-up + 3 min sostenido + 30s ramp-down) |
| **Ambiente** | API pública (FakeStore API) |
| **Versión k6** | v0.45.0 o superior |

### Criterios de Aceptación — Thresholds

```
THRESHOLD-1: Tiempo de respuesta p(95) < 1500ms
THRESHOLD-2: Tasa de error < 3% del total de peticiones (http_req_failed rate < 0.03)
THRESHOLD-3: TPS mínimo: alcanzar ≥ 20 transacciones por segundo durante la fase sostenida
```

### Criterios BDD

**Happy Path — Carga Exitosa**
```gherkin
CRITERIO-1: Login exitoso dentro de SLA bajo carga normal
  Dado que:  el sistema recibe 20 VUs simultáneos
  Cuando:    se ejecuta el test de carga durante 5 minutos
  Entonces:  el p(95) de tiempo de respuesta es menor a 1500ms
  Y:         la tasa de error es menor al 3%
  Y:         cada respuesta 200 contiene un token JWT válido
```

**Error Path — Degradación Controlada**
```gherkin
CRITERIO-2: Sistema mantiene estabilidad bajo estrés
  Dado que:  el sistema recibe incrementos graduales de carga
  Cuando:    los VUs escalan de 0 a 20 durante 1 minuto
  Entonces:  no hay errores de conexión durante el ramp-up
  Y:         el tiempo de recuperación es aceptable (< 5s)
```

### Parametrización de Datos
- **Archivo CSV:** `scripts/data/users.csv`
- **Columnas requeridas:** `user,passwd`
- **Cantidad de registros:** mínimo 10 filas
- **Datos proporcionados:**
  ```
  donero,ewedon
  kevinryan,kev02937@
  johnd,m38rmF$
  derek,jklg*56
  mor_2314,83r5^
  ```

---

## 2. DISEÑO

### Stages (Configuración de Carga)

```javascript
// scripts/config/options.js
export const options = {
  thresholds: {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.03'],
  },
  stages: [
    { duration: '1m', target: 20 },   // ramp-up: escalar de 0 a 20 VUs en 1 minuto
    { duration: '3m', target: 20 },   // carga sostenida: mantener 20 VUs por 3 minutos
    { duration: '30s', target: 0 },   // ramp-down: reducir de 20 a 0 VUs en 30 segundos
  ],
};
```

**Duración total:** 4.5 minutos (~270 segundos)

### Estructura del Script

```
scripts/
├── login-load-test.js      ← script principal orquestador
├── config/
│   └── options.js          ← thresholds (p(95)<1500, rate<0.03) y stages (20 VUs)
├── data/
│   └── users.csv           ← user,passwd (mínimo 10 registros)
├── helpers/
│   └── requests.js         ← función makeLoginRequest(user)
└── checks/
    └── responses.js        ← función checkLoginResponse(res)
```

### Contrato del Request

```http
POST https://fakestoreapi.com/auth/login
Content-Type: application/json

{
  "username": "<user del CSV>",
  "password": "<passwd del CSV>"
}
```

### Contrato del Response esperado (Status 200)

```json
{
  "token": "<jwt_token_string>"
}
```

### Tabla de Validaciones

| Campo de validación | Check | Crítico |
|---------------------|-------|---------|
| Status HTTP | `200` | Sí (threshold failure si error) |
| Body contiene token | `res.json('token') !== undefined` | Sí |
| Tiempo de respuesta | `p(95) < 1500ms` | Sí (threshold) |
| Tasa de error | `< 3%` del total | Sí (threshold) |

### Think Time
- `sleep(1)` entre cada iteración para simular comportamiento real de usuarios.

### Parametrización CSV

El archivo `scripts/data/users.csv` debe tener este formato:

```csv
user,passwd
donero,ewedon
kevinryan,kev02937@
johnd,m38rmF$
derek,jklg*56
mor_2314,83r5^
```

Cargar con `SharedArray` y `papaparse` del k6 standard library para optimizar performance.

---

## 3. LISTA DE TAREAS

### k6 Developer
- [ ] Crear `scripts/data/users.csv` con 10+ registros (user, passwd)
- [ ] Implementar `scripts/config/options.js` con thresholds `p(95)<1500` y `rate<0.03` y stages (1m/20, 3m/20, 30s/0)
- [ ] Implementar `scripts/checks/responses.js` con validaciones de status 200 y presencia de token JWT
- [ ] Implementar `scripts/helpers/requests.js` con función `makeLoginRequest(user)` que lee `BASE_URL` desde `__ENV.BASE_URL`
- [ ] Implementar `scripts/login-load-test.js` como script principal con `SharedArray`, `papaparse`, `group()` y `sleep(1)`
- [ ] Validar que `BASE_URL` se lee desde `__ENV.BASE_URL` (nunca hardcodeada)
- [ ] Ejecutar script sin errores de sintaxis: `k6 run --env BASE_URL=https://fakestoreapi.com scripts/login-load-test.js`
- [ ] Verificar que el CSV se carga correctamente y que los datos están disponibles en el grupo de usuarios

### QA
- [ ] Ejecutar `/performance-analyzer` y generar `docs/output/qa/login-load-test-performance-plan.md`
- [ ] Ejecutar `/gherkin-case-generator` y generar `docs/output/qa/login-load-test-gherkin.md`
- [ ] Ejecutar `/risk-identifier` y generar `docs/output/qa/login-load-test-risks.md`
- [ ] Validar que los thresholds en `scripts/config/options.js` coinciden exactamente con la spec
- [ ] Ejecutar el script en staging y validar que cumple con los criterios de aceptación
- [ ] Documentar hallazgos en `docs/output/conclusiones.md`

