"use client";

import type { FC } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import type { Suggestion } from './sleep-calculator';

interface SuggestionCardProps {
  suggestion: Suggestion;
  contextTime: Date;
  mode: 'wakeup' | 'bedtime' | 'now';
  index: number;
}

const SuggestionCard: FC<SuggestionCardProps> = ({ suggestion, mode, index }) => {
  const { toast } = useToast();

  const formattedTime = format(suggestion.time, 'h:mm a');
  
  const handleCopy = () => {
    navigator.clipboard.writeText(formattedTime);
    toast({
      title: 'Copied to clipboard!',
      description: `${formattedTime} has been copied.`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Noozes Sleep Time',
        text: `Based on my schedule, a good time to ${mode === 'wakeup' ? 'go to bed' : 'wake up'} is ${formattedTime}. Find your perfect sleep time with Noozes!`,
        url: window.location.href,
      }).catch(error => console.log('Error sharing:', error));
    } else {
      toast({
        variant: 'destructive',
        title: 'Share not supported',
        description: 'Your browser does not support the Web Share API.',
      });
    }
  };

  return (
    <Card className="animate-fade-in border-primary/20 bg-card/50 backdrop-blur-sm" style={{ animationDelay: `${index * 100}ms` }}>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-accent">{formattedTime}</CardTitle>
        <CardDescription>{suggestion.cycle} sleep cycles ({suggestion.cycle * 1.5} hours of sleep)</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[90px]">
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy time">
          <Copy className="h-4 w-4" />
        </Button>
        {typeof navigator !== 'undefined' && navigator.share && (
            <Button variant="outline" size="icon" onClick={handleShare} aria-label="Share time">
              <Share2 className="h-4 w-4" />
            </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SuggestionCard;
