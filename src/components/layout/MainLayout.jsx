import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout({
  children,
}) {
  return (
    <div className="flex bg-white min-h-screen">

      <Sidebar />

      <div className="flex-1 bg-white">

        <Topbar />

        <div className="p-6 bg-white min-h-screen">
          {children}
        </div>

      </div>

    </div>
  );
}