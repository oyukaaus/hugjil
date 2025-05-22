// components/HelpPage.tsx
import Link from "next/link";
import { useState } from "react";

const HelpPage = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    {
      id: 1,
      title: "ХөгжилGPT гэж юу вэ?",
      description: "ХөгжилGPT бол хиймэл оюун ухаанд суурилсан таны туслах бөгөөд таны асуултад ухаалаг, ойлгомжтой хариулт өгдөг.",
    },
    {
      id: 2,
      title: "Хэрхэн ашиглах вэ?",
      description: "",
      list: ["•	Чат талбарт асуултаа бичнэ.", "•	Илгээх товчийг дарна.", "•	ХөгжилGPT таны асуултад хариу өгнө."]
    },
    {
      id: 3,
      title: " Ямар төрлийн мэдээллийг өгөх боломжтой вэ?",
      description: "",
      list:["•	Хууль эрх зүй бүх мэдээлэл","•	Бодлогын бүх төрлийн асуулт","•	Бодлогын бүх төрлийн асуулт","•	Төлөвлөгөө, санаа боловсруулж өгнө", "•	Төлөвлөгөө, санаа боловсруулж өгнө"]
    },
    {
      id: 4,
      title: "Асуулт минь ойлгомжгүй байна. Яах вэ?",
      description: "Хэрэв бот таны асуултыг ойлгохгүй бол:",
      list:["Илүү товч тодорхой бичихийг хичээгээрэй", "Нэг дор нэг асуулт тавих"]
    },
    // Add more articles here...
  ];

  return (
    <div className="help-page-container flex">


      {/* Main Content */}
      <div className="content flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Тусламж</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              className="article-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold">{article.title}</h2>
              <p className="text-gray-600 mb-4">{article.description}</p> 
              <ul className="list-disc ml-5">
                {article.list?.map((item, index) =>(
                  <li key={index} className="dot">{item}</li>
                ))}
              </ul>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
