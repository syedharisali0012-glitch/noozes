"use client";

import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SuggestionCard from './suggestion-card';
import { Clock, Bed, Sunrise } from 'lucide-react';
import { calculateSleepTimes } from '@/lib/time';
import { Skeleton } from './ui/skeleton';

type Mode = 'wakeup' | 'bedtime' | 'now';
export interface Suggestion {
  time: Date;
  cycle: number;
}

const SleepCalculator: FC = () => {
  const [mode, setMode] = useState<Mode>('wakeup');
  const [timeInput, setTimeInput] = useState<string>('07:00');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [contextTime, setContextTime] = useState<Date>(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCalculation = (currentMode: Mode, time?: string) => {
    const results = calculateSleepTimes(currentMode, time || timeInput);
    setSuggestions(results.suggestions);
    setContextTime(results.contextTime);
  };

  useEffect(() => {
    if (isClient) {
      handleCalculation(mode, timeInput);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);
  
  const onTimeChange = (newTime: string) => {
    setTimeInput(newTime);
    handleCalculation(mode, newTime);
  };
  
  const onTabChange = (value: string) => {
    const newMode = value as Mode;
    setMode(newMode);
    setSuggestions([]);
    handleCalculation(newMode, timeInput);
  };
  
  const onRecalculateNow = () => {
    handleCalculation('now');
  }

  if (!isClient) {
    return (
        <div className="w-full max-w-md mt-10 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    );
  }

  return (
    <div className="w-full mt-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
      <Tabs value={mode} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card/80">
          <TabsTrigger value="wakeup"><Sunrise className="mr-2 h-4 w-4" />Wake up at</TabsTrigger>
          <TabsTrigger value="bedtime"><Bed className="mr-2 h-4 w-4" />Go to bed at</TabsTrigger>
          <TabsTrigger value="now"><Clock className="mr-2 h-4 w-4" />Sleep now</TabsTrigger>
        </TabsList>
        
        <div className="mt-6 text-center min-h-[90px]">
            <TabsContent value="wakeup">
                <p className="text-muted-foreground mb-4">I want to wake up at...</p>
                 <Input
                    type="time"
                    value={timeInput}
                    onChange={(e) => onTimeChange(e.target.value)}
                    className="w-48 mx-auto text-lg p-4 h-auto text-center"
                />
            </TabsContent>
            <TabsContent value="bedtime">
                <p className="text-muted-foreground mb-4">I want to go to bed at...</p>
                 <Input
                    type="time"
                    value={timeInput}
                    onChange={(e) => onTimeChange(e.target.value)}
                    className="w-48 mx-auto text-lg p-4 h-auto text-center"
                />
            </TabsContent>
            <TabsContent value="now" className="flex flex-col items-center gap-4 pt-8">
                <p className="text-muted-foreground">Calculate wake up times based on the current time.</p>
                 <Button onClick={onRecalculateNow}>
                    <Clock className="mr-2 h-4 w-4" />
                    Recalculate for Now
                </Button>
            </TabsContent>
        </div>
      </Tabs>

      {suggestions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-center text-lg font-semibold text-accent mb-4 animate-fade-in">
            {mode === 'wakeup' ? 'You should go to bed at...' : 'You should wake up at...'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => (
              <SuggestionCard
                key={`${mode}-${suggestion.time.toISOString()}`}
                suggestion={suggestion}
                contextTime={contextTime}
                mode={mode}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepCalculator;
