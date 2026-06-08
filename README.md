# Job Hunter Platform - Monorepo TypeScript Hexagonal

Bienvenido a la arquitectura del **Job Hunter Platform**, un monorepo políglota diseñado bajo los principios de la **Arquitectura Hexagonal (Puertos y Adaptadores)**. Este sistema permite automatizar la búsqueda, análisis y postulación a ofertas de empleo.

---

## 🏗️ Estructura del Monorepo

La estructura de carpetas se organiza con el patrón `apps/` y `libs/` para separar las aplicaciones de la lógica de dominio compartida:

```text
job_hunter_workspace/
├── apps/
│   ├── api/                 # Backend Core (NestJS API REST - antes backend/)
│   │   ├── application/     # Casos de uso de la aplicación
│   │   │   └── use-cases/   # Ejemplo: create-profile.use-case.ts
│   │   └── infrastructure/  # Adaptadores HTTP (NestJS), persistence, queue
│   ├── frontend/            # UI en Angular
│   └── worker/              # Scraping Worker (Node.js/TS)
├── libs/
│   └── domain/              # Código Compartido (DRY)
│       ├── entities/        # Entidades (User, Profile, JobOffer como interfaces)
│       ├── ports/           # Puertos (user.repository, profile.repository, job-queue)
│       └── validation/      # Validadores puros del dominio (profile.validator)
└── README.md                # Documentación del sistema
```

---

## 🔄 Diagrama de Flujo del Sistema

El siguiente diagrama de flujo ilustra el ciclo de vida de una solicitud de búsqueda y análisis de ofertas de trabajo:

```mermaid
graph TD
    %% Define styles / classes
    classDef frontend fill:#e0f7fa,stroke:#00acc1,stroke-width:2px,color:#006064;
    classDef backend fill:#efebe9,stroke:#8d6e63,stroke-width:2px,color:#3e2723;
    classDef worker fill:#e8f5e9,stroke:#66bb6a,stroke-width:2px,color:#1b5e20;
    classDef db fill:#fff3e0,stroke:#ffb74d,stroke-width:2px,color:#e65100;
    
    subgraph Frontend [Angular UI]
        UI[User Interface]:::frontend
        Store[State & Consumption]:::frontend
    end

    subgraph Backend [NestJS Core API]
        Ctrl[HTTP Controller]:::backend
        UC_API[Application Use Cases]:::backend
        Repo_API[Database Port/Adapter]:::backend
        Queue_API[Redis Queue Adapter]:::backend
    end

    subgraph Broker [Message Broker]
        Redis[(Redis Queue)]:::db
    end

    subgraph Worker [Scraping Worker]
        Queue_Wrk[Redis Consumer Adapter]:::worker
        UC_Wrk[Scraping Orchestration]:::worker
        Playwright[Playwright Adapter]:::worker
        Gemini[Gemini SDK ReAct Loop]:::worker
        Repo_Wrk[Database Port/Adapter]:::worker
    end

    subgraph Shared [libs/domain]
        Entities[Shared Entities & Validation]
    end

    subgraph DB [Database]
        Postgres[(PostgreSQL)]:::db
    end

    %% Flow connections
    UI -->|1. Request Jobs / Config| Ctrl
    Ctrl --> UC_API
    UC_API -->|2. Save job search request| Repo_API
    Repo_API -->|TypeORM/Prisma| Postgres
    UC_API -->|3. Push task| Queue_API
    Queue_API -->|Enqueue| Redis

    %% Worker flow
    Redis -->|4. Pull task| Queue_Wrk
    Queue_Wrk --> UC_Wrk
    UC_Wrk -->|5. Read & Scrape| Playwright
    Playwright -->|HTML / Raw Text| UC_Wrk
    UC_Wrk -->|6. Evaluate fit (ReAct)| Gemini
    Gemini -->|Scoring & Analysis| UC_Wrk
    UC_Wrk -->|7. Save results| Repo_Wrk
    Repo_Wrk -->|TypeORM/Prisma| Postgres

    %% Shared dependency indicators
    Entities -.->|Imports| Backend
    Entities -.->|Imports| Worker
    
    %% UI polling/update
    UI -->|8. Fetch status & scoring| Ctrl
```
