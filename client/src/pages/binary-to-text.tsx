import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Binary } from "lucide-react";

export default function BinaryToText() {
  const [binary, setBinary] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    const binaryChunks = binary.split(" ");
    try {
      const textResult = binaryChunks
        .map((chunk) => {
          if (!/^[01]{1,8}$/.test(chunk)) {
            throw new Error("Invalid binary string");
          }
          return String.fromCharCode(parseInt(chunk, 2));
        })
        .join("");
      setText(textResult);
    } catch (e) {
      setError("Invalid binary input. Please use space-separated 8-bit binary values.");
      setText("");
    }
  };

  const handleClear = () => {
    setBinary("");
    setText("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Binary className="h-6 w-6 text-green-600" />
              Binary to Text Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter binary to convert..."
              value={binary}
              onChange={(e) => setBinary(e.target.value)}
              className="h-32"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2">
              <Button onClick={handleConvert} className="w-full">
                Convert
              </Button>
              <Button
                variant="secondary"
                onClick={handleClear}
                className="w-full"
              >
                Clear
              </Button>
            </div>
            <Textarea
              placeholder="Text output..."
              value={text}
              readOnly
              className="h-32"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
