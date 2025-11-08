import { CategoryScoreCard } from "@/components/CategoryScoreCard";
import { FileText, Share2, Twitter, Settings } from "lucide-react";
import type { SEOAnalysis } from "@shared/schema";

interface CategoryOverviewProps {
  analysis: SEOAnalysis;
  onCategoryClick?: (categoryId: string) => void;
}

export function CategoryOverview({ analysis, onCategoryClick }: CategoryOverviewProps) {
  const categories = [
    {
      id: "essential",
      title: "Essential SEO Tags",
      tags: analysis.essentialTags,
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: "opengraph",
      title: "Open Graph Tags",
      tags: analysis.openGraphTags,
      icon: <Share2 className="w-5 h-5" />,
    },
    {
      id: "twitter",
      title: "Twitter Card Tags",
      tags: analysis.twitterTags,
      icon: <Twitter className="w-5 h-5" />,
    },
    {
      id: "technical",
      title: "Technical SEO",
      tags: analysis.technicalTags,
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-4" data-testid="section-category-overview">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Category Breakdown</h2>
        <p className="text-muted-foreground">
          Quick overview of each SEO category - click any card to jump to details
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <CategoryScoreCard
            key={category.id}
            title={category.title}
            tags={category.tags}
            icon={category.icon}
            onExpand={() => onCategoryClick?.(category.id)}
          />
        ))}
      </div>
    </div>
  );
}
