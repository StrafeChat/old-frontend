"use client";
import { FormEvent, useEffect, useState } from "react";
import cookie from "js-cookie";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tag, setTag] = useState("");
  const [dob, setDOB] = useState<Date | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setTag("0001");
    }, 500);
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log(navigator.language);
    fetch(`${process.env.NEXT_PUBLIC_API_URL!}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        username,
        password,
        locale: navigator.language,
        tag,
        dob,
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
        <h1 className="title">Sign Up</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="title">Email</label>
            <input
              type="text"
              placeholder="username@strafe.chat"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="flex justify-between w-full">
            <div className="flex flex-col w-[35rem]">
              <label className="title">Username</label>
              <input
                className="w-full"
                type="text"
                placeholder="strafe"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="flex flex-col w-[4.5rem]">
              <label className="title">Tag</label>
              <div className="bg-[var(--input)] outline-none rounded-md flex items-center">
                <span className="pl-2 text-gray-500 text-xl font-bold">#</span>
                <input
                  className="w-full text-center"
                  type="text"
                  placeholder="0000"
                  value={tag}
                  onChange={(event) => {
                    if (event.target.value.length > 4)
                      return event.preventDefault();
                    if (
                      !/[0-9]/g.test(
                        event.target.value[event.target.value.length - 1]
                      ) &&
                      event.target.value != ""
                    )
                      return event.preventDefault();
                    setTag(event.target.value);
                  }}
                />
              </div>
            </div>
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
          <div className="flex flex-col">
            <label className="title">Date of Birth</label>
            <div className="flex">
              <input
                type="date"
                onChange={(event) => setDOB(event.target.valueAsDate)}
              />
            </div>
          </div>
          <button className="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
}
