// components/HelpPage.tsx
import Link from "next/link";
import { useState } from "react";

const HelpPage = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    {
      id: 1,
      title: "Getting Started with ChatGPT",
      description: "Learn how to start using ChatGPT.",
    },
    {
      id: 2,
      title: "Using ChatGPT for Business",
      description: "Understand how to use ChatGPT for business needs.",
    },
    {
      id: 3,
      title: "Troubleshooting ChatGPT",
      description: "Get help with troubleshooting common issues.",
    },
    {
      id: 4,
      title: "Advanced ChatGPT Features",
      description: "Explore the advanced features and capabilities of ChatGPT.",
    },
    // Add more articles here...
  ];

  const categories = [
    { name: "Getting Started", link: "#" },
    { name: "Using ChatGPT", link: "#" },
    { name: "Troubleshooting", link: "#" },
    { name: "Advanced Features", link: "#" },
    // Add more categories if needed...
  ];

  return (
    <div className="help-page-container flex">


      {/* Main Content */}
      <div className="content flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">  Help Center</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              className="article-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold">{article.title}</h2>
              <p className="text-gray-600 mb-4">{article.description}</p>
              <Link href={`/help/${article.id}`} className="text-blue-500">
                Read More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
