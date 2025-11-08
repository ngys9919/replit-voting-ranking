import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { SEOAnalysis } from "@shared/schema";

interface SEOMetrics {
  totalChecks: number;
  passed: number;
  warnings: number;
  failed: number;
  score: number;
  performanceLevel: string;
}

function calculateSEOMetrics(analysis: SEOAnalysis): SEOMetrics {
  const allTags = [
    ...analysis.essentialTags,
    ...analysis.openGraphTags,
    ...analysis.twitterTags,
    ...analysis.technicalTags,
  ];

  let passed = 0;
  let warnings = 0;
  let failed = 0;

  allTags.forEach((tag) => {
    if (tag.status === "optimal") {
      passed++;
    } else if (tag.status === "present") {
      passed++;
    } else if (tag.status === "warning") {
      warnings++;
    } else if (tag.status === "missing") {
      failed++;
    }
  });

  const totalChecks = allTags.length;
  const score = totalChecks > 0 ? Math.round(((passed + warnings * 0.5) / totalChecks) * 100) : 0;

  let performanceLevel = "Poor";
  if (score >= 90) performanceLevel = "Excellent";
  else if (score >= 75) performanceLevel = "Good";
  else if (score >= 60) performanceLevel = "Fair";
  else if (score >= 40) performanceLevel = "Needs Improvement";

  return {
    totalChecks,
    passed,
    warnings,
    failed,
    score,
    performanceLevel,
  };
}

interface SEODashboardProps {
  analysis: SEOAnalysis;
}

export function SEODashboard({ analysis }: SEODashboardProps) {
  const metrics = calculateSEOMetrics(analysis);

  const chartData = [
    { name: "Passed", value: metrics.passed, color: "hsl(var(--chart-1))" },
    { name: "Warnings", value: metrics.warnings, color: "hsl(var(--chart-3))" },
    { name: "Failed", value: metrics.failed, color: "hsl(var(--chart-5))" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 75) return "text-blue-600 dark:text-blue-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getPerformanceBadgeVariant = (level: string): "default" | "secondary" | "destructive" => {
    if (level === "Excellent" || level === "Good") return "default";
    if (level === "Fair" || level === "Needs Improvement") return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6" data-testid="section-seo-dashboard">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold" data-testid="text-dashboard-title">SEO Performance Dashboard</h2>
        <Badge variant={getPerformanceBadgeVariant(metrics.performanceLevel)} data-testid="badge-performance-level">
          {metrics.performanceLevel}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6" data-testid="card-overall-score">
          <h3 className="text-lg font-medium mb-6">Overall SEO Score</h3>
          <div className="flex items-center gap-8">
            <div className="relative w-40 h-40" data-testid="chart-doughnut">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(metrics.score)}`} data-testid="text-score-percentage">
                    {metrics.score}%
                  </div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                Your SEO score is based on {metrics.totalChecks} checks across all meta tags.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartData[0].color }} />
                  <span className="text-sm">Passed Checks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartData[1].color }} />
                  <span className="text-sm">Warnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartData[2].color }} />
                  <span className="text-sm">Failed Checks</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="card-kpi-metrics">
          <h3 className="text-lg font-medium mb-6">SEO Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900" data-testid="metric-passed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-green-900 dark:text-green-100">Passed Checks</div>
                  <div className="text-xs text-green-600 dark:text-green-400">Optimal & Present</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="count-passed">
                {metrics.passed}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900" data-testid="metric-warnings">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Warnings</div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">Needs attention</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400" data-testid="count-warnings">
                {metrics.warnings}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900" data-testid="metric-failed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-red-900 dark:text-red-100">Failed Checks</div>
                  <div className="text-xs text-red-600 dark:text-red-400">Missing tags</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400" data-testid="count-failed">
                {metrics.failed}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
