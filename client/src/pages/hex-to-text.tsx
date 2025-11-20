//=============================================
//
//               Hex to Text Page
//         Copyright 2025 ProishTheIdiot
//
//         Created on: November 18, 2025      
//               by ProishTheIdiot
//
//=============================================
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, Check } from "lucide-react";

export default function HexToText() {
  const [hex, setHex] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError("");
    const hexChunks = hex.split(" ");
    try {
      const textResult = hexChunks
        .map((chunk) => {
          if (!/^[0-9a-fA-F]{1,2}$/.test(chunk)) {
            throw new Error("Invalid hexadecimal string");
          }
          return String.fromCharCode(parseInt(chunk, 16));
        })
        .join("");
      setText(textResult);
    } catch (e) {
      setError("Invalid hexadecimal input. Please use space-separated 2-digit hex values.");
      setText("");
    }
  };

  const handleClear = () => {
    setHex("");
    setText("");
    setError("");
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
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
              <span className="h-6 w-6 text-yellow-600">#</span>
              Hexadecimal to Text Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter hexadecimal to convert..."
              value={hex}
              onChange={(e) => setHex(e.target.value)}
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
            <div className="relative">
              <Textarea
                placeholder="Text output..."
                value={text}
                readOnly
                className="h-32 pr-12"
              />
              {text && (
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
