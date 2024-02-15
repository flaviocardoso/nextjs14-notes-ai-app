"use server";

import {
  createNoteSchema,
  deleteNoteSchema,
  typeCreateNoteSchema,
  typeUpdateNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/notes";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export async function createNotePosting(values : typeCreateNoteSchema) {
  const { title, content } = createNoteSchema.parse(values);
  const { userId } = auth();
  if (!userId) throw Error("Unauthorized");
  await prisma.note.create({
    data: { title, content, userId },
  });

  revalidatePath("/notes", "page");
}

export async function updateNotePosting(values: typeUpdateNoteSchema) {
  const { id, title, content } = updateNoteSchema.parse(values);
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw Error("Note not found");
  const { userId } = auth();
  // verifica se a nota pertence ao usuário
  if (!userId || userId !== note.userId) throw Error("Unauthorized");
  await prisma.note.update({
    where: { id },
    data: {
      title,
      content,
    },
  });
  revalidatePath("/notes", "page");
}

export async function deleteNotePosting(noteId: number) {
  const { id } = deleteNoteSchema.parse({ id: noteId });
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw Error("Note not found");
  const { userId } = auth();
  // verifica se a nota pertence ao usuário
  if (!userId || userId !== note.userId) throw Error("Unauthorized");
  await prisma.note.delete({
    where: { id },
  });
  revalidatePath("/notes", "page");
}
