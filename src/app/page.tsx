import Image from "next/image";
import logo from "@/assets/logo-note-ai.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();
  if (userId) redirect("/notes");
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Flowbrain logo" width={100} height={100} />
        <span className="text-4xl font-extrabold tracking-tighter lg:text-5xl">
          FlowBrain
        </span>
      </div>
      <p className="max-w-prose text-center">
        An intelligent note-tracking app with AI integration, built with OpenAI,
        Pinecone, Next.js, Shadcn UI, Clerk, and more.
      </p>
      <Button asChild size="lg" className="">
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  );
}
