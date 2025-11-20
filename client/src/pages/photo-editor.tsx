import { useState, useRef } from "react";
import { Link } from "wouter";
//=============================================
//
//               Photo Editor Page
//         Copyright 2025 ProishTheIdiot
//
//         Created on: November 18, 2025      
//               by ProishTheIdiot
//
//=============================================
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Image as ImageIcon, Upload, Download, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Cropper, ReactCropperElement } from "react-cropper";

export default function PhotoEditor() {
  const [image, setImage] = useState<string>("");
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  
  const cropperRef = useRef<ReactCropperElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
      toast({
        title: "Image loaded",
        description: file.name,
      });
    };

    reader.readAsDataURL(file);
  };

  const rotateImage = () => {
    cropperRef.current?.cropper.rotate(90);
  };

  const cropImage = () => {
    if (cropperRef.current) {
      const cropped = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
      setImage(cropped);
    }
  };

  const downloadImage = () => {
    if (!cropperRef.current) return;

    const canvas = cropperRef.current.cropper.getCroppedCanvas();
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`;
      ctx.drawImage(canvas, 0, 0);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "edited-photo.png";
        a.click();
      }
    });
  };

  const filterStyle = {
    filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-indigo-600" />
              Photo Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!image ? (
              <div
                className="border-2 border-dashed rounded-md p-8 text-center hover-elevate cursor-pointer transition-colors"
                onClick={() => fileInputRef.current?.click()}
                data-testid="dropzone-image-upload"
              >
                <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop image here or click to browse
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
                  data-testid="input-file"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Cropper
                    ref={cropperRef}
                    src={image}
                    style={{ height: 400, width: "100%", ...filterStyle }}
                    guides={true}
                    data-testid="cropper-canvas"
                  />
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Brightness: {brightness[0]}%
                      </label>
                      <Slider
                        value={brightness}
                        onValueChange={setBrightness}
                        min={0}
                        max={200}
                        data-testid="slider-brightness"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Contrast: {contrast[0]}%
                      </label>
                      <Slider
                        value={contrast}
                        onValueChange={setContrast}
                        min={0}
                        max={200}
                        data-testid="slider-contrast"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Saturation: {saturation[0]}%
                      </label>
                      <Slider
                        value={saturation}
                        onValueChange={setSaturation}
                        min={0}
                        max={200}
                        data-testid="slider-saturation"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={rotateImage}
                      variant="outline"
                      className="w-full"
                      data-testid="button-rotate"
                    >
                      <RotateCw className="mr-2 h-4 w-4" />
                      Rotate 90°
                    </Button>
                    <Button
                      onClick={cropImage}
                      variant="outline"
                      className="w-full"
                      data-testid="button-crop"
                    >
                      Apply Crop
                    </Button>
                    <Button
                      onClick={downloadImage}
                      className="w-full"
                      data-testid="button-download"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
