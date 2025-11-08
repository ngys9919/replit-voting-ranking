import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trophy } from "lucide-react";
import { type Park } from "@shared/schema";

interface VotingMatchupProps {
  park1: Park;
  park2: Park;
  onVote: (winnerId: string, loserId: string) => void;
  isVoting: boolean;
}

export function VotingMatchup({ park1, park2, onVote, isVoting }: VotingMatchupProps) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" data-testid="text-matchup-title">Which National Park is Better?</h2>
        <p className="text-muted-foreground">Click on your favorite to vote</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="hover-elevate active-elevate-2 cursor-pointer transition-all"
          onClick={() => !isVoting && onVote(park1.id, park2.id)}
          data-testid={`card-park-${park1.id}`}
        >
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={park1.imageUrl}
              alt={park1.name}
              className="w-full h-full object-cover"
              data-testid={`img-park-${park1.id}`}
            />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2" data-testid={`text-park-name-${park1.id}`}>
              {park1.name}
            </CardTitle>
            <CardDescription data-testid={`text-park-location-${park1.id}`}>{park1.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4" data-testid={`text-park-description-${park1.id}`}>
              {park1.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-muted-foreground">ELO Rating: </span>
                <span className="font-semibold" data-testid={`text-park-elo-${park1.id}`}>{park1.eloRating}</span>
              </div>
              <Button
                disabled={isVoting}
                size="lg"
                data-testid={`button-vote-${park1.id}`}
              >
                {isVoting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Voting...
                  </>
                ) : (
                  <>
                    <Trophy className="mr-2 h-4 w-4" />
                    Vote
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover-elevate active-elevate-2 cursor-pointer transition-all"
          onClick={() => !isVoting && onVote(park2.id, park1.id)}
          data-testid={`card-park-${park2.id}`}
        >
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={park2.imageUrl}
              alt={park2.name}
              className="w-full h-full object-cover"
              data-testid={`img-park-${park2.id}`}
            />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2" data-testid={`text-park-name-${park2.id}`}>
              {park2.name}
            </CardTitle>
            <CardDescription data-testid={`text-park-location-${park2.id}`}>{park2.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4" data-testid={`text-park-description-${park2.id}`}>
              {park2.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-muted-foreground">ELO Rating: </span>
                <span className="font-semibold" data-testid={`text-park-elo-${park2.id}`}>{park2.eloRating}</span>
              </div>
              <Button
                disabled={isVoting}
                size="lg"
                data-testid={`button-vote-${park2.id}`}
              >
                {isVoting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Voting...
                  </>
                ) : (
                  <>
                    <Trophy className="mr-2 h-4 w-4" />
                    Vote
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
