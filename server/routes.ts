import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import * as cheerio from "cheerio";
import { type SEOAnalysis, type MetaTag, type TagStatus, seoAnalysisSchema } from "@shared/schema";

const analyzeUrlSchema = z.object({
  url: z.string().url(),
});

function validateTag(
  name: string,
  value: string | undefined,
  optimalMin: number,
  optimalMax: number
): { status: TagStatus; recommendation: string; optimalRange: string } {
  if (!value) {
    return {
      status: "missing",
      recommendation: `${name} is missing - highly recommended for SEO`,
      optimalRange: `${optimalMin}-${optimalMax} chars`,
    };
  }

  const length = value.length;

  if (length >= optimalMin && length <= optimalMax) {
    return {
      status: "optimal",
      recommendation: "Perfect length for search results",
      optimalRange: `${optimalMin}-${optimalMax} chars`,
    };
  }

  if (length < optimalMin) {
    return {
      status: "warning",
      recommendation: `Too short - should be ${optimalMin}-${optimalMax} characters`,
      optimalRange: `${optimalMin}-${optimalMax} chars`,
    };
  }

  return {
    status: "warning",
    recommendation: `Too long - may be truncated in search results`,
    optimalRange: `${optimalMin}-${optimalMax} chars`,
  };
}

function normalizeValue(value: string | undefined): string | undefined {
  return value?.trim() || undefined;
}

function resolveUrl(baseUrl: string, relativeUrl: string | undefined): string | undefined {
  if (!relativeUrl) return undefined;
  try {
    const resolved = new URL(relativeUrl, baseUrl);
    return resolved.href;
  } catch {
    return relativeUrl;
  }
}

async function analyzeSEO(url: string): Promise<SEOAnalysis> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SEOAnalyzer/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const title = normalizeValue($('title').text() || $('meta[property="og:title"]').attr('content')) || '';
  const description = normalizeValue(
    $('meta[name="description"]').attr('content') || 
    $('meta[property="og:description"]').attr('content')
  ) || '';
  const canonical = normalizeValue($('link[rel="canonical"]').attr('href'));
  const robots = normalizeValue($('meta[name="robots"]').attr('content'));
  const viewport = normalizeValue($('meta[name="viewport"]').attr('content'));

  const ogTitle = normalizeValue($('meta[property="og:title"]').attr('content'));
  const ogDescription = normalizeValue($('meta[property="og:description"]').attr('content'));
  const ogImage = resolveUrl(url, normalizeValue($('meta[property="og:image"]').attr('content')));
  const ogUrl = normalizeValue($('meta[property="og:url"]').attr('content'));
  const ogType = normalizeValue($('meta[property="og:type"]').attr('content'));

  const twitterCard = normalizeValue($('meta[name="twitter:card"]').attr('content'));
  const twitterTitle = normalizeValue($('meta[name="twitter:title"]').attr('content'));
  const twitterDescription = normalizeValue($('meta[name="twitter:description"]').attr('content'));
  const twitterImage = resolveUrl(url, normalizeValue($('meta[name="twitter:image"]').attr('content')));

  const essentialTags: MetaTag[] = [
    {
      name: "Title Tag",
      value: title,
      characterCount: title.length,
      ...validateTag("Title", title, 50, 60),
    },
    {
      name: "Meta Description",
      value: description,
      characterCount: description.length,
      ...validateTag("Description", description, 150, 160),
    },
  ];

  const openGraphTags: MetaTag[] = [
    {
      name: "og:title",
      value: ogTitle,
      status: ogTitle ? "present" : "missing",
      characterCount: ogTitle?.length,
      recommendation: ogTitle ? "Title is present for social sharing" : "Add og:title for better social media previews",
    },
    {
      name: "og:description",
      value: ogDescription,
      characterCount: ogDescription?.length,
      ...validateTag("og:description", ogDescription, 60, 110),
    },
    {
      name: "og:image",
      value: ogImage,
      status: ogImage ? "optimal" : "missing",
      recommendation: ogImage 
        ? "Image is present for social sharing" 
        : "Add an image for better social media previews (recommended: 1200x630px)",
    },
    {
      name: "og:url",
      value: ogUrl,
      status: ogUrl ? "present" : "missing",
      recommendation: ogUrl 
        ? "Canonical URL for social sharing is present" 
        : "Add og:url to specify the canonical URL for social sharing",
    },
    {
      name: "og:type",
      value: ogType,
      status: ogType ? "present" : "missing",
      recommendation: ogType 
        ? `Type is set to "${ogType}"` 
        : "Add og:type (e.g., 'website', 'article')",
    },
  ];

  const twitterTags: MetaTag[] = [
    {
      name: "twitter:card",
      value: twitterCard,
      status: twitterCard ? (twitterCard === "summary_large_image" ? "optimal" : "present") : "missing",
      recommendation: twitterCard 
        ? (twitterCard === "summary_large_image" 
          ? "Using large image format for better visibility" 
          : `Using "${twitterCard}" format`)
        : "Add twitter:card (recommended: 'summary_large_image')",
    },
    {
      name: "twitter:title",
      value: twitterTitle,
      status: twitterTitle ? "present" : "missing",
      characterCount: twitterTitle?.length,
      recommendation: twitterTitle 
        ? "Title is present for Twitter cards" 
        : "Add twitter:title for Twitter card previews",
    },
    {
      name: "twitter:description",
      value: twitterDescription,
      characterCount: twitterDescription?.length,
      ...validateTag("twitter:description", twitterDescription, 60, 110),
    },
    {
      name: "twitter:image",
      value: twitterImage,
      status: twitterImage ? "optimal" : "missing",
      recommendation: twitterImage 
        ? "Image is present for Twitter cards" 
        : "Add twitter:image for Twitter card previews",
    },
  ];

  const technicalTags: MetaTag[] = [
    {
      name: "Canonical URL",
      value: canonical,
      status: canonical ? "optimal" : "missing",
      recommendation: canonical 
        ? "Canonical URL is properly set" 
        : "Add canonical URL to avoid duplicate content issues",
    },
    {
      name: "Robots Meta Tag",
      value: robots,
      status: robots ? "optimal" : "missing",
      recommendation: robots 
        ? `Set to "${robots}"` 
        : "No robots tag found - defaults to index, follow",
    },
    {
      name: "Viewport",
      value: viewport,
      status: viewport ? "optimal" : "missing",
      recommendation: viewport 
        ? "Mobile-friendly viewport configuration is present" 
        : "Add viewport meta tag for mobile responsiveness",
    },
  ];

  return {
    url,
    title,
    description,
    essentialTags,
    openGraphTags,
    twitterTags,
    technicalTags,
    ogImage,
    twitterImage,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = analyzeUrlSchema.parse(req.body);
      
      const analysis = await analyzeSEO(url);
      
      const validatedAnalysis = seoAnalysisSchema.parse(analysis);
      
      res.json(validatedAnalysis);
    } catch (error) {
      console.error("Error analyzing URL:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid URL provided",
          details: error.errors 
        });
      }
      
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to analyze URL" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
