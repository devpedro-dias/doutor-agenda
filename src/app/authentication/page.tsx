"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/_components/ui/tabs";

import { Button } from "@/src/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/_components/ui/card";
import SignupForm from "./_components/signup-form";

const AuthenticationPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="login">
          <TabsList className="w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Fazer login</CardTitle>
                <CardDescription>
                  Entre com uma conta para continuar.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6"></CardContent>
              <CardFooter>
                <Button>Fazer login</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthenticationPage;
