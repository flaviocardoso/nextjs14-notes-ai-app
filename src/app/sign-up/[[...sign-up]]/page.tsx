import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - FlowBrain"
}

export default function Page() {
  return <main className="flex h-screen items-center justify-center">
    <SignUp appearance={{variables: { colorPrimary: "#0F172A" }}}></SignUp>
  </main>;
}
