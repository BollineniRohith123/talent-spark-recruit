
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type CandidateStatus = 
  | 'screening' 
  | 'interview' 
  | 'offer' 
  | 'hired' 
  | 'rejected';

export interface Candidate {
  id: string;
  name: string;
  position: string;
  skills: string[];
  status: CandidateStatus;
  matchScore?: number;
  avatar?: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  onView?: (id: string) => void;
  onAction?: (id: string) => void;
  actionLabel?: string;
  className?: string;
}

const statusConfig: Record<CandidateStatus, { label: string; color: string }> = {
  screening: { label: 'Screening', color: 'bg-amber-100 text-amber-800' },
  interview: { label: 'Interview', color: 'bg-blue-100 text-blue-800' },
  offer: { label: 'Offer', color: 'bg-purple-100 text-purple-800' },
  hired: { label: 'Hired', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
};

export function CandidateCard({ 
  candidate, 
  onView, 
  onAction, 
  actionLabel = "View Profile",
  className 
}: CandidateCardProps) {
  const { id, name, position, skills, status, matchScore, avatar } = candidate;
  const { label, color } = statusConfig[status];

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatar} />
            <AvatarFallback className="text-lg">{name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{name}</h3>
              <Badge className={color}>{label}</Badge>
            </div>
            
            <p className="text-muted-foreground">{position}</p>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="bg-accent/50">
                  {skill}
                </Badge>
              ))}
              {skills.length > 3 && (
                <Badge variant="outline" className="bg-accent/50">
                  +{skills.length - 3}
                </Badge>
              )}
            </div>
            
            {matchScore !== undefined && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Match Score</span>
                  <span className="text-sm font-medium">{matchScore}%</span>
                </div>
                <Progress value={matchScore} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-muted/30 flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => onView && onView(id)}
        >
          {actionLabel}
        </Button>
        
        {onAction && (
          <Button 
            onClick={() => onAction(id)}
            variant="default"
          >
            Next Step
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
