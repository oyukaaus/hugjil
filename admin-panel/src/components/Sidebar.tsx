// components/Sidebar.tsx
import Link from 'next/link'

const Sidebar = () => (
  <aside className="w-64 bg-white shadow-md h-screen p-4">
    <h2 className="text-xl font-bold mb-6">Admin</h2>
    <ul>
      <li><Link href="/dashboard" className="block py-2 hover:text-blue-600">Dashboard</Link></li>
      <li><Link href="/users" className="block py-2 hover:text-blue-600">Users</Link></li>
      <li><Link href="/questions" className="block py-2 hover:text-blue-600">Questions</Link></li>
    </ul>
  </aside>
)

export default Sidebar
