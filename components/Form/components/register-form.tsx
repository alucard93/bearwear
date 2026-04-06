'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'

import { registerSchema, type RegisterValues } from '../schema/auth-schemas'

export function RegisterForm() {
  const router = useRouter()

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: RegisterValues) => {
    try {
      const { error } = await authClient.signUp.email({
        name: values.name, // required
        email: values.email, // required
        password: values.password, // required
        fetchOptions: {
          onSuccess: () => {
            router.push('/')
          },
        },
      })

      if (error) {
        toast.error(error.message ?? 'Ocorreu um erro ao criar a conta.')

        return
      }

      toast.success('Conta criada com sucesso! Faça login para continuar.')
      form.reset()

      // REDIRECT TO LOGIN
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro ao criar a conta.',
      )
    }
  }

  return (
    <form className=" space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="register-name">Nome</FieldLabel>
                  <Input
                    {...field}
                    id="register-name"
                    autoComplete="name"
                    placeholder="Seu nome"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="register-email">E-mail</FieldLabel>
                  <Input
                    {...field}
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
        </div>

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="register-password">Senha</FieldLabel>
                <Input
                  {...field}
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mínimo de 8 caracteres"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>Mínimo de 8 caracteres.</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="register-confirm-password">
                  Confirmar senha
                </FieldLabel>
                <Input
                  {...field}
                  id="register-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repita sua senha"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>

      <Button className="w-full" type="submit">
        Criar conta
      </Button>
    </form>
  )
}
