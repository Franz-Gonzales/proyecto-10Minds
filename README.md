# 🎲 Board Hub - 10Minds

**Board Hub** es una plataforma integral diseñada para la gestión profesional de ludotecas y colecciones de juegos de mesa. El sistema permite administrar catálogos, organizar categorías, gestionar registros de clientes y controlar el flujo completo de préstamos y devoluciones.

Este repositorio contiene tanto el cliente (Frontend) como el servidor (Backend) de la aplicación.

---

## 🏗️ Arquitectura del Sistema

El proyecto está dividido en dos grandes bloques:

### 🖥️ Frontend ([board-hub-app](./board-hub-app))
Una SPA moderna construida con **Angular** que prioriza la experiencia de usuario y el rendimiento.
- **Estado y Datos:** Apollo GraphQL.
- **UI:** Tailwind CSS + DaisyUI + Angular Material.
- **Componentes:** Standalone components y Signals para una reactividad eficiente.

### ⚙️ Backend ([board-hub-backend](./board-hub-backend))
Una API robusta construida con **NestJS** siguiendo principios de **Clean Architecture** y **Arquitectura Hexagonal**.
- **Capa de Datos:** PostgreSQL con TypeORM.
- **Interfaz de API:** GraphQL (Apollo Server).
- **Mantenibilidad:** Desacoplamiento total entre reglas de negocio (Domain) e infraestructura.

---

## ✨ Características Principales

-   **Gestión de Juegos**: Catálogo completo con filtros avanzados.
-   **Control de Préstamos**: Seguimiento detallado de fechas, estados de mora y disponibilidad.
-   **Base de Datos de Clientes**: Registro centralizado de usuarios.
-   **Organización por Categorías**: Clasificación lógica (Estrategia, Party, Familiar, etc.).
-   **Interfaz Adaptable**: Diseño responsive y moderno.

---

## 🚀 Inicio Rápido

Para ejecutar el proyecto completo localmente, sigue estos pasos:

### 1. Requisitos Previos
- [Node.js](https://nodejs.org/) (Versión LTS recomendada)
- [PostgreSQL](https://www.postgresql.org/) corriendo localmente.

### 2. Configuración del Backend
```bash
cd board-hub-backend
npm install
cp .env.example .env # Configura tus credenciales de DB en .env
npm run start:dev
```
*La API estará disponible en `http://localhost:3000/graphql`*

### 3. Configuración del Frontend
```bash
cd board-hub-app
npm install
npm run start
```
*La aplicación abrirá en `http://localhost:4200`*

---

## 🛠️ Stack Tecnológico

| Componente | Tecnologías |
| :--- | :--- |
| **Frontend** | Angular 18+, Apollo Client, Tailwind CSS, Lucide, Vitest |
| **Backend** | NestJS, GraphQL, TypeORM, PostgreSQL, TypeScript |
| **Herramientas** | Prettier, ESLint, Git |

---

## 📂 Estructura del Repositorio

-   `board-hub-app/`: Código fuente del cliente Angular.
-   `board-hub-backend/`: Código fuente de la API NestJS.
-   `resources/docs/`: Documentación adicional y manuales.

---