"use client";

import { useState } from "react";
import FilePreview from "./FilePreview";
import FileDetails from "@/types/FileType";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { ShieldCheck, Lock, AlertCircle } from "lucide-react";

const PasswordForm = ({ file }: { file: FileDetails }) => {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === file.password) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  if (unlocked) return <FilePreview file={file} />;

  return (
    <Card className="max-w-md w-full mx-auto rounded-2xl border bg-background shadow-xl">
      <CardHeader className="text-center space-y-2 pb-0">
        <div className="flex justify-center">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          Secure File Access
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          This file is protected. Enter the password to continue.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {error && (
          <Alert
            variant="destructive"
            className="flex items-start gap-2 text-sm"
          >
            <AlertCircle className="h-4 w-4 mt-[2px]" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter file password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-muted/30 focus-visible:ring-1 focus-visible:ring-ring"
            required
          />
          <Button type="submit" className="w-full">
            Unlock File
          </Button>
        </form>

        <div className="flex items-center justify-center text-xs text-muted-foreground gap-1 pt-2">
          <ShieldCheck className="h-4 w-4" />
          <span>This file is encrypted and secure</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordForm;
