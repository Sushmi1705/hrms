import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItem { label: string; icon: string; path: string; badge?: number; }
interface NavSection { title: string; items: NavItem[]; }

const navSections: NavSection[] = [
  { title: "Overview", items: [
    { label: "Dashboard", icon: "🏠", path: "/manager" },
  ]},
  { title: "My Team", items: [
    { label: "Team Members", icon: "👥", path: "/manager/team" },
    { label: "Team Directory", icon: "📋", path: "/manager/team/directory" },
    { label: "Team Calendar", icon: "📅", path: "/manager/calendar" },
    { label: "Analytics", icon: "📊", path: "/manager/analytics" },
  ]},
  { title: "Time & Attendance", items: [
    { label: "Team Attendance", icon: "⏰", path: "/manager/attendance" },
    { label: "Attendance Requests", icon: "📝", path: "/manager/attendance-requests" },
  ]},
  { title: "Leave", items: [
    { label: "Team Leave", icon: "🏖️", path: "/manager/leave" },
  ]},
  { title: "Performance", items: [
    { label: "Team Performance", icon: "⭐", path: "/manager/performance" },
  ]},
  { title: "Development", items: [
    { label: "Team Training", icon: "📚", path: "/manager/training" },
  ]},
  { title: "HR Operations", items: [
    { label: "Team Assets", icon: "💼", path: "/manager/assets" },
    { label: "Team Compensation", icon: "💰", path: "/manager/compensation" },
    { label: "Approvals Inbox", icon: "✅", path: "/manager/approvals" },
    { label: "HR Requests", icon: "📁", path: "/manager/requests" },
  ]},
  { title: "Travel & Expense", items: [
    { label: "T&E Dashboard", icon: "✈️", path: "/manager/travel" },
    { label: "Travel Requests", icon: "🗺️", path: "/manager/travel/requests" },
    { label: "Team Trips", icon: "🧳", path: "/manager/travel/trips" },
    { label: "Team Expenses", icon: "🧾", path: "/manager/travel/expenses" },
    { label: "Expense Reports", icon: "📄", path: "/manager/travel/reports" },
    { label: "Advances", icon: "💳", path: "/manager/travel/advances" },
  ]},
];

export default function ManagerLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/manager") return location.pathname === "/manager";
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {!collapsed && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👔</div>
              <div>
                <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, lineHeight: 1 }}>Manager Portal</div>
                <div style={{ color: "#6366f1", fontSize: 11, marginTop: 2 }}>MSS</div>
              </div>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)} style={{ background: "none", border: "1px solid #334155", borderRadius: 6, color: "#64748b", cursor: "pointer", padding: "4px 8px", fontSize: 14 }}>
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
        {navSections.map(section => (
          <div key={section.title} style={{ marginBottom: 8 }}>
            {!collapsed && (
              <div style={{ color: "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "8px 10px 4px" }}>
                {section.title}
              </div>
            )}
            {section.items.map(item => {
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} title={collapsed ? item.label : undefined}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, marginBottom: 2, textDecoration: "none", background: active ? "linear-gradient(90deg,#6366f122,#8b5cf611)" : "transparent", borderLeft: active ? "2px solid #6366f1" : "2px solid transparent", transition: "all 0.15s", color: active ? "#a5b4fc" : "#64748b", position: "relative" }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "#1e293b"; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, flex: 1 }}>{item.label}</span>}
                  {!collapsed && (item.badge ?? 0) > 0 && (
                    <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10, minWidth: 18, textAlign: "center" }}>{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #1e293b" }}>
        {!collapsed && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/admin" style={{ flex: 1, padding: "8px 10px", background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#94a3b8", fontSize: 11, textAlign: "center", textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "#6366f1"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "#334155"}>
                🏢 HR Admin
              </Link>
              <Link to="/employee" style={{ flex: 1, padding: "8px 10px", background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#94a3b8", fontSize: 11, textAlign: "center", textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "#8b5cf6"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "#334155"}>
                👤 My ESS
              </Link>
            </div>
            <Link to="/" style={{ display: "block", width: "100%", padding: "8px 10px", background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#cbd5e1", fontSize: 11, textAlign: "center", textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#f43f5e"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#334155"; (e.currentTarget as HTMLAnchorElement).style.color = "#cbd5e1"; }}
              title="Return to Main Portal Selection Screen">
              🚪 Switch Portal / Exit
            </Link>
          </div>
        )}
        {collapsed && (
          <Link to="/" style={{ display: "flex", justifyContent: "center", padding: "8px 0", color: "#94a3b8", textDecoration: "none", fontSize: 16 }} title="Switch Portal">
            🚪
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f172a", fontFamily: "'Inter','Segoe UI',sans-serif", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{ width: collapsed ? 56 : 240, background: "#0a0f1e", borderRight: "1px solid #1e293b", flexShrink: 0, transition: "width 0.25s", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex" }}>
          <div style={{ width: 260, background: "#0a0f1e", borderRight: "1px solid #1e293b", height: "100%" }}>
            <SidebarContent />
          </div>
          <div style={{ flex: 1, background: "rgba(0,0,0,0.6)" }} onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto", background: "#0f172a" }}>
        {/* Top Bar */}
        <div style={{ background: "#0a0f1e", borderBottom: "1px solid #1e293b", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setMobileOpen(true)} style={{ display: "none", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 20 }}>☰</button>
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <span style={{ color: "#475569" }}>Manager Portal</span>
              <span style={{ color: "#334155" }}>›</span>
              <span style={{ color: "#94a3b8" }}>
                {navSections.flatMap(s=>s.items).find(i=>isActive(i.path))?.label || "Dashboard"}
              </span>
            </nav>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              to="/"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#cbd5e1", fontSize: 12, fontWeight: 500, textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#6366f1"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#334155"; (e.currentTarget as HTMLAnchorElement).style.color = "#cbd5e1"; }}
              title="Return to Main Portal Selection Screen"
            >
              <span>🔄</span>
              <span>Switch Portal</span>
            </Link>
            <div style={{ padding: "6px 12px", background: "#6366f115", border: "1px solid #6366f133", borderRadius: 8, color: "#818cf8", fontSize: 12, fontWeight: 600 }}>👔 Manager View</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ minHeight: "calc(100vh - 57px)" }}>
          {children}
        </div>
      </main>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
        @media (max-width: 768px) {
          aside { display: none !important; }
          button[style*="display: none"] { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
