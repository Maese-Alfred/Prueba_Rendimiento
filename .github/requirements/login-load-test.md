# Requerimiento: Login Load Test

## Endpoint
- URL: `https://fakestoreapi.com/auth/login`
- Método: `POST`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  { "username": "{{user}}", "password": "{{passwd}}" }
  ```

## Tipo de Prueba
Load (Prueba de Carga)

## Objetivo de Carga
- TPS objetivo: ≥ 20
- VUs máximos: 20 (ajustable para alcanzar el TPS deseado)
- Duración: 5 minutos (recomendado para estabilizar la métrica de TPS)

## Thresholds (SLAs)
- Tiempo de respuesta: p(95) < 1500ms
- Tasa de error: < 3%

## Checks esperados
- Status code: `200`
- Response body contiene token JWT (campo `token` presente en el JSON de respuesta)

## Parametrización
- Fuente de datos: CSV con columnas `user`, `passwd`
- Cantidad de registros requeridos: mínimo 10
- Registros conocidos (completar hasta 10):
  | user       | passwd      |
  |------------|-------------|
  | donero     | ewedon      |
  | kevinryan  | kev02937@   |
  | johnd      | m38rmF$     |
  | derek      | jklg*56     |
  | mor_2314   | 83r5^       |

## Ambiente
- URL base: `https://fakestoreapi.com`
- Versión k6: v0.45.0+
- Repositorio: GitHub Público

## Notas de Implementación
- Usar `SharedArray` + `papaparse` para cargar el CSV eficientemente.
- Usar `group` para agrupar la transacción de login.
- Usar `sleep` entre requests para simular think time.
- La URL base debe leerse desde `__ENV.BASE_URL`, nunca hardcodeada.
- El repositorio debe incluir `README.md` con instrucciones de ejecución y `docs/output/conclusiones.md` con hallazgos.