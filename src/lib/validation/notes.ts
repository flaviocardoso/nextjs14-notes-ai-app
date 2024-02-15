import {z} from "zod";
export const createNoteSchema = z.object({
  title: z.string().min(1, {message: "Title is required"}),
  content: z.string().optional(),
});

type createNoteSchemaType = z.infer<typeof createNoteSchema>;
export type typeCreateNoteSchema = createNoteSchemaType;

export const updateNoteSchema = createNoteSchema.extend({
  id: z.number().min(1)
})

type updateNoteSchemaType = z.infer<typeof updateNoteSchema>
export type typeUpdateNoteSchema = updateNoteSchemaType;

export const deleteNoteSchema = z.object({
  id: z.number().min(1)
})