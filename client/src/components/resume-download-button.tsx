import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ResumeDownloadButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/resume/download");
      
      if (response.status === 401) {
        toast({
          title: "API Key Required",
          description: "PDF generation requires a valid OpenAI API key. Please configure your API key to enable downloads.",
          variant: "destructive",
        });
        return;
      }
      
      if (!response.ok) {
        throw new Error("Download failed");
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        // Placeholder response - show helpful message
        toast({
          title: "Feature Coming Soon",
          description: "PDF generation will be available once your OpenAI API key is configured.",
        });
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Resume Downloaded",
        description: "Your PDF resume has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the resume. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        data-testid="button-download-resume"
        className="rounded-full backdrop-blur-md shadow-lg transition-shadow duration-200 gap-2"
        size="lg"
      >
        {isDownloading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="h-5 w-5" />
            Download Resume
          </>
        )}
      </Button>
    </div>
  );
}
