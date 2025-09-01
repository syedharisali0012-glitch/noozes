import { addMinutes, subMinutes, set, isBefore } from 'date-fns';

export interface Suggestion {
  time: Date;
  cycle: number;
}

const SLEEP_CYCLE_MINUTES = 90;
const FALL_ASLEEP_MINUTES = 15;
const NUMBER_OF_SUGGESTIONS = 4;

export function calculateSleepTimes(mode: 'wakeup' | 'bedtime' | 'now', timeValue?: string) {
    let baseTime = new Date();
    
    if ((mode === 'wakeup' || mode === 'bedtime') && timeValue) {
        const [hours, minutes] = timeValue.split(':').map(Number);
        baseTime = set(new Date(), { hours, minutes, seconds: 0, milliseconds: 0 });
    }
    
    let contextTime = baseTime;
    let suggestions: Suggestion[] = [];
    
    switch (mode) {
        case 'wakeup': {
            // If the wake up time is in the past for today, set it for tomorrow
            if(isBefore(baseTime, new Date())) {
                baseTime = addMinutes(baseTime, 24 * 60);
            }
            contextTime = baseTime;
            const targetTimeForBed = subMinutes(baseTime, FALL_ASLEEP_MINUTES);
            suggestions = Array.from({ length: NUMBER_OF_SUGGESTIONS }, (_, i) => {
                const cycles = 6 - i;
                return {
                    time: subMinutes(targetTimeForBed, cycles * SLEEP_CYCLE_MINUTES),
                    cycle: cycles
                };
            });
            break;
        }
        case 'bedtime':
        case 'now': {
            const startTime = addMinutes(baseTime, FALL_ASLEEP_MINUTES);
            suggestions = Array.from({ length: NUMBER_OF_SUGGESTIONS + 2 }, (_, i) => {
                const cycles = 6 - i;
                return {
                    time: addMinutes(startTime, cycles * SLEEP_CYCLE_MINUTES),
                    cycle: cycles
                };
            }).reverse();
            break;
        }
    }
    
    return { suggestions, contextTime };
}
