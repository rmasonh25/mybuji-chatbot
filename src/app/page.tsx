import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import Pricing from '@/components/sections/Pricing';
import Footer from '@/components/layout/Footer';
import ChatbotContainer from '@/components/chatbot/ChatbotContainer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Pricing />
        {/* Add other sections as needed */}
      </main>
      <Footer />
      <ChatbotContainer />
    </div>
  );
}
