import { AuthForm } from '@/components/Form/auth-form'

const Authentication = () => {
  return (
    <main className="flex w-full flex-col gap-6 p-5">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </main>
  )
}

export default Authentication
