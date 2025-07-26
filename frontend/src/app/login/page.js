"use client";
import LoginBox from "@/components/DataUsers/dataUser"

export default function LoginPage() {
//  console.log("render loginpage")

  return (
    <main className="pt-24 max-w-xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Connexion</h1>
      <LoginBox />
    </main>
  )
}