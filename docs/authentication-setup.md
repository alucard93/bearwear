# Documentação de Autenticação - Bearwear

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura de Componentes](#estrutura-de-componentes)
3. [Correções e Ajustes](#correções-e-ajustes)
4. [Integração Better Auth](#integração-better-auth)
5. [Arquitetura de Arquivos](#arquitetura-de-arquivos)
6. [Validações Implementadas](#validações-implementadas)
7. [Estilo e Design](#estilo-e-design)
8. [Status Atual](#status-atual)
9. [Próximos Passos](#próximos-passos)

---

## Visão Geral

Sistema de autenticação completo construído com:
- **Frontend**: React Hook Form + Zod para validação
- **UI**: shadcn/ui v4 (Field + Controller pattern)
- **Backend**: Better Auth com Drizzle ORM
- **Styling**: Tailwind CSS v4 + CVA
- **Database**: PostgreSQL via Drizzle

---

## Estrutura de Componentes

### 1. `components/Form/auth-form.tsx` - Container Principal

**Responsabilidades:**
- Gerenciamento de abas (Entrar / Criar Conta)
- Estado controlado do componente ativo
- Aplicação de estilos condicionais

**Características:**
- Tabs gerenciadas com `useState('sign-in')`
- TabsList com fundo `zinc-100` e `rounded-xl`
- TabsTrigger ativo: `bg-white text-zinc-900 shadow-sm`
- TabsTrigger inativo: `text-zinc-600`
- Transição suave com `transition-all`

**Dependências:**
- LoginForm e RegisterForm
- CardContent de `@/components/ui/card`
- Tabs components de `@/components/ui/tabs`

---

### 2. `components/Form/components/login-form.tsx` - Formulário de Login

**Campos:**
- Email (validação de formato)
- Senha (mínimo 8 caracteres)

**Implementação:**
```typescript
export default function LoginForm() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginValues) => {
    console.log('Login:', data) // TODO: Conectar a Better Auth
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Email Controller */}
        {/* Password Controller */}
        <Button type="submit">Entrar</Button>
      </form>
    </Form>
  )
}
```

**Status:** ✅ Validação completa, 🟡 Handlers precisam conectar a Better Auth

---

### 3. `components/Form/components/register-form.tsx` - Formulário de Registro

**Campos:**
- Nome (obrigatório)
- Email (validação de formato)
- Senha (mínimo 8 caracteres)
- Confirmação de Senha (idêntica à senha)

**Layout Responsivo:**
- Grid 2 colunas em `md` (Nome + Email lado-a-lado)
- Stack vertical em mobile
- Campos de senha em largura completa

**Validações Especiais:**
- Refine Zod para confirmar senha idêntica
- Mensagens de erro personalizadas

**Status:** ✅ Fully implemented, 🟡 Handlers precisam integração

---

### 4. `components/Form/schema/auth-schemas.ts` - Schemas Centralizados

**Schemas Definidos:**

```typescript
// Schema de Login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

// Schema de Registro
export const registerSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})

// Types Exportados
export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
```

**Benefícios:**
- Source of truth para validação
- Types automaticamente sincronizados
- Reutilizáveis em endpoints API

---

## Correções e Ajustes

### Hydration Warning Resolution

**Problema:**
- Extensões do navegador modificam classes no `body` antes da hidratação React
- Causa: "Did not expect server HTML to contain a text node in..."

**Solução:**
```typescript
// app/layout.tsx
<html suppressHydrationWarning>
  <body suppressHydrationWarning>
    {/* content */}
  </body>
</html>
```

**Status:** ✅ Resolvido

---

### Configuração de Fontes

**Problema:**
- Anton: Falta especificação de weight
- Poppins: Falta array de weights
- Resultado: Warnings de prebuild-install deprecated

**Solução:**
```typescript
// app/layout.tsx
const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
})

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})
```

**Status:** ✅ Corrigido

---

### Estilo das Abas (Tab Highlighting)

**Problema:**
- CSS data-active selectors não acionando cambios visuais
- Abas pareciam desativadas

**Solução Implementada:**
- Troca de data-attribute para estado controlado `activeTab`
- Conditional className baseado em estado

```typescript
<TabsTrigger 
  className={`rounded-lg px-3 text-xs font-semibold transition-all ${
    activeTab === 'sign-in' 
      ? 'bg-white text-zinc-900 shadow-sm' 
      : 'text-zinc-600'
  }`}
>
  Entrar
</TabsTrigger>
```

**Status:** ✅ Visual feedback claro

---

## Integração Better Auth

### Instalação

```bash
npm i better-auth
```

**Pacotes adicionados:** 21 dependências
**Tempo:** < 2 minutos

---

### Arquivo de Configuração: `lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/app/db";
import * as schema from "@/app/db/schema";

export const auth = new BetterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  providers: [],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;
```

**Correção Crítica:**
- Inicial: `import { db } from "@/db"` ❌ (alias inválido)
- Corrigido: `import { db } from "@/app/db"` ✅ (localização real)

**Razão:** 
- Database realmente está em `app/db/`
- Path alias `@/db` não existe
- CLI geração falhava por módulo não encontrado

---

### Schema Gerado via CLI

```bash
npx @better-auth/cli generate --yes
```

**Resultado:**
- ✅ Schema gerado com sucesso
- 📁 Arquivo criado: `auth-schema.ts` (raiz do projeto)
- 📊 Contém definições: users, sessions, accounts, verifications
- ⚠️ Warning (não-bloqueante): Base URL não configurada

**Arquivo Gerado:**
```typescript
// auth-schema.ts
import { pgTable, pgEnum, foreignKey, ... } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull(),
}, (table) => ({
  userIdFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [user.id],
  }),
}))

// ... outros schemas
```

---

## Arquitetura de Arquivos

```
bearwear/
├── components/
│   ├── Form/
│   │   ├── auth-form.tsx               (Container com abas)
│   │   ├── components/
│   │   │   ├── login-form.tsx          (Form de login)
│   │   │   └── register-form.tsx       (Form de registro)
│   │   └── schema/
│   │       └── auth-schemas.ts         (Zod schemas)
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── field.tsx
│       ├── form.tsx
│       ├── input.tsx
│       └── tabs.tsx
│
├── lib/
│   └── auth.ts                          (Better Auth config)
│
├── app/
│   ├── layout.tsx                       (Root layout + fonts)
│   ├── db/
│   │   ├── index.ts                     (DB instance)
│   │   ├── schema.ts                    (Drizzle schema)
│   │   └── seed.ts                      (Database seed)
│   └── authentication/
│       └── page.tsx                     (Auth page)
│
├── auth-schema.ts                       (Gerado por CLI)
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Validações Implementadas

### Login Form
| Campo | Regra | Status |
|-------|-------|--------|
| Email | RFC 5322 format | ✅ Enforced |
| Senha | Mínimo 8 caracteres | ✅ Enforced |

### Register Form
| Campo | Regra | Status |
|-------|-------|--------|
| Nome | Mínimo 2 caracteres | ✅ Enforced |
| Email | RFC 5322 format | ✅ Enforced |
| Senha | Mínimo 8 caracteres | ✅ Enforced |
| Confirmação | Idêntica à senha | ✅ Enforced via refine |

**Tecnologia:** Zod com React Hook Form (zodResolver)

---

## Estilo e Design

### Paleta de Cores
- TabsList Background: `zinc-100` (cinza claro)
- TabsTrigger Ativo: `bg-white text-zinc-900`
- TabsTrigger Inativo: `text-zinc-600`
- Sombra Ativa: `shadow-sm`

### Tipografia
- **Anton**: Títulos, headers
  - Weight: 400
  - Usage: `font-anton`
- **Poppins**: Body, labels
  - Weights: 400, 600, 700
  - Usage: `font-poppins`

### Responsividade
- Mobile-first approach
- Grid de campos em md+ (2 colunas)
- Full-width em mobile
- Gap e padding adaptáveis

### Transições
- `transition-all` em buttons e tabs
- Smooth color changes
- CSS-based animations

---

## Status Atual

| Componente | Aspecto | Status | Observações |
|------------|--------|--------|-------------|
| **AuthForm** | Estrutura | ✅ Completa | Abas funcionando |
| **LoginForm** | Validação | ✅ Implementada | Zod + React Hook Form |
| **RegisterForm** | Validação | ✅ Implementada | Confirmação de senha |
| **Schemas** | Centralização | ✅ Configurada | Types automáticos |
| **Styling** | Design | ✅ Finalizado | Matches mockup |
| **Hidratação** | Warnings | ✅ Resolvido | suppressHydrationWarning |
| **Fontes** | Configuração | ✅ Corrigida | Pesos explícitos |
| **Better Auth** | Setup | ✅ Instalado | CLI schema gerado |
| **Form Handlers** | Integração | 🟡 Pendente | Ainda console.log |
| **Base URL Auth** | Environment | 🟡 Pendente | BETTER_AUTH_URL missing |

---

## Próximos Passos

### 1. Conectar Formulários a Better Auth (Priority: ALTA)

**LoginForm:**
```typescript
const auth = useAuth() // ou import { auth } from "@/lib/auth"

const onSubmit = async (data: LoginValues) => {
  try {
    await auth.signIn.email({
      email: data.email,
      password: data.password,
    })
  } catch (error) {
    console.error('Login failed:', error)
  }
}
```

**RegisterForm:**
```typescript
const onSubmit = async (data: RegisterValues) => {
  try {
    await auth.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    })
  } catch (error) {
    console.error('Register failed:', error)
  }
}
```

### 2. Configurar Variáveis de Ambiente (Priority: MÉDIA)

**`.env.local`:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/bearwear
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here
```

### 3. Criar Rotas de API (Priority: MÉDIA)

**`app/api/auth/[...auth]/route.ts`:**
```typescript
import { toNextJsHandler } from "better-auth/next-js"
import { auth } from "@/lib/auth"

export const { POST, GET } = toNextJsHandler(auth)
```

### 4. Migração de Banco de Dados (Priority: ALTA)

```bash
npm run db:migrate
```

Executa migrations do Drizzle para criar tabelas de users/sessions.

### 5. Testes Completos (Priority: MÉDIA)

- Validação de forms
- Integração com Better Auth
- Flow completo de autenticação (sign-up → verificação → login)
- Edge cases

---

## Referências

- **Better Auth**: https://www.better-auth.com/
- **shadcn/ui**: https://shadcn-ui.com/
- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/
- **Drizzle ORM**: https://orm.drizzle.team/

---

**Última Atualização:** 04/04/2026  
**Versão:** 1.0  
**Autor:** GitHub Copilot
