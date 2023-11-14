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

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const form = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginForm) => {
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
        <form onSubmit={form.handleSubmit(handleSubmit)} method="POST" className="space-y-4 rounded-md">
        <h2 className="text-3xl font-bold text-center">Login</h2>
          <FormField
            control={form.control}
            name={"email"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>EMAIL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email." {...field} />
                </FormControl>
                {/* <FormDescription>This is your username</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"password"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>PASSWORD</FormLabel>
                <FormControl>
                  <Input type={"password"} placeholder="Enter your password." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="bg-[#737d3c] w-full" type="submit"><b>Submit</b></Button>
          <p>Don&apos;t have an account? <a href="/register" className="text-[#737d3c]">Register</a></p>
        </form>
      </Form>
    </div>
  );
}
