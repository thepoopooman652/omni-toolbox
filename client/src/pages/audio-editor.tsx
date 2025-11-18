import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, AudioLines, Upload, Play, Pause, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WaveSurfer from "wavesurfer.js";

export default function AudioEditor() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([1]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "hsl(var(--muted-foreground))",
        progressColor: "hsl(var(--primary))",
        cursorColor: "hsl(var(--primary))",
        barWidth: 2,
        barRadius: 3,
        height: 128,
      });

      wavesurferRef.current.on("play", () => setIsPlaying(true));
      wavesurferRef.current.on("pause", () => setIsPlaying(false));
      wavesurferRef.current.on("audioprocess", (time) => setCurrentTime(time));
      wavesurferRef.current.on("ready", () => {
        setDuration(wavesurferRef.current?.getDuration() || 0);
      });
    }

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setAudioFile(file);

    if (wavesurferRef.current) {
      const url = URL.createObjectURL(file);
      await wavesurferRef.current.load(url);
      toast({
        title: "Audio loaded",
        description: file.name,
      });
    }
  };

  const togglePlayback = () => {
    wavesurferRef.current?.playPause();
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    wavesurferRef.current?.setVolume(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const exportAudio = async () => {
    if (!wavesurferRef.current) return;

    const blob = await wavesurferRef.current.exportPCM();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited-audio.wav";
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
              <AudioLines className="h-6 w-6 text-pink-600" />
              Audio Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!audioFile ? (
              <div
                className="border-2 border-dashed rounded-md p-8 text-center hover-elevate cursor-pointer transition-colors"
                onClick={() => fileInputRef.current?.click()}
                data-testid="dropzone-audio-upload"
              >
                <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop audio file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported: MP3, WAV, OGG
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  data-testid="input-file"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  ref={waveformRef}
                  className="bg-muted rounded-md"
                  data-testid="waveform-display"
                />

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span data-testid="text-current-time">{formatTime(currentTime)}</span>
                  <span data-testid="text-duration">{formatTime(duration)}</span>
                </div>

                <div className="flex gap-2">
                  <Button onClick={togglePlayback} data-testid="button-play-pause">
                    {isPlaying ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Play
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={exportAudio}
                    variant="outline"
                    data-testid="button-export"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Volume: {Math.round(volume[0] * 100)}%
                  </label>
                  <Slider
                    value={volume}
                    onValueChange={handleVolumeChange}
                    max={2}
                    step={0.1}
                    data-testid="slider-volume"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
