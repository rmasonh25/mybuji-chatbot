import Link from 'next/link';
import CelloIcon from '@/components/icons/CelloIcon';

export default function Header() {
  return (
    <header className="py-6 bg-transparent text-primary-foreground">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-3 text-primary hover:text-accent transition-colors">
          <CelloIcon className="h-10 w-10" />
          <span className="text-2xl font-headline font-semibold">CelloChat Lessons</span>
        </Link>
        <h1 className="text-xl font-headline text-primary">Welcome!</h1>
      </div>
    </header>
  );
}
