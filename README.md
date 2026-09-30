 Sistema de Gestión para Farmacia

Plataforma web integral diseñada para la gestión de medicamentos, categorías y empleados de una farmacia

## 👥 Integrantes del Grupo

- Ruben Ledesma — Fullstack Developer
- Rodrigo Espinosa — Fullstack Developer

## 🛠️ Stack Tecnológico

### Frontend
- React (Vite)
- Material UI (MUI)
- Axios

### Backend
- NestJS (TypeScript)
- TypeORM
- class-validator / class-transformer
- mysql2

### Base de Datos
- MySQL 8

### Infraestructura
- Docker / Docker Compose

### Control de Versiones
- Git
- GitHub

## 🔍 Requisitos Funcionales

### 1. Gestión de Medicamentos
CRUD completo (crear, consultar, modificar y eliminar). Cada medicamento tiene precio, stock y pertenece a una categ
oría.

### 2. Gestión de Categorías
CRUD completo. El nombre de la categoría es único y una categoría agrupa varios medicamentos.

### 3. Gestión de Empleados
CRUD completo. El DNI y el email son únicos.

## ⚛️ Frontend React: Uso de Hooks

### useState
Utilizado para:
- Manejo de formularios.
- Estados de apertura de diálogos (alta, edición y confirmación de borrado).
- Gestión de errores.
- Almacenamiento de los datos obtenidos desde la API.

### useEffect
Utilizado para:
- Carga inicial de datos de cada módulo.
- Sincronización de los formularios con el registro seleccionado para editar.

### Componentes y navegación
- Navegación por pestañas de MUI en `App.jsx` (Medicamentos, Categorías y Empleados).
- Cada módulo en `src/features/<entidad>/` con su página (`*Page.jsx`), su formulario (`*FormDialog.jsx`) y un diálo
go de confirmación (`ConfirmDeleteDialog.jsx`).

## 🧱 Backend NestJS: API REST y Programación Orientada a Objetos

### Arquitectura modular
Cada entidad (`categorias`, `empleados`, `medicamentos`) tiene su propio `module`, `controller`, `service`, `dto` y
`entity`.

### Aplicación de POO
Las entidades principales son:
- `Categoria`
- `Medicamento`
- `Empleado`

### Encapsulamiento
La lógica de negocio y el acceso a datos están encapsulados en los servicios, que reciben el repositorio de TypeORM
por inyección de dependencias (atributo privado):

```ts
constructor(
  @InjectRepository(Medicamento)
  private medicamentoRepository: Repository<Medicamento>,
) {}
```

### Herencia y Abstracción
Los DTO de actualización heredan de los de creación para reutilizar atributos y validaciones:

```ts
export class UpdateMedicamentoDto extends PartialType(CreateMedicamentoDto) {}
```

### Validación
`ValidationPipe` global con `whitelist` y `forbidNonWhitelisted`: los campos no declarados en los DTO se rechazan co
n `400`.

### Relaciones
Relación uno a muchos entre `Categoria` y `Medicamento`.

## 🔗 Consumo de la API

Se utiliza **Axios** con una instancia centralizada (`src/api/client.js`, `baseURL: http://localhost:3000`) y un mód
ulo por entidad (`categorias.js`, `empleados.js`, `medicamentos.js`) con las operaciones listar, crear, actualizar y
 eliminar.

## 🔧 Instalación y Ejecución Local

### Requisitos
- Node.js 20 o superior y npm
- Docker y Docker Compose

### Base de Datos

```bash
docker compose up -d db
```

### Configuración del Backend

**1. Ingresar a la carpeta del servidor**
```bash
cd backend
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Variables de entorno (opcional)**

Se leen de `process.env`; no se carga ningún archivo `.env`. Si no se definen, se usan estos valores, que coinciden
con el `docker-compose.yml`:

| Variable | Default |
|----------|---------|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `3307` |
| `DB_USERNAME` | `root` |
| `DB_PASSWORD` | `root` |
| `DB_DATABASE` | `farmacia` |

**4. Ejecutar el servidor**
```bash
npm run start:dev
```

Al iniciar por primera vez se crean las tablas. Creá primero una **categoría**, porque para crear un medicamento se
necesita un `categoriaId`.

### Configuración del Frontend

**1. Ingresar a la carpeta del cliente**
```bash
cd frontend
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Ejecutar aplicación**
```bash
npm run dev
```

### Alternativa: todo con Docker

```bash
docker compose up
```

> **Atención:** el `docker-compose.yml` define `DB_PORT=3307` para el backend, que es el puerto publicado en el host
. Dentro de la red de Docker MySQL escucha en `3306`; si el backend no conecta, cambiá `DB_PORT` a `3306` en el serv
icio `backend`. Además, `depends_on` no espera a que MySQL esté listo, por lo que el backend puede fallar en el prim
er intento; reiniciarlo lo resuelve.

### Scripts útiles
- **Backend:** `npm run build`, `npm run start:prod`, `npm run lint`, `npm test`, `npm run test:e2e`
- **Frontend:** `npm run build`, `npm run preview`, `npm run lint`

## 📍 Acceso a la Aplicación

Una vez iniciados los servicios:

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| MySQL | localhost:3307 |

## ⚠️ Limitaciones conocidas

- Categoría o empleado inexistente (GET/PATCH/DELETE) y nombre de categoría duplicado devuelven `500` en lugar de `4
04`/`409`.
- `POST /empleados` con `dni` o `email` duplicado devuelve `500` (restricción única de la base de datos).
- `PATCH /medicamentos/:id` con `categoriaId` no cambia la categoría del medicamento (solo se mapea al crear).
- `POST /medicamentos` no devuelve el objeto `categoria` anidado, solo los `GET`.
- Un `categoriaId` inexistente, o eliminar una categoría con medicamentos asociados, devuelve `500` (error de clave
foránea).
- MySQL devuelve `precio` como string (tipo `decimal`).

## 🌳 Flujo de Trabajo con Git

El desarrollo se realizó utilizando una estrategia basada en ramas por funcionalidad:

```
main
└── developer
    ├── feature/back-categoria
    ├── feature/back-empleados
    ├── feature/back-medicamento
    ├── feature/front-categorias
    ├── feature/front-empleados
    └── feature/front-medicamento
```

Se utilizaron Pull Requests para integrar funcionalidades y mantener la estabilidad del proyecto.

## 📄 Documentación en Postman

[Haz click aquí para ver la documentación](https://documenter.getpostman.com/view/31369461/2sBYB4KSHN)


## 📄 Licencia

Proyecto desarrollado con fines académicos para la materia Programación III del IES 9-023.