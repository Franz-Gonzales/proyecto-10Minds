# Brief de Diseño Para: 10Minds BoardHub

**Cliente:** 10Minds

---

## Resumen y Antecedentes

En la ciudad de Sucre, cada vez más jóvenes prefieren reunirse en casa para jugar juegos de mesa en lugar de asistir a espacios físicos especializados.

La empresa local **10Minds BoardHub** ofrece un servicio de préstamo de juegos de mesa para llevar a domicilio.

Actualmente el control de préstamos se realiza en hojas de cálculo, lo que genera problemas como:

- Doble reserva de un mismo juego
- Falta de control de stock
- Juegos no devueltos a tiempo
- Desconocimiento de disponibilidad real

Se requiere desarrollar un sistema web administrativo que permita gestionar:

- Juegos disponibles
- Clientes
- Préstamos con fechas
- Control de stock
- Subida de imágenes de los juegos

**Público Target:** Jóvenes de la ciudad de Sucre

---

## Objetivos y Metas

Desarrollar una aplicación web administrativa utilizando:

- Angular 21
- Angular Material 21
- TailwindCSS v4.2
- NestJS
- GraphQL
- PostgreSQL
- TypeORM
- Apollo Server

Que permita gestionar de forma eficiente los préstamos de juegos de mesa en 10Minds BoardHub.

---

## Scope

- ✅ CRUD Juegos
- ✅ CRUD Clientes
- ✅ Gestión de préstamos
- ✅ Validación de stock
- ✅ Estados del préstamo
- ✅ Subida local de imágenes
- ✅ Borrado lógico en la Base de Datos

---

## Lógica de Negocio

1. **No se puede crear un préstamo si:** `Cantidad > Stock disponible`
2. **Al crear un préstamo:** El stock disponible disminuye.
3. **Al marcar como Entregado:** El stock disponible incrementa.
4. **Si la Fecha Fin del préstamo < Hoy y no fue devuelto:** El estado debe cambiar a `RETRASADO`.

---

## Timeline

**7 días**

---

## Entregables

- Sistema administrativo funcionando en local
- Subir a repositorio GitHub

---

## Restricciones y Especificaciones

- El sistema no contará con sistema de pagos.
- El sistema no necesita Autenticación.
- Limitarse a los prototipos entregados por el equipo de Diseño UX/UI.

---

## Historias de Usuario

### HU-01 — Registrar Juego

**Como** administrador **quiero** registrar un nuevo juego de mesa **para que** esté disponible para préstamo.

**Criterios de aceptación:**

- Debe poder ingresar título, categoría, `stockTotal`
- `stockDisponible` debe inicializarse igual a `stockTotal`
- Debe poder subir una imagen

---

### HU-02 — Registrar Cliente

**Como** administrador **quiero** registrar clientes **para** poder asociarlos a préstamos.

**Criterios de aceptación:**

- Nombre obligatorio
- Teléfono obligatorio
- No permitir teléfono duplicado

---

### HU-03 — Crear Préstamo

**Como** administrador **quiero** crear un préstamo **para** reservar un juego para un cliente.

**Criterios de aceptación:**

- No permitir si no hay stock suficiente
- Fecha fin debe ser mayor a fecha inicio
- El estado inicial debe ser `RESERVADO`
- `stockDisponible` debe disminuir automáticamente

---

### HU-04 — Registrar Devolución

**Como** administrador **quiero** marcar un préstamo como devuelto **para** liberar el stock.

**Criterios de aceptación:**

Al marcar como `ENTREGADO`:
- Se registra la Fecha de Entrega
- `stockDisponible` aumenta

---

### HU-05 — Ver Juegos Disponibles

**Como** administrador **quiero** ver el stock disponible **para** saber qué juegos pueden prestarse.

**Criterios de aceptación:**

Mostrar badge:
- 🟢 Verde si `stockDisponible > 0`
- 🔴 Rojo si `stockDisponible = 0`
