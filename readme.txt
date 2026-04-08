================================================================================
PRUEBA DE CARGA - SERVICIO DE LOGIN
Instrucciones de Ejecución
================================================================================

REQUISITOS PREVIOS
==================

1. VERSIONES REQUERIDAS

   • K6 v1.7.1 o superior
     Descargar desde: https://dl.k6.io/releases/v1.7.1/k6-v1.7.1-windows-amd64.msi
   
   • Node.js 18+ (opcional, solo si se necesita ejecutar scripts adicionales)
     Descargar desde: https://nodejs.org/
   
   • Git 2.30+ (para clonar el repositorio)
     Descargar desde: https://git-scm.com/

2. TECNOLOGÍAS UTILIZADAS

   • k6 v1.7.1 - Motor de pruebas de carga
   • papaparse 5.1.1 - Librería para lectura de archivos CSV
   • Grafana k6-reporter - Generación de reportes HTML automáticos

INSTALACIÓN
===========

PASO 1: Clonar el Repositorio
────────────────────────────
Ejecutar en PowerShell o CMD:

  git clone https://github.com/Maese-Alfred/Prueba_Rendimiento.git
  cd Prueba_Rendimiento

PASO 2: Instalar K6
──────────────────
En Windows:
  1. Descargar el instalador desde https://dl.k6.io/releases/v1.7.1/k6-v1.7.1-windows-amd64.msi
  2. Ejecutar el instalador (.msi)
  3. Seguir los pasos del asistente
  4. Verificar instalación:

     k6 version

  Debe mostrar:
     k6 v1.7.1 (and other info)

En macOS (con Homebrew):
  
  brew install k6

En Linux (Debian/Ubuntu):
  
  sudo apt-get update
  sudo apt-get install -y gnupg software-properties-common
  sudo add-apt-repository "deb https://ghcr.io/grafana/k6/deb release main"
  sudo apt-get update
  sudo apt-get install k6

PASO 3: Crear Carpeta de Salida (IMPORTANTE)
────────────────────────────────────────────
El test genera reportes HTML. Asegurar que exista la carpeta:

  mkdir -p docs\output

En PowerShell:
  New-Item -ItemType Directory -Path "docs\output" -Force

FASE DE EJECUCIÓN
=================

OPCIÓN 1: TEST COMPLETO (Recomendado)
──────────────────────────────────────
Ejecutar en PowerShell desde la raíz del proyecto:

  k6 run --env BASE_URL=https://fakestoreapi.com scripts/login-load-test.js

Parámetros:
  • --env BASE_URL=... : URL del servicio a probar
  • Duración: ~4 minutos y 30 segundos
  • VUs: Hasta 50 usuarios virtuales
  • TPS objetivo: 20 peticiones por segundo

Resultado esperado:
  • El test finaliza con código 0 si TODOS los thresholds se cumplen
  • Genera reporte en: docs/output/login-load-test-report.html
  • Muestra resumen en consola con métricas clave


OPCIÓN 2: SMOKE TEST (Verificación rápida)
───────────────────────────────────────────
Para pruebas rápidas sin esperar 4.5 minutos:

  k6 run --env BASE_URL=https://fakestoreapi.com --vus 2 --duration 15s scripts/login-load-test.js

Parámetros:
  • --vus 2 : Solo 2 usuarios virtuales
  • --duration 15s : Solo 15 segundos
  • Duración total: ~1 minuto
  • Útil para: Verificar que el script está correcto antes de la prueba completa


OPCIÓN 3: TEST PERSONALIZADO
─────────────────────────────
Ejecutar con parámetros personalizados:

  k6 run --env BASE_URL=https://fakestoreapi.com --vus 10 --duration 1m scripts/login-load-test.js

Parámetros comunes:
  • --vus N : Número de usuarios virtuales (virtual users)
  • --duration 1m : Duración (1m = 1 minuto, 30s = 30 segundos)
  • --iterations N : Número máximo de iteraciones
  • --ramp-up 10s : Rampa de entrada (subida gradual de VUs)

LECTURA DE RESULTADOS
====================

DESDE LA CONSOLA
────────────────
Después de ejecutar el test, verás un resumen con:

  1. CHECKS (Validaciones Funcionales)
     status es 201 ..................: % ✓ / ✗
     respuesta contiene token ......: % ✓ / ✗

  2. MÉTRICAS DE LATENCIA
     http_req_duration (p95) .......: XX ms (debe ser < 1500ms)
     http_req_duration (p90) .......: XX ms
     http_req_duration (avg) .......: XX ms

  3. TASA DE ERROR
     http_req_failed ................: X% (debe ser < 3%)

  4. THROUGHPUT
     http_reqs ......................: X.XX/s (debe ser >= 20/s)

  5. ITERACIONES COMPLETADAS
     iterations .....................: N total


