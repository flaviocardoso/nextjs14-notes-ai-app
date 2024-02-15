import {
  createNoteSchema,
  typeCreateNoteSchema,
  typeUpdateNoteSchema,
} from "@/lib/validation/notes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";

interface AddEditNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
}
export default function AddEditNoteDialog({
  open,
  setOpen,
  noteToEdit,
}: AddEditNoteDialogProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();
  const form = useForm<typeCreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = form;

  const onSubmit = handleSubmit(
    async (values: typeCreateNoteSchema) => {
      // const formData: any = new FormData();
      // const {title, content} = values;
      try {
        if (noteToEdit) {
          const response = await fetch("/api/notes", {
            method: "PUT",
            body: JSON.stringify({ id: noteToEdit.id, ...values }),
          });
          if (!response.ok) throw Error("Status code: " + response.status);
        } else {
          const response = await fetch("/api/notes", {
            method: "POST",
            body: JSON.stringify(values),
          });
          if (!response.ok) throw Error("Status code: " + response.status);
          reset();
        }
        router.refresh();
        setOpen(false);
      } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again.");
      }
    },
    (isValid) => {
      // verifica se tem campos a mais
      // pode ser usado para mensagems também, com toasters
      // console.log(isValid);
    },
  );

  async function deleteNote() {
    if (!noteToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({ id: noteToEdit.id }),
      });
      if (!response.ok) throw Error("Status code: " + response.status);
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {noteToEdit?.id ? "Edit Note" : "Add Note"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-3" onSubmit={onSubmit}>
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {noteToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={isSubmitting}
                  onClick={deleteNote}
                  type="button"
                >
                  Delete note
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={isSubmitting}
                disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
