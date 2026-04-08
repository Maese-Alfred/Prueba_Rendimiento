---
name: implement-k6
description: Implementa un script k6 completo y modular para tests de performance. Requiere spec con status APPROVED en .github/specs/.
argument-hint: "<nombre-test>"
---

# Implement k6 Script

## Prerequisitos
1. Leer spec: `.github/specs/<test-name>.spec.md` — sección 2 (stages, thresholds, estructura)
2. Leer stack: `.github/instructions/k6.instructions.md`

## Orden de implementación

```
config/options.js → checks/responses.js → helpers/requests.js → <test-name>.js → data/users.csv
```

| Archivo | Responsabilidad |
|---------|-----------------|
| `config/options.js` | Thresholds y stages — fuente única de verdad para la configuración |
| `checks/responses.js` | Funciones de validación con `check()` — status, token, body |
| `helpers/requests.js` | Funciones HTTP reutilizables (POST, GET, etc.) con headers y payload |
| `<test-name>.js` | Script principal: importa módulos, carga CSV con SharedArray, llama helpers/checks |
| `data/users.csv` | CSV con encabezados `user,passwd` y datos sintéticos |

## Patrón de script principal (obligatorio)

```javascript
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { options } from './config/options.js';
import { makeRequest } from './helpers/requests.js';
import { checkResponse } from './checks/responses.js';

export { options };

const csvData = new SharedArray('users', function () {
  return papaparse.parse(open('./data/users.csv'), { header: true }).data;
});

export default function () {
  const user = csvData[Math.floor(Math.random() * csvData.length)];

  group('Login User', function () {
    const res = makeRequest(user);
    checkResponse(res);
  });

  sleep(1);
}
```

## Reglas
- `BASE_URL` siempre desde `__ENV.BASE_URL` — NUNCA hardcodeada.
- Credenciales siempre desde CSV via `SharedArray` — NUNCA en el script.
- `sleep(1)` obligatorio entre iteraciones — simular think time real.
- `group()` para agrupar transacciones lógicas.
- Thresholds obligatorios: `http_req_duration` + `http_req_failed` como mínimo.
- `check()` obligatorio: validar status code y presencia del token/campo esperado.

## Restricciones
- Solo directorio `scripts/`. No crear archivos fuera de ese directorio.
- CSV con datos sintéticos únicamente — nunca datos reales.

