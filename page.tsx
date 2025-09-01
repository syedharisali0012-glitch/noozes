import SleepCalculator from '@/components/sleep-calculator';

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-4 selection:bg-primary/40">
      <main className="flex w-full max-w-2xl flex-col items-center py-12 md:py-20">
        <h1 className="font-headline text-5xl font-bold tracking-wider text-accent animate-fade-in md:text-7xl">
          Noozes
        </h1>
        <p className="mt-2 text-center text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
          Find your perfect sleep schedule for a better night&apos;s rest.
        </p>
        <SleepCalculator />
      </main>
    </div>
  );
}
