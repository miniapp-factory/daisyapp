"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/components/ui/utils";

export default function Voting() {
  type Candidate = {
    id: number;
    name: string;
    image: string | null;
    votes: number;
  };

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addCandidate = () => {
    if (!nameInput.trim()) return;
    const newCandidate: Candidate = {
      id: Date.now(),
      name: nameInput.trim(),
      image: imagePreview,
      votes: 0,
    };
    setCandidates((prev) => [...prev, newCandidate]);
    setNameInput("");
    setImageFile(null);
    setImagePreview(null);
  };

  const vote = (id: number) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, votes: c.votes + 1 } : c))
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Add Candidate (Admin)</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4 items-center">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Candidate name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 items-center">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {imagePreview && (
            <div className="flex justify-center">
              <Avatar className="size-24">
                <AvatarImage src={imagePreview} alt={nameInput} />
                <AvatarFallback>{nameInput.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={addCandidate}>Add Candidate</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Candidates</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          {candidates.map((c) => (
            <div
              key={c.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border",
                c.votes > 0 && "bg-green-50"
              )}
            >
              <div className="flex items-center gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={c.image ?? ""} alt={c.name} />
                  <AvatarFallback>{c.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Votes: {c.votes}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => vote(c.id)}>
                Vote
              </Button>
            </div>
          ))}
          {candidates.length === 0 && (
            <p className="text-center text-muted-foreground">
              No candidates added yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
