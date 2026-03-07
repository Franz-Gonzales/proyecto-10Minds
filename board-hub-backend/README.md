# **BOARD HUB - BACKEND**

Backend del sistema **Board Hub**, una plataforma diseñada para la gestión integral de ludotecas y colecciones de juegos de mesa. Permite administrar catálogos de juegos, categorías, datos de clientes y el flujo completo de préstamos y devoluciones.

---

## **Tecnologías Principales**

Este proyecto utiliza un stack moderno y escalable:

-   **[NestJS](https://nestjs.com/)**: Framework progresivo de Node.js para construir aplicaciones eficientes y confiables.
-   **[GraphQL](https://graphql.org/)**: Lenguaje de consulta para APIs (implementado con Apollo Server).
-   **[TypeORM](https://typeorm.io/)**: ORM para interactuar con la base de datos de manera orientada a objetos.
-   **[PostgreSQL](https://www.postgresql.org/)**: Motor de base de datos relacional.
-   **[TypeScript](https://www.typescriptlang.org/)**: Tipado estático para mayor seguridad y mantenibilidad.

---

## **Arquitectura**

El proyecto sigue los principios de **Arquitectura Hexagonal (Puertos y Adaptadores)** y **Clean Architecture** para garantizar el desacoplamiento y la facilidad de testing:

-   **Domain**: Reglas de negocio y entidades puras.
-   **Application**: Casos de uso y servicios de aplicación.
-   **Infrastructure**: Implementaciones técnicas (TypeORM, adaptadores externos, mappers).
-   **Presentation**: Capa de entrada (Resolvers de GraphQL, DTOs, Inputs).

---

## **Módulos del Sistema**

-   **Category**: Gestión de géneros o tipos de juegos (Estrategia, Cooperativo, Party Games, etc.).
-   **Game**: Administración del catálogo de juegos de mesa (títulos, autores, descripción y su relación con categorías).
-   **Client**: Registro y gestión de la base de datos de usuarios/clientes.
-   **Loan**: Sistema de préstamos que controla quién tiene qué juego, fechas de salida, devoluciones esperadas y estados de mora.

---

## **Configuración e Instalación**

### 1. Clonar y preparar el entorno

**Requisitos previos:**
- Node.js (versión LTS recomendada)
- PostgreSQL instalado y corriendo


### 2. Base de Datos
Asegúrate de tener una instancia de **PostgreSQL** corriendo y configura las siguientes variables en tu `.env`:
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`.

### 3. Ejecutar la aplicación
```bash
# Modo desarrollo (con hot-reload)
$ npm run start:dev

# Modo producción
$ npm run start:prod
```

La API estará disponible en: [http://localhost:3000/graphql](http://localhost:3000/graphql)

---

## 🧪 **Testing**

```bash
# Pruebas unitarias
$ npm run test

# Pruebas E2E (End-to-End)
$ npm run test:e2e

# Cobertura de tests
$ npm run test:cov
```

---

## 🛠️ **Mantenimiento y Estilo**

- **Linter**: `npm run lint` para asegurar la calidad del código.
- **Formateo**: `npm run format` (Prettier).
- **Esquema GraphQL**: Se genera automáticamente en `src/schema.gql` basado en el código.

---

Desarrollado con energía para la comunidad de juegos de mesa.
