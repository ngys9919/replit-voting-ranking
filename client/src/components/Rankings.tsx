import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { type Park } from "@shared/schema";

interface RankingsProps {
  parks: Park[];
}

export function Rankings({ parks }: RankingsProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };

  return (
    <Card data-testid="card-rankings">
      <CardHeader>
        <CardTitle className="text-2xl" data-testid="text-rankings-title">Top National Parks</CardTitle>
        <CardDescription>Ranked by ELO rating based on community votes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {parks.map((park, index) => {
            const rank = index + 1;
            return (
              <div
                key={park.id}
                className="flex items-center gap-4 p-3 rounded-lg hover-elevate"
                data-testid={`row-ranking-${park.id}`}
              >
                <div className="flex items-center gap-2 min-w-[3rem]">
                  {getRankIcon(rank)}
                  <span className="text-lg font-semibold text-muted-foreground" data-testid={`text-rank-${park.id}`}>
                    #{rank}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold" data-testid={`text-ranking-park-name-${park.id}`}>{park.name}</div>
                  <div className="text-sm text-muted-foreground" data-testid={`text-ranking-park-location-${park.id}`}>
                    {park.location}
                  </div>
                </div>
                
                <Badge variant="secondary" data-testid={`badge-elo-${park.id}`}>
                  {park.eloRating} ELO
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
