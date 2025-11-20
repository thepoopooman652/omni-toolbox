import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Scale,
  Search,
  Calculator,
  Table,
  Mic,
  AudioLines,
  Image as ImageIcon,
  FileCode,
  Binary,
} from "lucide-react";

interface Tool {
  name: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

const tools: Tool[] = [
  {
    name: "File Converter",
    description: "Convert files between different formats",
    icon: FileText,
    path: "/file-converter",
    color: "text-blue-600",
  },
  {
    name: "Unit Converter",
    description: "Convert between various units of measurement",
    icon: Scale,
    path: "/unit-converter",
    color: "text-green-600",
  },
  {
    name: "Wikipedia Search",
    description: "Search and explore Wikipedia articles",
    icon: Search,
    path: "/wikipedia",
    color: "text-purple-600",
  },
  {
    name: "Calculator",
    description: "Scientific calculator with graphing",
    icon: Calculator,
    path: "/calculator",
    color: "text-orange-600",
  },
  {
    name: "Data Viewer",
    description: "View JSON, CSV, YAML, and XML files",
    icon: Table,
    path: "/data-viewer",
    color: "text-cyan-600",
  },
  {
    name: "Audio Recorder",
    description: "Record audio from your microphone",
    icon: Mic,
    path: "/audio-recorder",
    color: "text-red-600",
  },
  {
    name: "Audio Editor",
    description: "Edit and modify audio files",
    icon: AudioLines,
    path: "/audio-editor",
    color: "text-pink-600",
  },
  {
    name: "Photo Editor",
    description: "Edit images with crop, filters, and more",
    icon: ImageIcon,
    path: "/photo-editor",
    color: "text-indigo-600",
  },
  {
    name: "Preview Tool",
    description: "Preview Markdown and HTML files",
    icon: FileCode,
    path: "/preview",
    color: "text-teal-600",
  },
  {
    name: "Text to Binary",
    description: "Convert text to binary representation",
    icon: Binary,
    path: "/text-to-binary",
    color: "text-blue-600",
  },
  {
    name: "Binary to Text",
    description: "Convert binary to text representation",
    icon: Binary,
    path: "/binary-to-text",
    color: "text-green-600",
  },
  {
    name: "Text to Hex",
    description: "Convert text to hexadecimal representation",
    icon: Binary,
    path: "/text-to-hex",
    color: "text-yellow-600",
  },
  {
    name: "Hex to Text",
    description: "Convert hexadecimal to text representation",
    icon: Binary,
    path: "/hex-to-text",
    color: "text-red-600",
  },
  {
    name: "Math Solver",
    description: "Solve math problems from an image",
    icon: Calculator,
    path: "/math-solver",
    color: "text-yellow-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-app-title">
            Multi-Tool Suite
          </h1>
          <p className="text-muted-foreground text-lg">
            All-in-one utility toolkit for your daily tasks
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link 
              key={tool.path} 
              href={tool.path}
              data-testid={`link-tool-${tool.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Card
                className="hover-elevate active-elevate-2 cursor-pointer transition-all h-full"
                data-testid={`card-tool-${tool.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <tool.icon
                    className={`h-12 w-12 ${tool.color}`}
                    data-testid={`icon-${tool.name.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                  <div>
                    <h2 className="text-lg font-semibold mb-1">{tool.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
