"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Users() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadQuestions();
  }, []); 

  const loadQuestions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/questions`
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="text-left px-4 py-2 border-b">ID</th>
              <th className="text-left px-4 py-2 border-b">Question</th>
              <th className="text-left px-4 py-2 border-b">Created At</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question:any) => (
              <tr key={question.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2 border-b">{question.id}</td>
                <td className="px-4 py-2 border-b">{question.content}</td>
                <td className="px-4 py-2 border-b">{new Date(question.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
