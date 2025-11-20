//=============================================
//
//              File Converter Page
//         Copyright 2025 ProishTheIdiot
//
//         Created on: November 18, 2025      
//               by ProishTheIdiot
//
//=============================================
import { useState, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ConversionFormat = "png" | "jpg" | "webp";

export default function FileConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<ConversionFormat>("png");
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setConvertedFile(null);
    }
  };

  const convertFile = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          
          if (!ctx) {
            throw new Error("Failed to get canvas context");
          }
          
          ctx.drawImage(img, 0, 0);

          const mimeType =
            outputFormat === "jpg"
              ? "image/jpeg"
              : outputFormat === "webp"
              ? "image/webp"
              : "image/png";

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setConvertedFile(url);
              toast({
                title: "Conversion successful",
                description: `File converted to ${outputFormat.toUpperCase()}`,
              });
              setIsConverting(false);
            } else {
              toast({
                title: "Conversion failed",
                description: "Failed to create blob from canvas",
                variant: "destructive",
              });
              setIsConverting(false);
            }
          }, mimeType);
        };
        
        img.onerror = () => {
          toast({
            title: "Invalid image",
            description: "The selected file is not a valid image",
            variant: "destructive",
          });
          setIsConverting(false);
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => {
        toast({
          title: "File read error",
          description: "Failed to read the selected file",
          variant: "destructive",
        });
        setIsConverting(false);
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "An error occurred during conversion",
        variant: "destructive",
      });
      setIsConverting(false);
    }
  };

  const downloadFile = () => {
    if (!convertedFile) return;
    const a = document.createElement("a");
    a.href = convertedFile;
    a.download = `converted.${outputFormat}`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              File Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className="border-2 border-dashed rounded-md p-8 text-center hover-elevate cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
              data-testid="dropzone-file-upload"
            >
              <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                {selectedFile ? selectedFile.name : "Drop files here or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground">
                Supported: Images (PNG, JPG, WEBP)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
                data-testid="input-file"
              />
            </div>

            {selectedFile && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Convert to:
                  </label>
                  <Select
                    value={outputFormat}
                    onValueChange={(value) => setOutputFormat(value as ConversionFormat)}
                  >
                    <SelectTrigger data-testid="select-output-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="webp">WEBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={convertFile}
                  disabled={isConverting}
                  className="w-full"
                  data-testid="button-convert"
                >
                  {isConverting ? "Converting..." : "Convert File"}
                </Button>

                {convertedFile && (
                  <Button
                    onClick={downloadFile}
                    variant="outline"
                    className="w-full"
                    data-testid="button-download"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Converted File
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
