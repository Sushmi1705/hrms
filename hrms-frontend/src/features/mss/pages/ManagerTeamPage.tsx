import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTeam } from "../api/mssApi";
import type { MssTeamMemberDto } from "../types/mss";

const statusColor: Record<string, string> = {
  Present: "#10b981", Absent: "#ef4444", Late: "#f59e0b", "On Leave": "#8b5cf6",
};

export default function ManagerTeamPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const { data, isLoading } = useQuery({
    queryKey: ["mss-team", search, page],
    queryFn: () => getTeam({ search, page, pageSize }),
    placeholderData: (prev) => prev,
  });

  const totalPages = data ? Math.ceil((data as any).totalCount / pageSize) : 1;

  return (
    <div style={{ padding:24, maxWidth:1400, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ color:"#e2e8f0", fontSize:24, fontWeight:700, margin:0 }}>👥 My Team</h1>
        <p style={{ color:"#94a3b8", fontSize:14, marginTop:4 }}>
          {(data as any)?.totalCount ?? 0} direct reports
        </p>
      </div>

      {/* Search */}
      <div style={{ background:"#1e293b", borderRadius:12, padding:16, marginBottom:24, border:"1px solid #334155" }}>
        <input
          type="text" placeholder="🔍 Search by name, email, employee number..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ width:"100%", background:"#0f172a", border:"1px solid #475569", borderRadius:8, padding:"10px 14px", color:"#e2e8f0", fontSize:14, outline:"none", boxSizing:"border-box" }} />
      </div>

      {/* Table */}
      <div style={{ background:"#1e293b", borderRadius:12, border:"1px solid #334155", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#0f172a" }}>
                {["Employee","Designation","Department","Attendance","Leave","Performance","Assets","Joined"].map(h => (
                  <th key={h} style={{ padding:"14px 16px", textAlign:"left", color:"#94a3b8", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} style={{ padding:40, textAlign:"center", color:"#64748b" }}>Loading team...</td></tr>
              ) : (data as any)?.items?.length === 0 ? (
                <tr><td colSpan={8} style={{ padding:40, textAlign:"center", color:"#64748b" }}>No team members found</td></tr>
              ) : (data as any)?.items?.map((emp: MssTeamMemberDto, i: number) => (
                <tr key={emp.employeeId} style={{ borderTop:"1px solid #1e293b", transition:"background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background="#1a2440"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background="transparent"}>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:38, height:38, background:`linear-gradient(135deg, ${["#6366f1","#8b5cf6","#ec4899","#14b8a6"][i%4]}, ${["#4f46e5","#7c3aed","#db2777","#0d9488"][i%4]})`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:15, flexShrink:0 }}>
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ color:"#e2e8f0", fontWeight:500, fontSize:14 }}>{emp.name}</div>
                        <div style={{ color:"#64748b", fontSize:11 }}>{emp.employeeNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"14px 16px", color:"#cbd5e1", fontSize:13 }}>{emp.designation || "—"}</td>
                  <td style={{ padding:"14px 16px", color:"#cbd5e1", fontSize:13 }}>{emp.department || "—"}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ padding:"4px 10px", borderRadius:20, background:`${statusColor[emp.attendanceStatus]||"#475569"}22`, color:statusColor[emp.attendanceStatus]||"#94a3b8", fontSize:12, fontWeight:600 }}>
                      {emp.attendanceStatus}
                    </span>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ padding:"4px 10px", borderRadius:20, background:emp.leaveStatus==="On Leave"?"#8b5cf622":"#33415522", color:emp.leaveStatus==="On Leave"?"#a78bfa":"#94a3b8", fontSize:12, fontWeight:600 }}>
                      {emp.leaveStatus}
                    </span>
                  </td>
                  <td style={{ padding:"14px 16px", color:"#94a3b8", fontSize:13 }}>{emp.performanceStatus}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ background:"#1e293b", border:"1px solid #334155", padding:"3px 10px", borderRadius:20, color:"#94a3b8", fontSize:12 }}>
                      {emp.assetCount}
                    </span>
                  </td>
                  <td style={{ padding:"14px 16px", color:"#64748b", fontSize:12 }}>
                    {new Date(emp.joiningDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding:"12px 16px", borderTop:"1px solid #334155", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ color:"#64748b", fontSize:13 }}>
              Showing {((page-1)*pageSize)+1}–{Math.min(page*pageSize, (data as any)?.totalCount||0)} of {(data as any)?.totalCount||0}
            </span>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ padding:"6px 14px", background:page===1?"#1e293b":"#334155", border:"1px solid #475569", borderRadius:6, color:page===1?"#475569":"#e2e8f0", cursor:page===1?"not-allowed":"pointer", fontSize:13 }}>← Prev</button>
              <span style={{ color:"#94a3b8", padding:"6px 14px", fontSize:13 }}>Page {page} / {totalPages}</span>
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ padding:"6px 14px", background:page===totalPages?"#1e293b":"#334155", border:"1px solid #475569", borderRadius:6, color:page===totalPages?"#475569":"#e2e8f0", cursor:page===totalPages?"not-allowed":"pointer", fontSize:13 }}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
