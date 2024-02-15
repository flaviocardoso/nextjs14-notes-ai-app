import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - FlowBrain"
}

export default function Page() {
  return <main className="flex h-screen items-center justify-center">
    <SignIn appearance={{variables: { colorPrimary: "#0F172A" }}}></SignIn>
  </main>;
}
