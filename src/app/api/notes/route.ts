import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/notes";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { notesIndex } from "@/lib/db/pinecone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = createNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { title, content } = parseResult.data;
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("antes do openai");
    // openai
    const embedding = await getEmbeddingForNote(title, content);
    console.log("depois do openai");
    // transiction
    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: { title, content, userId },
      });
      console.log("antes do pinecone");
      // pinecone insert banco
      await notesIndex.upsert([
        {
          id: String(note.id),
          values: embedding,
          metadata: { userId },
        },
      ]);
      console.log("depis do pinecone");
      return note;
    });
    return Response.json({ note }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseResult = updateNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { id, title, content } = parseResult.data;
    // procura nota se existe
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note)
      return Response.json({ error: "Note not found" }, { status: 404 });
    const { userId } = auth();
    // verifica se a nota pertence ao usuário
    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const embedding = await getEmbeddingForNote(title, content);
    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });
      await notesIndex.upsert([
        {
          id: String(id),
          values: embedding,
          metadata: { userId }
        }
      ]);
      return updatedNote;
    })
    return Response.json({ updatedNote }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseResult = deleteNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { id } = parseResult.data;
    // procura nota se existe
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note)
      return Response.json({ error: "Note not found" }, { status: 404 });
    const { userId } = auth();
    // verifica se a nota pertence ao usuário
    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({
        where: { id },
      });
      await notesIndex.deleteOne(id);
    })
    return Response.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}
