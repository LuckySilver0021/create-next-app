"use client";
import { SessionProvider } from "next-auth/react"
export default function Authprovider({children}:any) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
