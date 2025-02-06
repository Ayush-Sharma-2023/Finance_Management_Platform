import { Button } from '@/components/ui/button';
import Footer from './footer'
import { Card } from '@/components/ui/card';
import { ArrowRight, BarChart3, Calculator, LineChart, MessageSquare, PiggyBank, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'; // Ensure you have an Accordion component

const features = [
  {
    name: 'Tax Calculator',
    description: 'Compare old vs. new tax regimes and find the optimal choice for your salary structure.',
    href: '/taxations',
    icon: Calculator,
  },
  {
    name: 'Investment Advisor',
    description: 'Get personalized mutual fund recommendations based on your risk profile.',
    href: '/investments',
    icon: LineChart,
  }, 
  
  {
    name: 'Budget Management',
    description: 'Track expenses, set budgets, and get AI-powered insights for better financial planning.',
    href: '/budget',
    icon: PiggyBank,
  },
  {
    name: 'Market Insights',
    description: 'Stay updated with AI-curated financial news and market trends.',
    href: '/insights',
    icon: BarChart3,
  },
  {
    name: 'AI Financial Advisor',
    description: 'Chat with our AI advisor for personalized financial guidance and tips.',
    href: '/advisor',
    icon: MessageSquare,
  },
];

export default function Home() {
  return ( 
    <>
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-white text-gray-900">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-blue-600 to-blue-800 text-white text-center">
        <div className="container px-4 md:px-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">Your AI-Powered Financial Advisor</h1>
            <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
              Make smarter financial decisions with personalized insights, investment recommendations, and AI-powered guidance.
            </p>
            <Button asChild className="bg-white text-blue-600 hover:bg-gray-100 shadow-md">
              <Link href="/chatbot">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.name} className="flex flex-col p-6 bg-white shadow-md border border-gray-200 hover:shadow-lg transition duration-300">
                  <div className="flex items-center">
                    <Icon className="h-8 w-8 text-blue-600" />
                    <h3 className="ml-4 text-xl font-bold text-gray-900">{feature.name}</h3>
                  </div>
                  <p className="mt-4 text-gray-600">{feature.description}</p>
                  <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-500 text-white">
                    <Link href={feature.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Choose Us?</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Our platform leverages AI and real-time data to provide actionable financial insights and recommendations.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="p-6 bg-gray-100 shadow-md rounded-lg">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Data-Driven Decisions</h3>
              <p className="mt-2 text-gray-600">We analyze financial trends and data to help you make informed decisions.</p>
            </div>
            <div className="p-6 bg-gray-100 shadow-md rounded-lg">
              <Shield className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Secure & Reliable</h3>
              <p className="mt-2 text-gray-600">Your financial data is encrypted and protected with the latest security measures.</p>
            </div>
            <div className="p-6 bg-gray-100 shadow-md rounded-lg">
              <MessageSquare className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">AI-Powered Assistance</h3>
              <p className="mt-2 text-gray-600">Get real-time AI-driven recommendations tailored to your needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Section: How It Works */}
      <section className="w-full py-12 md:py-24 bg-gray-100">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Our simple, step-by-step process helps you get personalized financial advice.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-1 md:grid-cols-3">
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900">Step 1</h3>
              <p className="mt-2 text-gray-600">Enter your details and financial goals.</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900">Step 2</h3>
              <p className="mt-2 text-gray-600">Receive personalized recommendations based on your profile.</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900">Step 3</h3>
              <p className="mt-2 text-gray-600">Optimize your financial plan and track progress over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Section: Latest Financial News & Trends */}
      <section className="w-full py-12 md:py-24 bg-white">
  <div className="container px-4 md:px-6 text-center">
    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
      Stay Updated with the Latest Market Trends
    </h2>
    <p className="mt-4 text-lg text-gray-600">
      Get real-time financial news, stock market insights, and economic updates.
    </p>
    <div className="mt-6">
      <a
        href="/news"
        className="inline-block bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition hover:bg-blue-700"
      >
        View Latest Updates
      </a>
    </div>
  </div>
</section>


      {/* New Section: FAQ */}
      <section className="w-full py-12 md:py-24 bg-gray-100">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>How safe is my data?</AccordionTrigger>
                <AccordionContent>
                  Your data is encrypted and stored securely with the latest encryption protocols.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does risk profiling work?</AccordionTrigger>
                <AccordionContent>
                  We analyze your financial habits, risk tolerance, and goals to provide personalized advice.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I trust the AI recommendations?</AccordionTrigger>
                <AccordionContent>
                  Our AI uses data-driven insights and models trained on vast datasets to offer accurate and reliable recommendations.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
      </div>
      <div className="flex  flex-col bg-white text-gray-900">
      {/* Existing content */}
      <Footer />
    </div>
    </>
  );
}
