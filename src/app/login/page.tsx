"use client";
import { FormEvent, useState } from "react";
import cookie from "js-cookie";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const form = useForm<LoginForm>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginForm) => {
    // event.preventDefault();

    // fetch(`${process.env.NEXT_PUBLIC_API_URL!}/auth/login`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     email,
    //     password,
    //   }),
    // }).then(async (res) => {
    //   const data = await res.json();
    //   console.log(data);
    //   if (data.code == 200) {
    //     cookie.set("token", data.data);
    //     window.location.href = "/";
    //   }
    // });
  };

  return (
    <div className="form-wrapper">
      <Form>
        <div></div>
      </Form>
      {/* <form onSubmit={(event) => handleSubmit(event)}>
        <h1 className="title">Login</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <Label className="title py-1">Email</Label>
            <Input
              type="text"
              placeholder="username@strafe.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <Label className="title py-1">Password</Label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button className="submit">Login</button>
        </div>
      </form> */}
    </div>
  );
}
