import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Binary } from "lucide-react";

export default function TextToBinary() {
  const [text, setText] = useState("");
  const [binary, setBinary] = useState("");

  const handleConvert = () => {
    const binaryResult = text
      .split("")
      .map((char) => {
        const binaryChar = char.charCodeAt(0).toString(2);
        return "0".repeat(8 - binaryChar.length) + binaryChar;
      })
      .join(" ");
    setBinary(binaryResult);
  };

  const handleClear = () => {
    setText("");
    setBinary("");
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
              <Binary className="h-6 w-6 text-blue-600" />
              Text to Binary Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter text to convert..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-32"
            />
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
              placeholder="Binary output..."
              value={binary}
              readOnly
              className="h-32"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
