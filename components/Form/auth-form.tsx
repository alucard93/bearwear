import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { LoginForm } from './components/login-form'
import { RegisterForm } from './components/register-form'

export function AuthForm() {
  return (
    <div className="flex w-full justify-center">
      <Tabs
        defaultValue="sign-in"
        className="w-full max-w-md flex flex-col gap-4"
      >
        {/* Tabs Header */}
        <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg">
          <TabsTrigger
            value="sign-in"
            className="
              rounded-md px-4 py-2 text-sm font-medium
              transition-all duration-200
              data-[state=active]:bg-background
              data-[state=active]:shadow-sm
              data-[state=active]:text-foreground
              data-[state=inactive]:text-muted-foreground
            "
          >
            Entrar
          </TabsTrigger>

          <TabsTrigger
            value="sign-up"
            className="
              rounded-md px-4 py-2 text-sm font-medium
              transition-all duration-200
              data-[state=active]:bg-background
              data-[state=active]:shadow-sm
              data-[state=active]:text-foreground
              data-[state=inactive]:text-muted-foreground
            "
          >
            Criar conta
          </TabsTrigger>
        </TabsList>

        {/* LOGIN */}
        <TabsContent
          value="sign-in"
          className="
            w-full
            data-[state=active]:animate-in
            data-[state=active]:fade-in
            data-[state=active]:zoom-in-95
          "
        >
          <Card className="border bg-background/95 shadow-lg backdrop-blur">
            <CardContent className="p-6">
              <LoginForm />
            </CardContent>
          </Card>
        </TabsContent>

        {/* REGISTER */}
        <TabsContent
          value="sign-up"
          className="
            w-full
            data-[state=active]:animate-in
            data-[state=active]:fade-in
            data-[state=active]:zoom-in-95
          "
        >
          <Card className="border bg-background/95 shadow-lg backdrop-blur">
            <CardContent className="p-6">
              <RegisterForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
