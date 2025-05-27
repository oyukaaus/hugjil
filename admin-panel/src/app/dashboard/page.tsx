// src/app/users/page.tsx
"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Replace this with your actual API or mock data
    setUsers([
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
      { id: 3, name: "Alice Johnson", email: "alice@example.com" },
    ]);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Ерөнхий мэдээлэл</h1>
      <div className="overflow-x-auto">
        <p>Ерөнхий мэдээлэл</p>
      </div>
    </div>
  );
}
