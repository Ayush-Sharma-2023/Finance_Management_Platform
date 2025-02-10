import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">AI Financial Advisor</h3>
            <p className="text-gray-300">
              Empowering your financial journey with data-driven insights and
              personalized recommendations.
            </p>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Link href="/advisor">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/advisor" className="hover:text-white">
                  AI Financial Advisor
                </Link>
              </li>
              <li>
                <Link href="/tax" className="hover:text-white">
                  Tax Calculator
                </Link>
              </li>
              <li>
                <Link href="/investments" className="hover:text-white">
                  Investment Advisor
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="hover:text-white">
                  Insurance Planning
                </Link>
              </li>
              <li>
                <Link href="/budget" className="hover:text-white">
                  Budget Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact Us</h3>
            <p className="text-gray-300">
              Feel free to reach out to us with any questions or feedback.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>
                Email:{" "}
                <a
                  href="mailto:support@yourcompany.com"
                  className="hover:text-white"
                >
                  altafraza7206@gmail.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a href="tel:+1234567890" className="hover:text-white">
                  +91-8709670822
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Follow Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a
                  href="https://github.com/Ayush-Sharma-2023"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Github
                </a>
              </li>            
              <li>
                <a
                  href="http://www.linkedin.com/in/ayush-sharma-fsd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.codechef.com/users/ayush_sharma32"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  CodeChef
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; 2025 FinanceAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
