# Apollo Client para GraphQL
npm install apollo-angular @apollo/client graphql

# Iconos (Material Icons ya viene con Angular Material)
# Utilidades de fecha
npm install date-fns

# Ngx-sonner o similar para toasts (compatible con Angular)
npm install ngx-sonner
```

---

## Estructura Completa
```
src/
│
├── app/
│   │
│   ├── core/                          # Servicios singleton, guards, interceptors
│   │   ├── graphql/
│   │   │   ├── apollo.config.ts       # Configuración Apollo Client
│   │   │   └── graphql-client.service.ts  # Wrapper base para queries/mutations
│   │   ├── services/
│   │   │   └── notification.service.ts    # Wrapper de toasts/snackbar global
│   │   └── interceptors/
│   │       └── error.interceptor.ts       # Manejo global de errores GraphQL
│   │
│   ├── shared/                        # Componentes, pipes y directivas reutilizables
│   │   ├── components/
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.component.ts
│   │   │   │   └── sidebar.component.html
│   │   │   ├── topbar/
│   │   │   │   ├── topbar.component.ts
│   │   │   │   └── topbar.component.html
│   │   │   ├── page-header/           # Título + subtítulo + botón acción (patrón común)
│   │   │   │   ├── page-header.component.ts
│   │   │   │   └── page-header.component.html
│   │   │   ├── status-badge/          # Badge de estado: Activo / Vencido / Devuelto
│   │   │   │   ├── status-badge.component.ts
│   │   │   │   └── status-badge.component.html
│   │   │   ├── stock-badge/           # Badge verde/rojo de disponibilidad
│   │   │   │   ├── stock-badge.component.ts
│   │   │   │   └── stock-badge.component.html
│   │   │   ├── avatar/                # Círculo con iniciales o foto
│   │   │   │   ├── avatar.component.ts
│   │   │   │   └── avatar.component.html
│   │   │   ├── confirm-dialog/        # Dialog de confirmación reutilizable
│   │   │   │   ├── confirm-dialog.component.ts
│   │   │   │   └── confirm-dialog.component.html
│   │   │   └── empty-state/           # Estado vacío cuando no hay datos
│   │   │       ├── empty-state.component.ts
│   │   │       └── empty-state.component.html
│   │   ├── pipes/
│   │       ├── currency-bs.pipe.ts    # Formatea "Bs. 20.00"
│   │       └── date-range.pipe.ts     # Formatea "Feb 21, 2026 - Feb 23, 2026"
│   │   
│   │
│   ├── layout/                        # Shell principal de la aplicación
│   │   ├── main-layout.component.ts
│   │   └── main-layout.component.html # sidebar + topbar + <router-outlet>
│   │
│   ├── features/                      # ← Módulos de negocio (por feature)
│   │   │
│   │   ├── games/
│   │   │   ├── graphql/
│   │   │   │   ├── games.queries.ts       # gql`query GetGames...`
│   │   │   │   └── games.mutations.ts     # gql`mutation CreateGame...`
│   │   │   ├── models/
│   │   │   │   └── game.model.ts          # Interface TypeScript del Game
│   │   │   ├── services/
│   │   │   │   └── games.service.ts       # Llama Apollo, expone Observables
│   │   │   ├── components/
│   │   │   │   ├── game-card/             # Card individual del juego (imagen + badge stock)
│   │   │   │   │   ├── game-card.component.ts
│   │   │   │   │   └── game-card.component.html
│   │   │   │   ├── game-filters/          # Tabs: Todos / Estrategia / Familiar / Cooperativo
│   │   │   │   │   ├── game-filters.component.ts
│   │   │   │   │   └── game-filters.component.html
│   │   │   │   └── game-form-dialog/      # Dialog para crear/editar juego
│   │   │   │       ├── game-form-dialog.component.ts
│   │   │   │       └── game-form-dialog.component.html
│   │   │   └── pages/
│   │   │       └── games-page/
│   │   │           ├── games-page.component.ts   # Smart component: orquesta todo
│   │   │           └── games-page.component.html
│   │   │
│   │   ├── clients/
│   │   │   ├── graphql/
│   │   │   │   ├── clients.queries.ts
│   │   │   │   └── clients.mutations.ts
│   │   │   ├── models/
│   │   │   │   └── client.model.ts
│   │   │   ├── services/
│   │   │   │   └── clients.service.ts
│   │   │   ├── components/
│   │   │   │   ├── client-table/          # Tabla con columnas: N, Cliente, Celular, Email...
│   │   │   │   │   ├── client-table.component.ts
│   │   │   │   │   └── client-table.component.html
│   │   │   │   ├── client-row-menu/       # Menú 3 puntos de acciones por fila
│   │   │   │   │   ├── client-row-menu.component.ts
│   │   │   │   │   └── client-row-menu.component.html
│   │   │   │   └── client-form-dialog/    # Dialog crear/editar cliente
│   │   │   │       ├── client-form-dialog.component.ts
│   │   │   │       └── client-form-dialog.component.html
│   │   │   └── pages/
│   │   │       └── clients-page/
│   │   │           ├── clients-page.component.ts
│   │   │           └── clients-page.component.html
│   │   │
│   │   └── loans/
│   │       ├── graphql/
│   │       │   ├── loans.queries.ts
│   │       │   └── loans.mutations.ts
│   │       ├── models/
│   │       │   └── loan.model.ts
│   │       ├── services/
│   │       │   └── loans.service.ts
│   │       ├── components/
│   │       │   ├── loan-table/            # Tabla con: juego, cliente, fechas, estado, precio
│   │       │   │   ├── loan-table.component.ts
│   │       │   │   └── loan-table.component.html
│   │       │   ├── loan-status-filters/   # Tabs: Todos / Activos(4) / Devueltos / Vencidos(1)
│   │       │   │   ├── loan-status-filters.component.ts
│   │       │   │   └── loan-status-filters.component.html
│   │       │   ├── loan-row-menu/         # Menú 3 puntos: Ver detalle / Marcar entregado
│   │       │   │   ├── loan-row-menu.component.ts
│   │       │   │   └── loan-row-menu.component.html
│   │       │   └── loan-form-dialog/      # Dialog crear préstamo
│   │       │       ├── loan-form-dialog.component.ts
│   │       │       └── loan-form-dialog.component.html
│   │       └── pages/
│   │           └── loans-page/
│   │               ├── loans-page.component.ts
│   │               └── loans-page.component.html
│   │
│   ├── app.config.ts                  # providers: Apollo, router, Material theme
│   ├── app.routes.ts                  # Rutas lazy-loaded por feature
│   ├── app.ts                         # Root component (standalone)
│   ├── app.html
│   └── app.css
│
├── index.html
├── main.ts
├── styles.css                         # Tailwind @import + Material theme override
└── material-theme.scss                # Tema oscuro personalizado
```

---

## Patrón por feature: Smart + Dumb components
```
Page (Smart)          →  orquesta, llama service, maneja estado
  ├── Filters/Tabs    →  Dumb, emite eventos
  ├── Table/Grid      →  Dumb, recibe @Input(), emite @Output()
  │     └── Row Menu  →  Dumb, emite la acción seleccionada
  └── Form Dialog     →  Semi-smart, tiene su propio form reactivo
