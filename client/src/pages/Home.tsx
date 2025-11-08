import { useState, useRef } from "react";
import URLInput from "@/components/URLInput";
import PreviewSection from "@/components/PreviewSection";
import MetaTagsList from "@/components/MetaTagsList";
import { SEODashboard } from "@/components/SEODashboard";
import { CategoryOverview } from "@/components/CategoryOverview";
import { type SEOAnalysis, seoAnalysisSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const { toast } = useToast();

  const essentialRef = useRef<HTMLDivElement>(null);
  const opengraphRef = useRef<HTMLDivElement>(null);
  const twitterRef = useRef<HTMLDivElement>(null);
  const technicalRef = useRef<HTMLDivElement>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      const data = await response.json();
      return seoAnalysisSchema.parse(data);
    },
    onSuccess: (data) => {
      setAnalysis(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze URL. Please check the URL and try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = (url: string) => {
    analyzeMutation.mutate(url);
  };

  const scrollToCategory = (categoryId: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      essential: essentialRef,
      opengraph: opengraphRef,
      twitter: twitterRef,
      technical: technicalRef,
    };

    const ref = refs[categoryId];
    if (ref?.current) {
      const headerOffset = 80;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <h1 className="text-xl font-semibold" data-testid="text-app-title">
            SEO Meta Tag Analyzer
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <URLInput onAnalyze={handleAnalyze} isLoading={analyzeMutation.isPending} />
        </div>

        {analysis && (
          <div className="space-y-8">
            <SEODashboard analysis={analysis} />
            
            <CategoryOverview analysis={analysis} onCategoryClick={scrollToCategory} />
            
            <div className="grid lg:grid-cols-[1fr,400px] gap-8 items-start">
              <div className="space-y-8">
                <div ref={essentialRef}>
                  <MetaTagsList tags={analysis.essentialTags} title="Essential SEO Tags" />
                </div>
                <div ref={opengraphRef}>
                  <MetaTagsList tags={analysis.openGraphTags} title="Open Graph Tags" />
                </div>
                <div ref={twitterRef}>
                  <MetaTagsList tags={analysis.twitterTags} title="Twitter Card Tags" />
                </div>
                <div ref={technicalRef}>
                  <MetaTagsList tags={analysis.technicalTags} title="Technical SEO" />
                </div>
              </div>

              <div className="lg:block hidden">
                <PreviewSection
                  title={analysis.title}
                  description={analysis.description}
                  url={analysis.url}
                  ogTitle={analysis.openGraphTags.find(t => t.name === "og:title")?.value}
                  ogDescription={analysis.openGraphTags.find(t => t.name === "og:description")?.value}
                  ogImage={analysis.ogImage}
                  twitterTitle={analysis.twitterTags.find(t => t.name === "twitter:title")?.value}
                  twitterDescription={analysis.twitterTags.find(t => t.name === "twitter:description")?.value}
                  twitterImage={analysis.twitterImage}
                />
              </div>
            </div>
          </div>
        )}

        {!analysis && (
          <div className="max-w-3xl mx-auto text-center space-y-6 py-12">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Validate Your SEO Meta Tags</h2>
              <p className="text-muted-foreground">
                Enter a URL above to analyze meta tags and see how your page appears in search results and social media
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 pt-6">
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-semibold">Google Preview</h3>
                <p className="text-sm text-muted-foreground">
                  See exactly how your page appears in Google search results
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold">Social Media</h3>
                <p className="text-sm text-muted-foreground">
                  Preview Facebook and Twitter card appearances
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="font-semibold">Best Practices</h3>
                <p className="text-sm text-muted-foreground">
                  Get actionable recommendations for optimization
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
