
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  Import,
  FileOutput,
  Calculator,
  ArrowUp,
  ArrowDown,
  Users,
  FileQuestion,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  className?: string;
}

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  path: string;
  section?: string; // Added to categorize items
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);

  // Updated navigation items with sections
  const navigationItems: SidebarItem[] = [
    // Main section
    { title: "Dashboard", icon: LayoutDashboard, path: "/", section: "main" },
    { title: "Import Data", icon: Import, path: "/import", section: "main" },
    { title: "Import Guides", icon: FileQuestion, path: "/import-guides", section: "main" }, // New Import Guides link
    { title: "Export Data", icon: FileOutput, path: "/export", section: "main" },
    
    // Data section
    { title: "Meters", icon: Calculator, path: "/meters", section: "data" },
    { title: "Customers", icon: Users, path: "/customers", section: "data" },
    
    // Legal section (at the bottom)
    { title: "Imprint", icon: FileText, path: "/imprint", section: "legal" },
  ];

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // If on mobile, always collapse the sidebar
  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  // Group navigation items by section
  const mainNavItems = navigationItems.filter(item => item.section === "main");
  const dataNavItems = navigationItems.filter(item => item.section === "data");
  const legalNavItems = navigationItems.filter(item => item.section === "legal");

  // Function to render navigation items
  const renderNavItems = (items: SidebarItem[]) => {
    return items.map((item) => (
      <Link 
        key={item.path}
        to={item.path}
        className={cn(
          "flex items-center px-3 py-2.5 rounded-md transition-colors",
          "hover:bg-sidebar-primary/20",
          location.pathname === item.path
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground"
        )}
      >
        <item.icon size={20} className="flex-shrink-0" />
        {!collapsed && <span className="ml-3">{item.title}</span>}
      </Link>
    ));
  };

  return (
    <div
      className={cn(
        "bg-sidebar flex flex-col h-screen transition-all duration-300 ease-in-out border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <span className="text-sidebar-foreground font-bold text-xl">APT Manager</span>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleCollapse}
          className="text-sidebar-foreground ml-auto"
        >
          {collapsed ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
        </Button>
      </div>
      
      <Separator className="bg-sidebar-border/50" />
      
      {/* Navigation sections */}
      <div className="flex-1 py-4 overflow-y-auto">
        {/* Main navigation section */}
        <nav className="px-2 space-y-1 mb-4">
          {renderNavItems(mainNavItems)}
        </nav>
        
        {/* Data section with label */}
        {!collapsed && (
          <div className="px-4 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-2">
            Data
          </div>
        )}
        <nav className="px-2 space-y-1 mb-4">
          {renderNavItems(dataNavItems)}
        </nav>
        
        {/* Push legal section to the bottom */}
        <div className="flex-grow"></div>
        
        {/* Legal section at the bottom */}
        <nav className="px-2 space-y-1 mb-2">
          {renderNavItems(legalNavItems)}
        </nav>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground/70">
            Apartment Management System v1.0
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
