# 🏋️ SerfitUp - Backend

API REST para el sistema de gestión de proyectos y tareas SerfitUp, desarrollada con Node.js, Express y MongoDB.

## 📋 Descripción

Backend del sistema SerfitUp que proporciona una API REST completa para la gestión de proyectos y tareas. Utiliza MongoDB como base de datos y está construido con TypeScript para mayor robustez y mantenibilidad.

## 🚀 Tecnologías

- **Node.js** - Entorno de ejecución de JavaScript
- **Express 5** - Framework web minimalista y flexible
- **TypeScript** - Superset tipado de JavaScript
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Express Validator** - Validación de datos en las peticiones
- **CORS** - Habilitación de recursos entre orígenes
- **Colors** - Colores en la consola
- **dotenv** - Gestión de variables de entorno

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd serfitUp_backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
# Crea un archivo .env en la raíz con:
PORT=4000
DATABASE_URL=mongodb://localhost:27017/serfitup
FRONTEND_URL=http://localhost:5173
```

4. Asegúrate de tener MongoDB ejecutándose localmente o una instancia en la nube.

## 🛠️ Comandos Disponibles

```bash
# Modo desarrollo con nodemon y ts-node
npm run dev
```

## 📁 Estructura del Proyecto

```
src/
├── config/           # Configuraciones (CORS, Base de datos)
├── controller/       # Controladores de las rutas
├── middleware/       # Middlewares de validación y verificación
├── models/           # Modelos de Mongoose (Project, Task)
├── routes/           # Definición de rutas de la API
├── index.ts          # Punto de entrada de la aplicación
└── server.ts         # Configuración del servidor Express
```

## 🗄️ Modelos de Datos

### Project
```typescript
{
  projectName: string,
  clientName: string,
  description: string,
  tasks: ObjectId[],
  timestamps: true
}
```

### Task
```typescript
{
  name: string,
  description: string,
  project: ObjectId,
  status: 'pending' | 'onHold' | 'inProgress' | 'underReview' | 'completed',
  timestamps: true
}
```

## 🌐 Endpoints de la API

### Proyectos
- `GET /api/projects` - Obtener todos los proyectos
- `GET /api/projects/:id` - Obtener un proyecto por ID
- `POST /api/projects` - Crear un nuevo proyecto
- `PUT /api/projects/:id` - Actualizar un proyecto
- `DELETE /api/projects/:id` - Eliminar un proyecto

### Tareas
- `GET /api/projects/:projectId/tasks` - Obtener tareas de un proyecto
- `GET /api/projects/:projectId/tasks/:taskId` - Obtener una tarea específica
- `POST /api/projects/:projectId/tasks` - Crear una nueva tarea
- `PUT /api/projects/:projectId/tasks/:taskId` - Actualizar una tarea
- `DELETE /api/projects/:projectId/tasks/:taskId` - Eliminar una tarea

## 🔒 Middlewares

- **Validación de datos** - Express Validator para validar los datos de entrada
- **Verificación de proyecto** - Middleware que verifica la existencia de proyectos
- **Verificación de tareas** - Middleware que verifica la existencia y pertenencia de tareas
- **CORS** - Configurado para permitir peticiones desde el frontend

## 🛡️ Estados de Tareas

El sistema maneja 5 estados diferentes para las tareas:

1. **Pending** - Tarea pendiente de iniciar
2. **On Hold** - Tarea en espera
3. **In Progress** - Tarea en progreso
4. **Under Review** - Tarea en revisión
5. **Completed** - Tarea completada

## 🔗 Frontend

Este backend se comunica con el frontend de SerfitUp desarrollado en React. Asegúrate de configurar correctamente la URL del frontend en las variables de entorno para el CORS.

## 👨‍💻 Desarrollo

El proyecto utiliza:
- **TypeScript** para tipado estático
- **Nodemon** para reinicio automático en desarrollo
- **ts-node** para ejecutar TypeScript directamente
- **Mongoose Schemas** con tipado completo

## 📝 Colecciones de Thunder Client / Postman

El proyecto incluye archivos de colección para probar la API:
- `thunder-collection_postman_serfitUp-MERN.json`
- `thunder-collection_serfitUp-MERN.json`

Importa cualquiera de estos archivos en Thunder Client o Postman para probar todos los endpoints de la API.

## 📝 Licencia

ISC
