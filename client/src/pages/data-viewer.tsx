//=============================================
//
//               Data Viewer Page
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Table as TableIcon, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Papa from "papaparse";
import yaml from "js-yaml";
import { XMLParser } from "fast-xml-parser";

type DataRow = Record<string, any>;

export default function DataViewer() {
  const [data, setData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileType, setFileType] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const fileName = file.name.toLowerCase();
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      
      try {
        if (fileName.endsWith(".json")) {
          const parsed = JSON.parse(content);
          const dataArray = Array.isArray(parsed) ? parsed : [parsed];
          processData(dataArray, "JSON");
        } else if (fileName.endsWith(".csv")) {
          Papa.parse(content, {
            header: true,
            complete: (results) => {
              processData(results.data as DataRow[], "CSV");
            },
          });
        } else if (fileName.endsWith(".yaml") || fileName.endsWith(".yml")) {
          const parsed = yaml.load(content);
          const dataArray = Array.isArray(parsed) ? parsed : [parsed];
          processData(dataArray, "YAML");
        } else if (fileName.endsWith(".xml")) {
          const parser = new XMLParser();
          const parsed = parser.parse(content);
          const dataArray = extractArrayFromXML(parsed);
          processData(dataArray, "XML");
        } else {
          toast({
            title: "Unsupported format",
            description: "Please upload JSON, CSV, YAML, or XML files",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Parse error",
          description: "Failed to parse the file",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
  };

  const extractArrayFromXML = (obj: any): DataRow[] => {
    if (Array.isArray(obj)) return obj;
    if (typeof obj === "object") {
      const values = Object.values(obj);
      for (const value of values) {
        if (Array.isArray(value)) return value;
        if (typeof value === "object") {
          const nested = extractArrayFromXML(value);
          if (nested.length > 0) return nested;
        }
      }
      return [obj];
    }
    return [];
  };

  const processData = (dataArray: DataRow[], type: string) => {
    if (dataArray.length > 0) {
      const cols = Object.keys(dataArray[0]);
      setColumns(cols);
      setData(dataArray);
      setFileType(type);
      toast({
        title: "File loaded",
        description: `Successfully loaded ${dataArray.length} rows`,
      });
    }
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
              <TableIcon className="h-6 w-6 text-cyan-600" />
              Data Viewer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className="border-2 border-dashed rounded-md p-8 text-center hover-elevate cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
              data-testid="dropzone-data-upload"
            >
              <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drop data file here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supported: JSON, CSV, YAML, XML
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".json,.csv,.yaml,.yml,.xml"
                onChange={handleFileSelect}
                data-testid="input-file"
              />
            </div>

            {data.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground" data-testid="text-row-count">
                    Showing {data.length} rows ({fileType} format)
                  </p>
                </div>

                <div className="border rounded-md overflow-auto max-h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((col) => (
                          <TableHead key={col} className="font-semibold">
                            {col}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, idx) => (
                        <TableRow key={idx} data-testid={`row-${idx}`}>
                          {columns.map((col) => (
                            <TableCell key={col}>
                              {typeof row[col] === "object"
                                ? JSON.stringify(row[col])
                                : String(row[col] ?? "")}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
