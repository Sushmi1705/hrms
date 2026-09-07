import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../api/mssApi";

const statusColor: Record<string, string> = {
  Present: "#10b981", Absent: "#ef4444", Late: "#f59e0b", "On Leave": "#8b5cf6",
};

export default function ManagerDashboardPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["mss-dashboard"], queryFn: getDashboard });

  if (isLoading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh" }}>
      <div style={{ textAlign:"center" }}>
        <div className="spinner" style={{ width:48, height:48, border:"4px solid #334155", borderTopColor:"#6366f1", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
        <p style={{ color:"#94a3b8" }}>Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ padding:24, background:"#1e293b", borderRadius:12, color:"#f87171" }}>
      <h3>⚠️ Failed to load dashboard</h3>
      <p style={{ color:"#94a3b8", marginTop:8 }}>Backend may be offline. Check API connection.</p>
    </div>
  );

  const d = data!;
  const totalApprovals = (d.pendingLeaveApprovals || 0) + (d.pendingAttendanceApprovals || 0);

  const kpiCards = [
    { label:"Team Size", value: d.teamSize, icon:"👥", color:"#6366f1", link:"/manager/team" },
    { label:"Present Today", value: d.presentToday, icon:"✅", color:"#10b981", link:"/manager/attendance" },
    { label:"Absent Today", value: d.absentToday, icon:"❌", color:"#ef4444", link:"/manager/attendance" },
    { label:"On Leave", value: d.onLeaveToday, icon:"🏖️", color:"#8b5cf6", link:"/manager/leave" },
    { label:"Late Today", value: d.lateToday, icon:"⏰", color:"#f59e0b", link:"/manager/attendance" },
    { label:"Pending Approvals", value: totalApprovals, icon:"📋", color:"#ec4899", link:"/manager/approvals", badge: totalApprovals > 0 },
    { label:"Open HR Requests", value: d.openHRRequests, icon:"📁", color:"#14b8a6", link:"/manager/requests" },
    { label:"Training Overdue", value: d.trainingOverdue, icon:"📚", color:"#f97316", link:"/manager/training" },
  ];

  return (
    <div style={{ padding:"24px", maxWidth:1400, margin:"0 auto" }}>
      {/* Header Banner */}
      <div style={{ background:"linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)", borderRadius:16, padding:"28px 32px", marginBottom:28, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:14, marginBottom:4 }}>Welcome back,</p>
          <h1 style={{ color:"#fff", fontSize:28, fontWeight:700, margin:0 }}>{d.managerName}</h1>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:14, marginTop:4 }}>{d.designation} · {d.department}</p>
        </div>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:12, padding:"12px 20px", textAlign:"center", backdropFilter:"blur(10px)" }}>
            <div style={{ color:"#fff", fontSize:28, fontWeight:700 }}>{d.teamSize}</div>
            <div style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>Direct Reports</div>
          </div>
          {totalApprovals > 0 && (
            <div style={{ background:"rgba(239,68,68,0.25)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:12, padding:"12px 20px", textAlign:"center" }}>
              <div style={{ color:"#fca5a5", fontSize:28, fontWeight:700 }}>{totalApprovals}</div>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>Pending Approvals</div>
            </div>
          )}
          {d.upcomingBirthdays > 0 && (
            <div style={{ background:"rgba(251,191,36,0.2)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:12, padding:"12px 20px", textAlign:"center" }}>
              <div style={{ color:"#fde68a", fontSize:28, fontWeight:700 }}>🎂 {d.upcomingBirthdays}</div>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>Upcoming Birthdays</div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(170px,1fr))", gap:16, marginBottom:28 }}>
        {kpiCards.map(kpi => (
          <Link key={kpi.label} to={kpi.link} style={{ textDecoration:"none" }}>
            <div style={{ background:"#1e293b", borderRadius:12, padding:"20px 16px", border:`1px solid ${kpi.color}22`, position:"relative", transition:"transform 0.2s, box-shadow 0.2s", cursor:"pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${kpi.color}33`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
              {kpi.badge && <div style={{ position:"absolute", top:8, right:8, width:8, height:8, background:"#ef4444", borderRadius:"50%", animation:"pulse 1s infinite" }} />}
              <div style={{ fontSize:28, marginBottom:8 }}>{kpi.icon}</div>
              <div style={{ color:kpi.color, fontSize:28, fontWeight:700 }}>{kpi.value}</div>
              <div style={{ color:"#94a3b8", fontSize:12, marginTop:4 }}>{kpi.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:24, alignItems:"start" }}>
        {/* Attendance Trend */}
        <div style={{ background:"#1e293b", borderRadius:12, padding:20, border:"1px solid #334155" }}>
          <h3 style={{ color:"#e2e8f0", marginBottom:16, fontWeight:600, fontSize:16 }}>📈 7-Day Attendance Trend</h3>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:140 }}>
            {d.attendanceTrend?.map((pt, i) => {
              const maxVal = Math.max(...d.attendanceTrend.map(x => x.present + x.absent + x.late + x.onLeave), 1);
              const total = pt.present + pt.absent + pt.late + pt.onLeave;
              const h = total === 0 ? 4 : Math.max(4, (total / maxVal) * 120);
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:2, justifyContent:"flex-end", height:120 }}>
                    {pt.present > 0 && <div style={{ height:`${(pt.present/maxVal)*120}px`, background:"#10b981", borderRadius:3 }} title={`Present: ${pt.present}`} />}
                    {pt.late > 0 && <div style={{ height:`${(pt.late/maxVal)*120}px`, background:"#f59e0b", borderRadius:3 }} title={`Late: ${pt.late}`} />}
                    {pt.onLeave > 0 && <div style={{ height:`${(pt.onLeave/maxVal)*120}px`, background:"#8b5cf6", borderRadius:3 }} title={`On Leave: ${pt.onLeave}`} />}
                    {pt.absent > 0 && <div style={{ height:`${(pt.absent/maxVal)*120}px`, background:"#ef4444", borderRadius:3 }} title={`Absent: ${pt.absent}`} />}
                  </div>
                  <div style={{ color:"#64748b", fontSize:10, whiteSpace:"nowrap" }}>{pt.date}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:16, marginTop:12, flexWrap:"wrap" }}>
            {[["#10b981","Present"],["#f59e0b","Late"],["#8b5cf6","On Leave"],["#ef4444","Absent"]].map(([c,l]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:10, height:10, background:c, borderRadius:2 }} />
                <span style={{ color:"#94a3b8", fontSize:11 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Status */}
        <div style={{ background:"#1e293b", borderRadius:12, padding:20, border:"1px solid #334155" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ color:"#e2e8f0", fontWeight:600, fontSize:16, margin:0 }}>👥 Team Today</h3>
            <Link to="/manager/team" style={{ color:"#6366f1", fontSize:12, textDecoration:"none" }}>View All →</Link>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {d.teamStatusSnapshot?.slice(0,8).map(emp => (
              <div key={emp.employeeId} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", background:"#0f172a", borderRadius:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:32, height:32, background:statusColor[emp.attendanceStatus] || "#475569", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:500 }}>{emp.name}</div>
                    <div style={{ color:"#64748b", fontSize:11 }}>{emp.designation}</div>
                  </div>
                </div>
                <div style={{ padding:"3px 8px", borderRadius:20, background:`${statusColor[emp.attendanceStatus] || "#475569"}22`, color:statusColor[emp.attendanceStatus] || "#94a3b8", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
                  {emp.attendanceStatus}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background:"#1e293b", borderRadius:12, padding:20, border:"1px solid #334155", marginTop:24 }}>
        <h3 style={{ color:"#e2e8f0", marginBottom:16, fontWeight:600, fontSize:16 }}>⚡ Quick Actions</h3>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          {[
            { label:"Review Pending Leaves", link:"/manager/approvals", icon:"🏖️", color:"#6366f1" },
            { label:"Team Attendance", link:"/manager/attendance", icon:"⏰", color:"#10b981" },
            { label:"Performance Reviews", link:"/manager/performance", icon:"⭐", color:"#f59e0b" },
            { label:"Team Analytics", link:"/manager/analytics", icon:"📊", color:"#8b5cf6" },
            { label:"Team Directory", link:"/manager/team/directory", icon:"📋", color:"#ec4899" },
            { label:"HR Requests", link:"/manager/requests", icon:"📁", color:"#14b8a6" },
          ].map(action => (
            <Link key={action.label} to={action.link} style={{ textDecoration:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 16px", background:`${action.color}15`, border:`1px solid ${action.color}33`, borderRadius:8, color:action.color, fontSize:13, fontWeight:500, transition:"all 0.2s", cursor:"pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = `${action.color}25`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = `${action.color}15`; }}>
                <span>{action.icon}</span> {action.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  );
}
