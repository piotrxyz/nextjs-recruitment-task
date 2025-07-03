# Address Manager - NextJS Recruitment Task

NextJS application for managing users and their addresses. Features complete CRUD operations with Server Actions, real-time address preview, and responsive design.

## 🚀 Features

- **User Management**: Complete CRUD operations for users
- **Address Management**: Full address CRUD with real-time preview
- **Real-time Preview**: Address formatting: `<street> <building_number>\n<post_code> <city>\n<country_code>`
- **Responsive Design**: Mobile-first approach with shadcn/ui components
- **Server Actions**: Direct database operations without API routes
- **Form Validation**: React Hook Form with Zod validation
- **Type Safety**: Full TypeScript implementation with strict typing

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (Docker)
- **ORM**: Prisma
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **State Management**: Context API with custom hooks

## 📋 Prerequisites

- Node.js 18+
- pnpm (recommended)
- Docker and Docker Compose

## 🚦 Getting Started

1. **Clone and setup**:
```bash
cd nextjs-recruitment-task/app
pnpm install
```

2. **Start the database**:
```bash
# From root directory
docker compose up -d
```

3. **Setup environment**:
```bash
cp .env.example .env
# Edit .env with your database URL
```

4. **Generate Prisma client**:
```bash
npx prisma generate
```

5. **Start development server**:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄️ Database Schema

The application uses the provided database schema:

- **Users**: `id`, `firstName`, `lastName`, `initials`, `email`, `status`
- **UsersAddresses**: `userId`, `addressType`, `validFrom`, `postCode`, `city`, `countryCode`, `street`, `buildingNumber`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── Users/             # User management components
│   └── Addresses/         # Address management components
├── contexts/              # React Context providers
├── hooks/                 # Custom hooks
├── lib/
│   ├── actions/           # Server Actions
│   ├── validation/        # Zod schemas
│   └── utils/            # Utility functions
├── types/                 # TypeScript interfaces
└── prisma/               # Database schema
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues and format code
- `pnpm type-check` - Run TypeScript type checking

## 📱 UI Requirements Implementation

- ✅ Paginated users list with Create/Edit/Delete operations
- ✅ Address management with context menus
- ✅ Modal forms for Create/Edit operations
- ✅ Real-time address preview with proper formatting
- ✅ ISO3166-1 alpha-3 country code validation
- ✅ Server-side data validation and error handling
- ✅ Responsive design for mobile/desktop

## 🏗️ Server Actions Architecture

The application uses Next.js Server Actions for direct database operations:

- **Users**: Create, Read, Update, Delete operations
- **Addresses**: Full CRUD with composite key handling
- **Validation**: Zod schemas on both client and server
- **Error Handling**: Comprehensive error boundaries

## 🎯 Key Design Decisions

1. **Server Actions over API Routes**: Direct database operations for better performance
2. **Context API**: Global state management for users and addresses
3. **Composite Keys**: Proper handling of address primary keys
4. **Real-time Preview**: Address formatting as user types
5. **Modular Architecture**: Extensible for future CRUD components

## 📊 Performance Optimizations

- React.memo for component optimization
- useCallback and useMemo for expensive operations
- Proper dependency arrays in hooks
- Efficient re-rendering strategies

## 🚀 Deployment

The application is prepared for deployment with:

- Environment variables configuration
- Build optimization
- TypeScript strict mode
- Production-ready Docker setup

## 📝 Additional Notes

- All form fields are required on the frontend
- Country codes use ISO3166-1 alpha-3 standard
- Address updates handle composite key constraints
- Database schema remains unmodified as requested
