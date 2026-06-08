# Informe Técnico: Arquitectura y Configuración del Sistema Job Hunter

Este documento detalla la especificación técnica, decisiones de diseño y configuración de infraestructura implementadas en el proyecto **Job Hunter Platform**. La estructura está diseñada para facilitar su conversión directa a un documento académico o reporte técnico en LaTeX (Overleaf).

---

## 1. Introducción y Contexto del Proyecto

El **Job Hunter Platform** es un sistema distribuido diseñado para la búsqueda, filtrado y evaluación automática de ofertas de empleo. Debido a la naturaleza del sistema (procesamiento en tiempo real de peticiones del usuario junto a un scraper asíncrono con inteligencia artificial), se optó por un diseño de **Monorepo TypeScript** organizado bajo el patrón de **Arquitectura Hexagonal (Puertos y Adaptadores)**.

Esta arquitectura separa las reglas del negocio de los detalles tecnológicos de infraestructura (bases de datos, frameworks HTTP, brokers de mensajería), garantizando un sistema altamente testeable, mantenible y desacoplado.

---

## 2. Arquitectura de Carpetas (Monorepo)

La organización de archivos se estructuró bajo el patrón de división por aplicaciones (`apps/`) y librerías compartidas (`libs/`), aislando los contextos de ejecución:

```text
job_hunter_workspace/
├── apps/
│   ├── api/                 # API REST Central (NestJS Core)
│   │   ├── application/     # Casos de Uso (Flujos lógicos)
│   │   └── infrastructure/  # Adaptadores HTTP (Controladores) y Configuración
│   ├── frontend/            # Interfaz de Usuario (Angular)
│   └── worker/              # Agente Headless de Scraping (Node.js/TS)
├── libs/
│   ├── db/                  # Biblioteca compartida de Persistencia (Prisma ORM)
│   │   ├── prisma/          # Esquemas y migraciones SQL
│   │   └── src/             # Cliente de Prisma instanciado
│   └── domain/              # Biblioteca de Dominio (TypeScript Puro)
│       ├── entities/        # Entidades (User, Profile, JobOffer)
│       ├── ports/           # Interfaces de comunicación (Repositorios, Colas)
│       └── validation/      # Validadores de Dominio
├── docker-compose.yml       # Orquestación de infraestructura (Postgres & Redis)
├── .env                     # Variables de entorno locales
└── README.md                # Guía de inicio rápido
```

---

## 3. Capa de Dominio (libs/domain)

El dominio representa el núcleo de la aplicación. Se implementó un **Modelo de Dominio Anémico** mediante el uso de interfaces puras en combinación con servicios y validadores independientes:

### 3.1. Entidades de Datos (Interfaces)

