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
    <Card className="max-w-md w-full mx-auto shadow-lg border rounded-2xl">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center">
          <Lock className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Secure File Access
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          This file is protected. Enter the password to unlock the preview.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter file password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Unlock File
          </Button>
        </form>

        <div className="flex items-center justify-center text-xs text-muted-foreground gap-1 pt-1">
          <ShieldCheck className="h-4 w-4" />
          <span>This file is securely protected</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordForm;