DESDE EL REPORTE HTML
──────────────────────
Abrir en navegador:

  docs/output/login-load-test-report.html

El reporte incluye:
  • Gráficos de latencia a lo largo del tiempo
  • Distribución de tiempos de respuesta
  • Tasa de errores por etapa
  • Comparativa de checks
  • Estadísticas detalladas exportables

Para abrir automáticamente en Windows:
  start docs\output\login-load-test-report.html


ESTRUCTURA DEL PROYECTO
=======================

scripts/
├── login-load-test.js        ← Script principal del test de carga
├── config/
│   └── options.js            ← Configuración de thresholds y stages
├── data/
│   └── users.csv             ← Credenciales parametrizadas (5 usuarios)
├── helpers/
│   └── requests.js           ← Función para hacer requests HTTP
└── checks/
    └── responses.js          ← Validaciones de respuesta

docs/
└── output/
    └── login-load-test-report.html  ← Reporte generado automáticamente

.github/
└── ...                       ← Framework ASDD (agentes, skills, specs)

README.md                      ← Documentación completa del proyecto
conclusiones.txt               ← Hallazgos y análisis de resultados
readme.txt                     ← Este archivo (instrucciones de ejecución)


DATOS PARAMETRIZADOS (users.csv)
================================

El archivo scripts/data/users.csv contiene 5 usuarios para las pruebas:

user,passwd
donero,ewedon
kevinryan,kev02937@
johnd,m38rmF$
derek,jklg*_56
mor_2314,83r5^_

El script selecciona aleatoriamente un usuario en cada iteración.


THRESHOLDS (SLAs) CONFIGURADOS
==============================

Métrica                    Umbral         Descripción
────────────────────────────────────────────────────────────
http_req_duration (p95)    < 1500ms       Tiempo de respuesta
http_req_failed            < 3%           Tasa de error máxima
http_reqs                  >= 20/s        Mínimo throughput requerido


TROUBLESHOOTING
===============

PROBLEMA 1: "k6 not found" o "No es reconocido como comando"
───────────────────────────────────────────────────────────
Solución:
  1. Verificar que k6 está instalado: k6 version
  2. Reiniciar PowerShell/CMD después de instalar
  3. Agregar k6 al PATH de Windows manualmente si es necesario

PROBLEMA 2: Error "Cannot open ./data/users.csv"
────────────────────────────────────────────────
Solución:
  1. Asegurar de ejecutar desde la raíz del proyecto: cd C:\Sofka\Prueba_Rendimiento
  2. Verificar que el archivo existe: dir scripts\data\users.csv

PROBLEMA 3: Error "Could not save summary information" (reporte HTML)
──────────────────────────────────────────────────────────────────────
Solución:
  1. Crear la carpeta de salida:
     mkdir -p docs\output
  2. Verificar permisos de escritura en la carpeta
  3. Cerrar cualquier navegador o aplicación que tenga abierto
     docs/output/login-load-test-report.html

PROBLEMA 4: Tasa de error alta o respuestas lentas
──────────────────────────────────────────────────
Solución:
  1. Ejecutar smoke test primero para verificar conectividad
  2. Probar desde una red diferente (puede haber throttling)
  3. Verificar que el endpoint https://fakestoreapi.com está disponible
  4. Revisar conexión a internet y latencia: ping fakestoreapi.com

PROBLEMA 5: Insuficientes recursos (máquina lenta)
──────────────────────────────────────────────────
Síntomas: El test consume 100% CPU o memoria
Solución:
  1. Cerrar aplicaciones innecesarias
  2. Ejecutar smoke test con menos VUs: --vus 5


VERIFICACIÓN DE INSTALACIÓN
============================

Ejecutar este comando para verificar que todo está funcionando:

  k6 run --env BASE_URL=https://fakestoreapi.com --vus 1 --duration 5s scripts/login-load-test.js

Si ves:
  ✓ El test se ejecuta sin errores
  ✓ Se generan resultados en la consola
  ✓ Se crea docs/output/login-load-test-report.html
  
→ La instalación es correcta y listo para ejecutar


CONTACTO Y SOPORTE
==================

Para reportar problemas:
  1. Verificar todos los pasos de instalación
  2. Incluir el error completo y versión de k6 (k6 version)
  3. Revisar conclusiones.txt para análisis de resultados previos

Recursos:
  • Documentación oficial k6: https://k6.io/docs/
  • Comunidad Slack: https://k6.io/slack
  • Issues del proyecto: GitHub Issues


CONCLUSIÓN
==========

Este repositorio contiene una prueba de carga automatizada lista para usar.
Sigue los pasos anteriores para ejecutar y evaluar el rendimiento del
servicio de login de FakeStore API.

Para análisis detallado de resultados, revisar: conclusiones.txt

================================================================================
Última actualización: 2026-04-08
Versión: 1.0
================================================================================
