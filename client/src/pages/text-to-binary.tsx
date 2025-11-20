//=============================================
//
//           Text to Binary Converter
//         Copyright 2025 ProishTheIdiot
//
//         Created on: November 18, 2025      
//
//=============================================
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Binary, Copy, Check } from "lucide-react";

export default function TextToBinary() {
  const [text, setText] = useState("");
  const [binary, setBinary] = useState("");
  const [copied, setCopied] = useState(false);

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
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(binary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <div className="relative">
              <Textarea
                placeholder="Binary output..."
                value={binary}
                readOnly
                className="h-32 pr-12"
              />
              {binary && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
