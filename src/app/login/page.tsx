"use client";
import { FormEvent, useState } from "react";
import cookie from "js-cookie";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import RepeatedBackground from "@/components/RepeatedBackground";
import Link from "next/link";

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const form = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginData) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL!}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    }).then(async (res) => {
      const data = await res.json();
      console.log(data);
      if (data.code == 200) {
        cookie.set("token", data.data);
        window.location.href = "/";
      }
    });
  };

  return (
    <div className="form-wrapper">
      <RepeatedBackground />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <h1 className="title">Login</h1>
          <ul>
            <li>
              <FormField
                control={form.control}
                name={"email"}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="title">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="username@strafe.chat"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </li>
            <li>
              <FormField
                control={form.control}
                name={"password"}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="title">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </li>
            <li>
              <Button>Login</Button>
            </li>
            <li>
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-[#737d3c]">
                  Register
                </Link>
              </p>
            </li>
          </ul>
        </form>
      </Form>
    </div>
  );
}
