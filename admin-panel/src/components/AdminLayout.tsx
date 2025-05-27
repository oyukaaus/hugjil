// import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 bg-gray-100">
      {/* <Header /> */}
      <main className="p-4 bg-[#d9e6f7] h-full">{children}</main>
    </div>
  </div>
)

export default AdminLayout