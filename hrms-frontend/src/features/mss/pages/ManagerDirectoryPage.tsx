import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTeamDirectory } from "../api/mssApi";
import type { TeamDirectoryItemDto } from "../types/mss";

export default function ManagerDirectoryPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({ queryKey:["mss-directory",search], queryFn:()=>getTeamDirectory(search||undefined) });

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ color:"#e2e8f0", fontSize:24, fontWeight:700, margin:0 }}>📋 Team Directory</h1>
        <p style={{ color:"#94a3b8", fontSize:14, marginTop:4 }}>Contact information for your team</p>
      </div>

      <div style={{ background:"#1e293b", borderRadius:12, padding:16, marginBottom:24, border:"1px solid #334155" }}>
        <input type="text" placeholder="🔍 Search team members..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ width:"100%", background:"#0f172a", border:"1px solid #475569", borderRadius:8, padding:"10px 14px", color:"#e2e8f0", fontSize:14, outline:"none", boxSizing:"border-box" }} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
        {isLoading ? <div style={{ color:"#64748b", textAlign:"center", padding:40, gridColumn:"1/-1" }}>Loading...</div>
        : !data?.length ? <div style={{ color:"#64748b", textAlign:"center", padding:40, gridColumn:"1/-1" }}>No team members found</div>
        : data.map((emp: TeamDirectoryItemDto, i:number) => {
          const colors = ["#6366f1","#8b5cf6","#ec4899","#14b8a6","#f59e0b","#10b981"];
          const c = colors[i%colors.length];
          return (
            <div key={emp.employeeId} style={{ background:"#1e293b", borderRadius:12, padding:20, border:"1px solid #334155", transition:"all 0.2s" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)";(e.currentTarget as HTMLDivElement).style.boxShadow=`0 8px 24px ${c}33`;}}
              onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform="none";(e.currentTarget as HTMLDivElement).style.boxShadow="none";}}>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                <div style={{ width:48, height:48, borderRadius:"50%", background:`linear-gradient(135deg,${c},${c}88)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:20, fontWeight:700, flexShrink:0 }}>
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <div style={{ color:"#e2e8f0", fontWeight:600, fontSize:15 }}>{emp.name}</div>
                  <div style={{ color:c, fontSize:12, marginTop:2 }}>{emp.designation}</div>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ color:"#64748b", fontSize:12, width:70 }}>📧 Email</span>
                  <span style={{ color:"#94a3b8", fontSize:12 }}>{emp.email}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ color:"#64748b", fontSize:12, width:70 }}>🏢 Dept</span>
                  <span style={{ color:"#94a3b8", fontSize:12 }}>{emp.department||"—"}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ color:"#64748b", fontSize:12, width:70 }}>📍 Branch</span>
                  <span style={{ color:"#94a3b8", fontSize:12 }}>{emp.branch||"—"}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ color:"#64748b", fontSize:12, width:70 }}>📅 Joined</span>
                  <span style={{ color:"#94a3b8", fontSize:12 }}>{new Date(emp.joiningDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span>
                </div>
              </div>
              <div style={{ marginTop:14 }}>
                <span style={{ padding:"4px 10px", borderRadius:20, background:emp.status==="Active"?"#10b98122":"#ef444422", color:emp.status==="Active"?"#10b981":"#ef4444", fontSize:11, fontWeight:600 }}>{emp.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
