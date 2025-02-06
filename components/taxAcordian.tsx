"use client";
import React, { useState } from "react";
import { faqData } from "./faqData";

export default function Taxations() {
  const [visibleFaqs, setVisibleFaqs] = useState(5);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const loadMoreFaqs = () => {
    setVisibleFaqs((prev) => Math.min(prev + 5, faqData.length));
  };

  return (
    <div className="my-6">
      <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-2xl text-white">
        <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqData.slice(0, visibleFaqs).map((faq, index) => (
            <div 
              key={index} 
              className="bg-white text-gray-900 p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl duration-300"
            >
              <button
                className="w-full text-left font-semibold flex justify-between items-center focus:outline-none hover:text-blue-700 transition-colors duration-200"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-lg">{faq.question}</span>
                <span className="text-xl font-bold">{openFaq === index ? "▲" : "▼"}</span>
              </button>
              {openFaq === index && <p className="mt-3 text-lg font-semibold text-gray-800 bg-gray-100 p-5 rounded-lg transition-opacity duration-300">{faq.answer}</p>}
            </div>
          ))}
        </div>
        {visibleFaqs < faqData.length && (
          <div className="mt-8 text-center">
            <button 
              className="px-5 py-2 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:bg-gray-300 transition-all duration-300 hover:scale-105"
              onClick={loadMoreFaqs}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}