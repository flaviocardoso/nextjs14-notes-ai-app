"use client";
import { Note as NoteModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import AddEditNoteDialog from "./AddEditNoteDialog";
import { useState } from "react";

interface NoteProps {
  note: NoteModel;
}
export default function Note({ note }: NoteProps) {
  const [showEditditDialog, setShowEditditDialog] = useState(false);
  const wasUpdated = note.updateAt > note.createAt;
  const createdUpdateAtTimestamp = (
    wasUpdated ? note.updateAt : note.createAt
  ).toDateString();
  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => {
          setShowEditditDialog(true);
        }}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>
            {createdUpdateAtTimestamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{note.content}</p>
        </CardContent>
      </Card>
      {showEditditDialog && (
        <AddEditNoteDialog
          open={showEditditDialog}
          setOpen={setShowEditditDialog}
          noteToEdit={note}
        />
      )}
    </>
  );
}
