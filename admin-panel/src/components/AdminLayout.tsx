import Sidebar from "@/components/Sidebar"

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 bg-gray-100">
      {/* <Header /> */}
      <main className="p-4 bg-[#e7edf5] h-full">{children}</main>
    </div>
  </div>
)

export default AdminLayout