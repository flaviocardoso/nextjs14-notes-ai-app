"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo-note-ai.png";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import AIChatButton from "@/components/AIChatButton";

interface NavbarProps {}

export default function Navbar({}: NavbarProps) {
  const { theme } = useTheme();
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  return (
    <>
      <header className="p-4 shadow">
        <nav className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/notes" className="flex items-center gap-1">
            <Image src={logo} alt="Flowbrain logo" width={40} height={40} />
            <span className="font-bold">FlowBrain</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
              }}
            />
            <ThemeToggleButton />
            <Button
              onClick={() => {
                setShowAddNoteDialog(true);
              }}
            >
              <Plus size={20} className="mr-2" />
              Add note
            </Button>
            <AIChatButton  />
          </div>
        </nav>
      </header>
      {showAddNoteDialog && (
        <AddEditNoteDialog
          open={showAddNoteDialog}
          setOpen={setShowAddNoteDialog}
        />
      )}
    </>
  );
}
