"use client";
import { FormEvent, useEffect, useState } from "react";
import cookie from "js-cookie";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RegisterData {
  email: string;
  username: string;
  password: string;
  tag: string;
  dob: Date;
}

export default function Register() {
  const form = useForm<RegisterData>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      tag: "0001",
      dob: new Date(),
    },
  });

  const handleSubmit = (values: RegisterData) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, locale: navigator.language }),
    }).then(async (res) => {
      const data = await res.json();
      if (data.code == 200) {
        cookie.set("token", data.data);
        window.location.href = "/";
      }
    });
  };

  return (
    <div className="form-wrapper">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <h1 className="title">Register</h1>
          <ul>
            <li>
              <FormField
                control={form.control}
                name="email"
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
            <li className="seperate">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-0 md:w-[35rem]">
                    <FormLabel className="title">Username</FormLabel>
                    <FormControl>
                      <Input type={"text"} placeholder="Strafe" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem className="space-y-0 w-[5rem]">
                    <FormLabel className="title">Tag</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="pl-6"
                          placeholder=""
                          {...field}
                          onChange={(event) => {
                            if (event.target.value.length > 4)
                              return event.preventDefault();
                            if (
                              !/[0-9]/g.test(
                                event.target.value[
                                  event.target.value.length - 1
                                ]
                              ) &&
                              event.target.value != ""
                            )
                              return event.preventDefault();
                            field.onChange(event.target.value);
                          }}
                        />
                        <span className="absolute top-[25%] left-2">#</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </li>
            <li>
              <FormField
                control={form.control}
                name="password"
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
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="title">Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : field.value
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </li>
            <li>
              <Button>Register</Button>
            </li>
            <li>
              <p>
                Already have an account?{" "}
                <Link href="/login" className="text-[#737d3c]">
                  Login
                </Link>
              </p>
            </li>
          </ul>
        </form>
      </Form>
    </div>
  );
}
