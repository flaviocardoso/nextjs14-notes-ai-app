import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Note";

export const metadata: Metadata = {
  title: "notes - FlowBrain",
};

export default async function Page() {
  const { userId } = auth();
  if (!userId) throw new Error("userId undefined");
  const allNotes = await prisma.note.findMany({
    where: { userId },
  });
  return (
    <main className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map(note => (
      <Note key={note.id} note={note} />
    ))}
      {allNotes.length === 0 && (
        <div className="col-span-full text-center">
          {"You don't have anu not yet. Why don't you create one?"}
        </div>
      )}
    </main>
  );
}
