# Lineamientos de Desarrollo — k6 Performance Testing
# Versión: 1.0.0

## 1. Estándares de Código k6

### Nomenclatura
- Funciones: `camelCase` → `makeLoginRequest`, `checkLoginResponse`
- Constantes: `UPPER_SNAKE_CASE` → `BASE_URL`, `MAX_RETRIES`
- Archivos: `kebab-case` → `login-load.js`, `options.js`
- Grupos: descripción en lenguaje de negocio → `group("Login User", ...)`
- Checks: string descriptivo → `"status es 200"`, `"contiene token"`

### Estructura del Proyecto k6

```
scripts/
├── <test-name>.js          ← script principal
├── config/
│   └── options.js          ← thresholds y stages (ÚNICA fuente de verdad)
├── data/
│   └── users.csv           ← datos parametrizados (user,passwd)
├── helpers/
│   └── requests.js         ← funciones HTTP reutilizables
└── checks/
    └── responses.js        ← validaciones check()
```

### Reglas de Código
- Máximo 30 líneas por función
- Sin valores mágicos (usar constantes nombradas)
- Sin comentarios redundantes — el código debe ser autoexplicativo
- Manejo explícito de resultados de `check()`

## 2. Estándares de Seguridad

- **`BASE_URL`**: siempre desde `__ENV.BASE_URL` — nunca hardcodeada en el script
- **Credenciales**: siempre desde `users.csv` vía `SharedArray` — nunca en el código
- **No datos reales**: CSV solo con datos sintéticos — nunca datos de producción
- **Sin logs de PII**: no usar `console.log` con datos de usuario

## 3. Estándares de Thresholds

Thresholds obligatorios en toda spec y script:

```javascript
thresholds: {
  "http_req_duration": ["p(95)<1500"],  // máximo 1.5s en p95
  "http_req_failed": ["rate<0.03"],     // menos del 3% de errores
}
```

Thresholds adicionales recomendados:
```javascript
"http_req_duration": ["p(99)<3000"],    // 99% bajo 3s
"http_reqs": ["rate>20"],              // mínimo 20 TPS
```

## 4. Estándares de Parametrización

### Formato CSV obligatorio
```csv
user,passwd
johnd,m38rmF$
mor_2314,83r5^_
```

- Encabezados: `user`, `passwd` (minúsculas, sin espacios)
- Mínimo 10 filas para evitar repetición excesiva bajo alta carga
- Datos sintéticos únicamente

### Carga de CSV (patrón obligatorio)
```javascript
const csvData = new SharedArray("users", function () {
  return papaparse.parse(open("./data/users.csv"), { header: true }).data;
});
```

## 5. Estándares de Think Time

- `sleep(1)` obligatorio entre iteraciones para simular comportamiento real
- Para flujos con múltiples pasos: `sleep()` entre cada step
- No atacar servicios sin pausa — evitar DoS no intencionados

## 6. Estándares de Git

### Ramas
- `main` → scripts estables y aprobados (protegida)
- `feature/<test-name>` → nuevo test en desarrollo
- `fix/<test-name>` → corrección de script o threshold

### Commits (Conventional Commits)
```
feat: agrega script de load testing para endpoint login
fix: corrige threshold de p(95) en login-load
test: actualiza CSV de usuarios para test de estrés
docs: actualiza README con instrucciones de ejecución
chore: actualiza versión de k6 en documentación
```
