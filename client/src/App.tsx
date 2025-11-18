import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import FileConverter from "@/pages/file-converter";
import UnitConverter from "@/pages/unit-converter";
import Wikipedia from "@/pages/wikipedia";
import Calculator from "@/pages/calculator";
import DataViewer from "@/pages/data-viewer";
import AudioRecorder from "@/pages/audio-recorder";
import AudioEditor from "@/pages/audio-editor";
import PhotoEditor from "@/pages/photo-editor";
import Preview from "@/pages/preview";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/file-converter" component={FileConverter} />
      <Route path="/unit-converter" component={UnitConverter} />
      <Route path="/wikipedia" component={Wikipedia} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/data-viewer" component={DataViewer} />
      <Route path="/audio-recorder" component={AudioRecorder} />
      <Route path="/audio-editor" component={AudioEditor} />
      <Route path="/photo-editor" component={PhotoEditor} />
      <Route path="/preview" component={Preview} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
