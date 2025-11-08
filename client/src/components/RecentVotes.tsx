import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Vote {
  id: string;
  timestamp: Date;
  winner: {
    id: string;
    name: string;
    eloRating: number;
  };
  loser: {
    id: string;
    name: string;
    eloRating: number;
  };
}

interface RecentVotesProps {
  votes: Vote[];
}

export function RecentVotes({ votes }: RecentVotesProps) {
  return (
    <Card data-testid="card-recent-votes">
      <CardHeader>
        <CardTitle className="text-2xl" data-testid="text-recent-votes-title">Recent Votes</CardTitle>
        <CardDescription>Latest voting activity from the community</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {votes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8" data-testid="text-no-votes">
              No votes yet. Be the first to vote!
            </p>
          ) : (
            votes.map((vote) => (
              <div
                key={vote.id}
                className="flex items-center gap-3 p-3 rounded-lg hover-elevate"
                data-testid={`row-vote-${vote.id}`}
              >
                <div className="flex-1 flex items-center gap-2 text-sm">
                  <span className="font-semibold" data-testid={`text-vote-winner-${vote.id}`}>
                    {vote.winner.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {vote.winner.eloRating}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground" data-testid={`text-vote-loser-${vote.id}`}>
                    {vote.loser.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {vote.loser.eloRating}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap" data-testid={`text-vote-time-${vote.id}`}>
                  {formatDistanceToNow(new Date(vote.timestamp), { addSuffix: true })}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
