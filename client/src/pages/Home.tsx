import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { VotingMatchup } from "@/components/VotingMatchup";
import { Rankings } from "@/components/Rankings";
import { RecentVotes } from "@/components/RecentVotes";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { type Park } from "@shared/schema";

interface Matchup {
  park1: Park;
  park2: Park;
}

interface VoteWithDetails {
  id: string;
  timestamp: Date;
  winner: Park;
  loser: Park;
}

export default function Home() {
  const { toast } = useToast();
  const [votingForParkId, setVotingForParkId] = useState<string | null>(null);

  // Fetch current matchup
  const { data: matchup, isLoading: isLoadingMatchup, refetch: refetchMatchup } = useQuery<Matchup>({
    queryKey: ["/api/matchup"],
  });

  // Fetch rankings
  const { data: rankings = [], isLoading: isLoadingRankings } = useQuery<Park[]>({
    queryKey: ["/api/rankings"],
  });

  // Fetch recent votes
  const { data: recentVotes = [], isLoading: isLoadingVotes } = useQuery<VoteWithDetails[]>({
    queryKey: ["/api/recent-votes"],
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ winnerId, loserId }: { winnerId: string; loserId: string }) => {
      const response = await apiRequest("POST", "/api/vote", { winnerId, loserId });
      return response.json();
    },
    onSuccess: () => {
      // Clear voting state
      setVotingForParkId(null);
      
      // Refetch all data after voting
      queryClient.invalidateQueries({ queryKey: ["/api/matchup"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rankings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recent-votes"] });
      
      toast({
        title: "Vote Recorded!",
        description: "Your vote has been counted and ELO ratings updated.",
      });
      
      // Get next matchup
      refetchMatchup();
    },
    onError: (error: Error) => {
      // Clear voting state on error
      setVotingForParkId(null);
      
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVote = (winnerId: string, loserId: string) => {
    setVotingForParkId(winnerId);
    voteMutation.mutate({ winnerId, loserId });
  };

  const handleSkip = () => {
    refetchMatchup();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold" data-testid="text-app-title">
            National Parks Ranker
          </h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Vote on your favorite parks • Powered by ELO rating
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Voting Section */}
        <section className="mb-12">
          {isLoadingMatchup ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : matchup ? (
            <>
              <VotingMatchup
                park1={matchup.park1}
                park2={matchup.park2}
                onVote={handleVote}
                isVoting={voteMutation.isPending}
                votingForParkId={votingForParkId}
              />
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  disabled={voteMutation.isPending}
                  data-testid="button-skip"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Skip & Get New Matchup
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No matchup available</p>
            </div>
          )}
        </section>

        {/* Rankings and Recent Votes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rankings */}
          <section>
            {isLoadingRankings ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Rankings parks={rankings} />
            )}
          </section>

          {/* Recent Votes */}
          <section>
            {isLoadingVotes ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <RecentVotes votes={recentVotes} />
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Help us rank America's National Parks using the chess ELO rating system</p>
        </div>
      </footer>
    </div>
  );
}
