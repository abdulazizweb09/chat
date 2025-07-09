"use client";
import { useRouter } from "next/navigation";
import React from "react";

function Page() {
  let router = useRouter()
  function to() {
    router.push("/register");
  }

  return (
    <div>
      <button className="border mx-auto container cursor-pointer h-20" onClick={to}>register</button>
    </div>
  );
}

export default Page;
