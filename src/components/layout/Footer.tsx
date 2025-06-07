import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-8 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <p className="text-sm mb-2">Powered by Mybuji</p>
        <div className="flex justify-center space-x-4 mb-4">
          <Link href="#privacy" className="hover:text-accent transition-colors">
            Privacy Policy
          </Link>
          <Link href="#terms" className="hover:text-accent transition-colors">
            Terms of Service
          </Link>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear() >= 2025 ? new Date().getFullYear() : 2025} Jacqueline Taylor & Friends. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
