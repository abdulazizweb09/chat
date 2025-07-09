"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  function validateForm() {
    if (name.length < 3) {
      toast.error("Ism kamida 3 ta belgidan iborat bo'lishi kerak");
      return false;
    }
    if (email.length < 5 || !email.includes("@")) {
      toast.error("Email noto‘g‘ri formatda");
      return false;
    }
    if (password.length < 6) {
      toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Parollar mos emas");
      return false;
    }
    return true;
  }

  function handleRegister(e) {
    e.preventDefault();

    if (!validateForm()) return;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        sendEmailVerification(user)
          .then(() => {
            toast.success(
              "Tasdiqlash emaili yuborildi! Iltimos, emailingizni tasdiqlang."
            );
          })
          .catch((error) => {
            toast.error("Tasdiqlovchi email yuborilmadi: " + error.message);
          });
      })
      .catch((error) => {
        toast.error("Ro‘yxatdan o‘tishda xatolik: " + error.message);
      });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        toast.success("Email tasdiqlandi!");
        router.push("/");
      }
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-md mx-auto mt-10 space-y-6 p-6 border rounded-2xl shadow-lg"
    >
      <div>
        <Label htmlFor="username">Ism</Label>
        <Input
          id="username"
          name="username"
          placeholder="Ismingizni kiriting"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Emailingizni kiriting"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Parol</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Parol kiriting"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="confirm-password">Parolni tasdiqlang</Label>
        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="Parolni qayta kiriting"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Ro‘yxatdan o‘tish
      </Button>
    </form>
  );
}
