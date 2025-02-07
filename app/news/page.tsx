'use client';

import { useEffect, useState, useRef } from 'react';
import Navbar from '../../components/Navbar';

interface Article {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  source: { name: string };
}

const NewsPage = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchNews = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=stocks OR stock market OR share market OR equity&language=en&sortBy=publishedAt&page=${page}&pageSize=10&apiKey=858a39ca377e4b8a9cccdd2f712c9aba`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.articles.length === 0 && page === 1) {
        setError("No news articles found.");
      } else {
        setNews((prevNews) => [...prevNews, ...data.articles]); // Append new articles
        setPage((prevPage) => prevPage + 1); // Increment page number
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to load news. Please try again later.");
    }

    setLoading(false);
  };

  const removeArticle = (index: number) => {
    setNews((prevNews) => prevNews.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchNews(); // Fetch initial news
  }, []);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNews(); // Load more news when user reaches bottom
        }
      },
      { threshold: 1 }
    );

    const target = document.querySelector("#load-more");
    if (target) observerRef.current.observe(target);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [page]); // Depend on 'page' instead of 'news' to prevent excessive re-renders

  return (
    <><Navbar/>
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Latest Stock Market News</h1>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((article, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 p-4">
              {article.urlToImage && (
                <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover rounded-t-lg" />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold">{article.title}</h2>
                <p className="text-sm text-gray-600">{article.source.name}</p>
                <p className="mt-2 text-gray-700">{article.description?.slice(0, 100)}...</p>
                <div className="flex justify-between mt-4">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Read More →
                  </a>
                  <button
                    onClick={() => removeArticle(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loader */}
      {loading && <p className="text-center text-gray-500 mt-6">Loading more news...</p>}

      {/* Invisible trigger element for Infinite Scroll */}
      <div id="load-more" className="h-10"></div>
    </div>
    </>
  );
};

export default NewsPage;
