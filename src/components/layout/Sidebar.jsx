import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Search,
  Settings,
  PlusCircle,
  Bot,
  FileText,
  Briefcase,
  GitBranch,
  KanbanSquare,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/",
  },
  {
    name: "Projects",
    icon: <FolderKanban size={18} />,
    path: "/projects",
  },
  {
    name: "Discovery",
    icon: <Search size={18} />,
    path: "/discovery",
  },
  {
    name: "Create Project",
    icon: <PlusCircle size={18} />,
    path: "/create-project",
  },
  {
    name: "Settings",
    icon: <Settings size={18} />,
    path: "/settings",
  },
  {
  name: "AI Chat",
  icon: <Bot size={18} />,
  path: "/ai-chat",
},
{
  name: "Documents",
  icon: <FileText size={18} />,
  path: "/documents",
},
{
  name: "Workspace",
  icon: <Briefcase size={18} />,
  path: "/workspace",
},
{
  name: "RTM",
  icon: <GitBranch size={18} />,
  path: "/rtm",
},
{
  name: "Agile Board",
  icon: <KanbanSquare size={18} />,
  path: "/agile",
},
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-[250px] bg-slate-900 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">
        MySDLC
      </h1>

      <div className="flex flex-col gap-3">
        {menus.map((menu) => (
          <Link
            key={menu.name}
            to={menu.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all
            ${
              location.pathname === menu.path
                ? "bg-blue-600"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            {menu.icon}
            {menu.name}
          </Link>
        ))}
      </div>
    </div>
  );
}