//=============================================
//=                                           =
//=            Wikipedia Search Page          =
//=        Copyright 2025 ProishTheIdiot      =
//=                                           =
//=        Created on: November 18, 2025      =
//=              by ProishTheIdiot            =
//=                                           =
//=============================================
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Search, ExternalLink, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface SearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

interface WikipediaResponse {
  query?: {
    search: SearchResult[];
  };
}

export default function Wikipedia() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<WikipediaResponse>({
    queryKey: ['/wikipedia/search', activeSearch],
    enabled: activeSearch.length > 0,
    queryFn: async () => {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          activeSearch
        )}&format=json&origin=*&srlimit=10`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch Wikipedia results');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Search failed",
        description: "Unable to connect to Wikipedia",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setActiveSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const results = data?.query?.search || [];

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
              <Search className="h-6 w-6 text-purple-600" />
              Wikipedia Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="Search Wikipedia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                data-testid="input-search"
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                data-testid="button-search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" data-testid="alert-error">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Unable to connect to Wikipedia. Please check your internet connection and try again.
                </AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <div className="text-center py-8 text-muted-foreground" data-testid="text-loading">
                Searching...
              </div>
            )}

            {!isLoading && !error && activeSearch && results.length === 0 && (
              <div className="text-center py-8 text-muted-foreground" data-testid="text-no-results">
                No results found. Try a different search term.
              </div>
            )}

            {!isLoading && !error && results.length > 0 && (
              <div className="space-y-4">
                {results.map((result) => (
                  <Card key={result.pageid} data-testid={`result-${result.pageid}`}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {result.title}
                      </h3>
                      <p
                        className="text-sm text-muted-foreground mb-3"
                        dangerouslySetInnerHTML={{
                          __html: result.snippet,
                        }}
                      />
                      <a
                        href={`https://en.wikipedia.org/?curid=${result.pageid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary hover-elevate"
                        data-testid={`link-article-${result.pageid}`}
                      >
                        Read article
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
