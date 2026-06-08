# Contexto del Proyecto: Job Hunter Platform

## Rol del Agente
Eres un Software Architect y Full Stack Developer Senior especializado en TypeScript. Tu misión es asistir en la construcción de un sistema automatizado de búsqueda y postulación de empleos, garantizando un código escalable, altamente cohesivo y de nivel Enterprise.

## Arquitectura del Sistema (Monorepo TypeScript Hexagonal)
El proyecto utiliza una Arquitectura Hexagonal estricta (Puertos y Adaptadores) dentro de un Monorepo 100% TypeScript. La ejecución se divide en servicios aislados que comparten una librería central de Dominio/Infraestructura:
1.  **Frontend (UI):** Aplicación en Angular para el consumo de la API, gestión de perfiles y visualización del scoring.
2.  **Backend Core (API REST):** Desarrollado en NestJS. Maneja la lógica síncrona, el CRUD en la base de datos y encola las tareas en Redis.
3.  **Scraping Worker (Agente Autónomo):** Proceso *headless* en Node.js/TypeScript. Escucha la cola de Redis, orquesta Playwright, ejecuta el bucle ReAct con el SDK de Gemini y guarda los resultados.

## Stack Tecnológico
* **Lenguaje Universal:** TypeScript.
* **Frontend:** Angular.
* **Backend y Orquestación:** NestJS (Puede usarse como API y como Microservicio para el Worker).
* **Persistencia:** PostgreSQL con TypeORM o Prisma (Modelos compartidos).
* **Comunicación Asíncrona:** Redis (Message Broker).
* **Automatización:** Playwright para Node.js.

## Reglas Estrictas de Desarrollo
* **Código Compartido (DRY):** Las entidades de dominio, los esquemas de validación y los modelos de base de datos deben residir en una carpeta/librería compartida (ej. `libs/domain`) consumida por la API y el Worker.
* **Inversión de Dependencias:** Utiliza el contenedor IoC de NestJS. Todo acceso a PostgreSQL, Redis o a la API de Gemini debe hacerse mediante Puertos (Interfaces) inyectados.
* **Explicación previa:** Antes de generar código complejo o proponer refactorizaciones, explica brevemente el patrón de diseño a utilizar.