"use client";
import { FormEvent, useState } from "react";
import cookie from "js-cookie";
import { redirect } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log(email, password);

    fetch("http://localhost:3001/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
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
      <form onSubmit={(event) => handleSubmit(event)}>
        <h1 className="title">Login</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="title">Email</label>
            <input
              type="text"
              placeholder="username@strafe.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="title">Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button className="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
