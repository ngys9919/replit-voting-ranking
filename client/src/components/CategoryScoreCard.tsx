import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, ChevronRight } from "lucide-react";
import type { MetaTag } from "@shared/schema";

interface CategoryMetrics {
  total: number;
  passed: number;
  warnings: number;
  failed: number;
  score: number;
  status: "excellent" | "good" | "fair" | "poor";
}

function calculateCategoryMetrics(tags: MetaTag[]): CategoryMetrics {
  let passed = 0;
  let warnings = 0;
  let failed = 0;

  tags.forEach((tag) => {
    if (tag.status === "optimal" || tag.status === "present") {
      passed++;
    } else if (tag.status === "warning") {
      warnings++;
    } else if (tag.status === "missing") {
      failed++;
    }
  });

  const total = tags.length;
  const score = total > 0 ? Math.round(((passed + warnings * 0.5) / total) * 100) : 0;

  let status: "excellent" | "good" | "fair" | "poor" = "poor";
  if (score >= 90) status = "excellent";
  else if (score >= 70) status = "good";
  else if (score >= 50) status = "fair";

  return { total, passed, warnings, failed, score, status };
}

interface CategoryScoreCardProps {
  title: string;
  tags: MetaTag[];
  icon?: React.ReactNode;
  onExpand?: () => void;
}

export function CategoryScoreCard({ title, tags, icon, onExpand }: CategoryScoreCardProps) {
  const metrics = calculateCategoryMetrics(tags);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 dark:text-green-400";
      case "good":
        return "text-blue-600 dark:text-blue-400";
      case "fair":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-red-600 dark:text-red-400";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500";
      case "good":
        return "bg-blue-500";
      case "fair":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "excellent":
        return "Excellent";
      case "good":
        return "Good";
      case "fair":
        return "Fair";
      default:
        return "Needs Work";
    }
  };

  return (
    <Card
      className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
      onClick={onExpand}
      data-testid={`card-category-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="text-muted-foreground">{icon}</div>}
            <div>
              <h3 className="font-semibold text-lg" data-testid={`text-category-title-${title.toLowerCase().replace(/\s+/g, "-")}`}>
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {metrics.total} {metrics.total === 1 ? "check" : "checks"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" data-testid={`badge-category-status-${title.toLowerCase().replace(/\s+/g, "-")}`}>
              {getStatusLabel(metrics.status)}
            </Badge>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Score</span>
            <span className={`text-2xl font-bold ${getStatusColor(metrics.status)}`} data-testid={`text-category-score-${title.toLowerCase().replace(/\s+/g, "-")}`}>
              {metrics.score}%
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full transition-all ${getProgressColor(metrics.status)}`}
              style={{ width: `${metrics.score}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="flex items-center gap-2" data-testid={`metric-category-passed-${title.toLowerCase().replace(/\s+/g, "-")}`}>
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{metrics.passed}</div>
              <div className="text-xs text-muted-foreground">Passed</div>
            </div>
          </div>

          <div className="flex items-center gap-2" data-testid={`metric-category-warnings-${title.toLowerCase().replace(/\s+/g, "-")}`}>
            <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{metrics.warnings}</div>
              <div className="text-xs text-muted-foreground">Warnings</div>
            </div>
          </div>

          <div className="flex items-center gap-2" data-testid={`metric-category-failed-${title.toLowerCase().replace(/\s+/g, "-")}`}>
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-red-600 dark:text-red-400">{metrics.failed}</div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
