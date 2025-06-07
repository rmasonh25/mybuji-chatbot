import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6">
          Unlock Your Musical Potential with Cello Lessons
        </h2>
        <p className="text-lg md:text-xl text-foreground mb-8">
          Discover the joy of playing the cello with personalized lessons from experienced musicians. 
          Our unique approach combines traditional teaching with AI-powered chat support to accelerate your learning.
        </p>
        <Button size="lg" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          Get Started Today
        </Button>
      </div>
      <div className="mt-12 md:mt-16 rounded-lg overflow-hidden shadow-2xl">
        <Image
          src="https://placehold.co/1200x600.png"
          alt="Musician offering cello lessons"
          width={1200}
          height={600}
          className="w-full h-auto object-cover"
          data-ai-hint="musician cello"
          priority
        />
      </div>
    </section>
  );
}
