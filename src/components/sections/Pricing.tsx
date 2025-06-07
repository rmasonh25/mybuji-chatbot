import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const pricingTiers = [
  {
    title: 'Quick Start',
    price: '$50',
    duration: '30 Minutes',
    description: 'Perfect for a focused session or young beginners.',
    features: ['Targeted skill practice', 'Basic technique check-up', 'AI Chat Support'],
  },
  {
    title: 'Standard Session',
    price: '$70',
    duration: '1 Hour',
    description: 'Our most popular option for steady progress.',
    features: ['Comprehensive lesson', 'Repertoire development', 'Theory fundamentals', 'AI Chat Support'],
  },
  {
    title: 'Extended Immersion',
    price: '$90',
    duration: '1.5 Hours',
    description: 'For dedicated students wanting to dive deeper.',
    features: ['In-depth exploration', 'Advanced techniques', 'Performance coaching', 'AI Chat Support'],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center mb-4">
          Our Lesson Plans
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Choose the plan that best suits your learning goals and schedule. All plans include access to our CelloChat AI assistant.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier) => (
            <Card key={tier.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="font-headline text-2xl text-primary">{tier.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-accent">{tier.price}</span>
                  <span className="text-muted-foreground"> / {tier.duration}</span>
                </div>
                <ul className="space-y-2 mb-8 text-foreground flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="default" className="w-full mt-auto bg-primary hover:bg-primary/90">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
