import { useState, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MathSolver() {
  const [image, setImage] = useState<string>("");
  const [extractedText, setExtractedText] = useState("");
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
      setExtractedText("");
      setSolution("");
      toast({
        title: "Image loaded",
        description: file.name,
      });
      // Dummy extraction for now
      setExtractedText("2x + 5 = 15");
    };

    reader.readAsDataURL(file);
  };

  const handleSolve = async () => {
    if (!extractedText) {
      toast({
        title: "No problem to solve",
        description: "Upload an image with a math problem first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Dummy solution for now
    setTimeout(() => {
      setSolution(`
        Problem: 2x + 5 = 15

        Step 1: Subtract 5 from both sides.
        2x = 15 - 5
        2x = 10

        Step 2: Divide by 2.
        x = 10 / 2
        x = 5

        Solution: x = 5
      `);
      setIsLoading(false);
    }, 1500);
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
              <BrainCircuit className="h-6 w-6 text-purple-600" />
              AI Math Problem Solver
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!image ? (
              <div
                className="border-2 border-dashed rounded-md p-8 text-center hover-elevate cursor-pointer transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop an image of a math problem or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported: JPG, PNG, WEBP
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <img src={image} alt="Math Problem" className="max-w-full max-h-64 mx-auto rounded-md" />
                </div>
                <Textarea
                  placeholder="Extracted math problem will appear here..."
                  value={extractedText}
                  readOnly
                  className="h-24"
                />
                <Button onClick={handleSolve} className="w-full" disabled={isLoading}>
                  {isLoading ? "Solving..." : "Solve Problem"}
                </Button>
              </div>
            )}

            {solution && (
              <Card className="bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-lg">Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap font-sans text-sm">{solution}</pre>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
