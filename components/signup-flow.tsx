"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SignupFlowProps {
  children: React.ReactNode
}

export function SignupFlow({ children }: SignupFlowProps) {
  return (
    <Button asChild size="lg">
      <Link href="/auth/signup">{children}</Link>
    </Button>
  )
}