*   **[user.entity.ts](file:///home/gerson/Desktop/job_hunter_workspace/libs/domain/entities/user.entity.ts):** Contrato del usuario del sistema.
    ```typescript
    export type UUID = string;
    export interface User {
        id: UUID;
        name: string;
        email: string;
        phone: string;
    }
    ```
*   **[profile.entity.ts](file:///home/gerson/Desktop/job_hunter_workspace/libs/domain/entities/profile.entity.ts):** Representa las preferencias de búsqueda del usuario.
    ```typescript
    export type UUID = string;
    export interface Profile {
        id: UUID;
        userId: UUID;
        profession: string;
        skills: string[];
        createdAt: Date;
    }
    ```
*   **[job-offer.entity.ts](file:///home/gerson/Desktop/job_hunter_workspace/libs/domain/entities/job-offer.entity.ts):** Representa una oferta de trabajo extraída.
    ```typescript
    export interface JobOffer {
        id: string;
        title: string;
        skills: string[];
    }
    ```

### 3.2. Puertos (Interfaces de Salida)

Los puertos definen el contrato que la infraestructura externa debe cumplir:

*   **`UserRepository`** e **`ProfileRepository`:** Contratos para el acceso a datos.
    ```typescript
    export interface ProfileRepository {
        save(profile: Profile): Promise<Profile>;
        findById(id: UUID): Promise<Profile | null>;
        findByUserId(userId: UUID): Promise<Profile | null>;
        delete(id: UUID): Promise<void>;
    }
    ```
*   **`JobQueuePort`:** Contrato para la comunicación asíncrona mediante colas de mensajes.
    ```typescript
    export interface JobQueuePort {
        enqueueScraping(profileId: string, profession: string): Promise<void>;
    }
    ```

### 3.3. Reglas de Validación
*   **`profile.validator.ts`:** Validador puro que protege la regla de negocio de que ningún perfil puede tener la profesión vacía.

---

## 4. Capa de Aplicación (apps/api/application)

La capa de aplicación implementa los Casos de Uso. Esta capa depende únicamente de las entidades del dominio y de los puertos (Inversión de Dependencias).

*   **Caso de Uso: `CreateProfileUseCase`**
    Se encarga de orquestar el flujo de creación de un perfil de búsqueda:
    1.  Recibe el DTO con los datos de entrada (`userId`, `profession`, `skills`).
    2.  Instancia el objeto de dominio `Profile` y autogenera un identificador único con `crypto.randomUUID()`.
    3.  Valida las reglas de negocio ejecutando el validador del dominio.
    4.  Persiste el perfil usando el puerto `ProfileRepository.save()`.
    5.  Encola la tarea de búsqueda de empleo a través del puerto `JobQueuePort.enqueueScraping()`.
    6.  Retorna el perfil guardado.

---

## 5. Capa de Infraestructura (Adaptadores)

La infraestructura contiene las implementaciones de los adaptadores externos y la configuración de frameworks.

### 5.1. Orquestación de Servicios (Docker Compose)
Se implementó un entorno aislado para PostgreSQL y Redis para evitar colisiones con servicios del sistema operativo local. El puerto PostgreSQL externo fue reconfigurado a `5440` debido a la ocupación del puerto local estándar `5432`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: job_hunter_postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres_password}
      POSTGRES_DB: ${DB_NAME:-job_hunter_db}
    ports:
      - "5440:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  redis:
    image: redis:7-alpine
    container_name: job_hunter_redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
```

### 5.2. Persistencia de Datos (Prisma ORM)
Prisma actúa como el adaptador de base de datos. Se instaló en `libs/db` generando un esquema compartido accesible por la API y por el Worker:

```prisma
model User {
  id        String    @id @default(uuid())
  name      String
  email     String    @unique
  phone     String
  profiles  Profile[]
  createdAt DateTime  @default(now())
}

model Profile {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  profession  String
  skills      String[]
  createdAt   DateTime @default(now())
}
```

Implementamos los adaptadores `PrismaUserRepository` y `PrismaProfileRepository` en `apps/api/infrastructure/adapters/persistence/` implementando las operaciones SQL a través del cliente autogenerado de Prisma.

### 5.3. Adaptador de Entrada (NestJS HTTP Controllers)
*   **`ProfileController`:** Expone el endpoint `POST /profiles`. Recibe el JSON de la petición HTTP, llama al caso de uso inyectado de forma síncrona y gestiona los códigos de estado HTTP (201 Created si es exitoso o 400 Bad Request en caso de fallo de validación).

### 5.4. Configuración en Runtime (`tsconfig-paths` y `dotenv`)
Dado que `ts-node` no resuelve los alias de ruta declarados en `tsconfig.json` de forma nativa en tiempo de ejecución, configuramos:
*   `tsconfig-paths` como interceptor en el comando de arranque: `ts-node -r tsconfig-paths/register main.ts`.
*   El paquete `dotenv` al inicio de `main.ts` cargando las variables locales del archivo `.env` de la raíz del monorepo hacia el contexto de ejecución.

---

## 6. Pruebas y Validación (TDD)

El proyecto se construyó bajo una filosofía rigurosa de TDD (Desarrollo Guiado por Pruebas). 

### 6.1. Flujo de Validación con Postman
Para verificar la API de forma física, primero se ejecutó un script de semilla (`libs/db/src/seed.ts`) que inserta al usuario de prueba con ID `user-uuid-123` en PostgreSQL, evitando errores de restricción de clave foránea. 

La petición HTTP de prueba construida para Postman es:
*   **URL:** `POST http://localhost:3000/profiles`
*   **JSON Payload:**
    ```json
    {
      "userId": "user-uuid-123",
      "profession": "React Developer",
      "skills": ["React", "TypeScript", "Redux"]
    }
    ```
*   **Resultado obtenido:** El servidor procesa exitosamente la solicitud de creación de perfil, persistiendo los datos en PostgreSQL en el puerto `5440` y disparando la simulación de colas imprimiendo en consola:
    `[JobQueue] Enqueued scraping task for Profile: <profile-id> (React Developer)`
