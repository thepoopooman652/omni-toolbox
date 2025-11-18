import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileCode } from "lucide-react";
import { marked } from "marked";

export default function Preview() {
  const [markdownContent, setMarkdownContent] = useState("# Hello World\n\nThis is a **markdown** preview tool.");
  const [htmlContent, setHtmlContent] = useState("<h1>Hello World</h1>\n<p>This is an <strong>HTML</strong> preview tool.</p>");

  const renderMarkdown = () => {
    try {
      return { __html: marked(markdownContent) as string };
    } catch (error) {
      return { __html: "<p>Error rendering markdown</p>" };
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
              <FileCode className="h-6 w-6 text-teal-600" />
              Markdown & HTML Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="markdown">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="markdown" data-testid="tab-markdown">
                  Markdown
                </TabsTrigger>
                <TabsTrigger value="html" data-testid="tab-html">
                  HTML
                </TabsTrigger>
              </TabsList>

              <TabsContent value="markdown">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Editor</label>
                    <Textarea
                      value={markdownContent}
                      onChange={(e) => setMarkdownContent(e.target.value)}
                      className="font-mono min-h-96 resize-none"
                      placeholder="Enter markdown..."
                      data-testid="textarea-markdown-editor"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preview</label>
                    <div
                      className="border rounded-md p-4 min-h-96 overflow-auto prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={renderMarkdown()}
                      data-testid="preview-markdown"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="html">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Editor</label>
                    <Textarea
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      className="font-mono min-h-96 resize-none"
                      placeholder="Enter HTML..."
                      data-testid="textarea-html-editor"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preview</label>
                    <div
                      className="border rounded-md p-4 min-h-96 overflow-auto"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                      data-testid="preview-html"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
