//==============================================
//
//               Math Solver Page
//         Copyright 2025 ProishTheIdiot
//
//         Created on: November 20, 2025   
//               by ProishTheIdiot   
//
//==============================================
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, BrainCircuit, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Tesseract from "tesseract.js";


function CameraView({ onCapture, onClose }: { onCapture: (image: string) => void, onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function getCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        streamRef.current = mediaStream;
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    getCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL("image/png");
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-4 max-w-3xl w-full">
        <video ref={videoRef} autoPlay playsInline className="w-full rounded-md mb-4" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex justify-center gap-4">
          <Button onClick={handleCapture}>Capture</Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

export default function MathSolver() {
  const [image, setImage] = useState<string>("");
  const [extractedText, setExtractedText] = useState("");
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const extractTextFromImage = async (imageSrc: string | File) => {
    setIsLoading(true);
    setExtractedText("Extracting text...");
    toast({
      title: "Extracting Text",
      description: "This may take a moment...",
    });

    try {
      const { data: { text } } = await Tesseract.recognize(imageSrc, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            toast({
              title: "Recognizing Text",
              description: `${Math.round(m.progress * 100)}%`,
            });
          }
        }
      });
      setExtractedText(text);
      toast({
        title: "Text Extracted",
        description: "The extracted text is now available.",
      });
    } catch (error) {
      console.error("Error extracting text:", error);
      setExtractedText("Failed to extract text.");
      toast({
        title: "Error",
        description: "Could not extract text from the image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      setImage(result);
      setExtractedText("");
      setSolution("");
      extractTextFromImage(file);
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
        Problem: ${extractedText}

        This is a dummy solution. The actual solving logic is not implemented yet.
      `);
      setIsLoading(false);
    }, 1500);
  };

  const handleCapture = (capturedImage: string) => {
    setShowCamera(false);
    if (capturedImage) {
      setImage(capturedImage);
      setExtractedText("");
      setSolution("");
      extractTextFromImage(capturedImage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {showCamera && <CameraView onCapture={handleCapture} onClose={() => setShowCamera(false)} />}
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
              <div className="space-y-4">
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
                <div className="text-center">
                  <Button variant="outline" onClick={() => setShowCamera(true)}>
                    <Camera className="mr-2 h-4 w-4" />
                    Take a Picture
                  </Button>
                </div>
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
