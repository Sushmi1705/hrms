import { useQuery } from "@tanstack/react-query";
import { getTeamCompensation } from "../api/mssApi";
import type { MssCompensationDto } from "../types/mss";

export default function ManagerCompensationPage() {
  const { data, isLoading } = useQuery({ queryKey:["mss-compensation"], queryFn: getTeamCompensation });

  const fmt = (v: number, c: string) => new Intl.NumberFormat("en-IN",{style:"currency",currency:c||"INR",maximumFractionDigits:0}).format(v);

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ color:"#e2e8f0", fontSize:24, fontWeight:700, margin:0 }}>💰 Team Compensation</h1>
        <p style={{ color:"#94a3b8", fontSize:14, marginTop:4 }}>Compensation overview for your team members</p>
      </div>
      <div style={{ background:"#6366f115", border:"1px solid #6366f133", borderRadius:10, padding:"12px 16px", marginBottom:20 }}>
        <span style={{ color:"#818cf8", fontSize:13 }}>🔒 Compensation data is confidential. This view is restricted to authorized managers only.</span>
      </div>
      <div style={{ background:"#1e293b", borderRadius:12, border:"1px solid #334155", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#0f172a" }}>
                {["Employee","Designation","Department","Pay Grade","Annual CTC","Status","Last Revision"].map(h=>(
                  <th key={h} style={{ padding:"14px 16px", textAlign:"left", color:"#94a3b8", fontSize:12, fontWeight:600, textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} style={{padding:40,textAlign:"center",color:"#64748b"}}>Loading...</td></tr>
              : !data?.length ? <tr><td colSpan={7} style={{padding:40,textAlign:"center",color:"#64748b"}}>No compensation data available</td></tr>
              : data.map((c:MssCompensationDto) => (
                <tr key={c.employeeId} style={{ borderTop:"1px solid #0f172a" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background="#1a2440"}
                  onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background="transparent"}>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:32, height:32, background:"#6366f133", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#818cf8", fontWeight:700, fontSize:13 }}>{c.employeeName.charAt(0)}</div>
                      <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:500 }}>{c.employeeName}</div>
                    </div>
                  </td>
                  <td style={{ padding:"14px 16px", color:"#cbd5e1", fontSize:13 }}>{c.designation||"—"}</td>
                  <td style={{ padding:"14px 16px", color:"#94a3b8", fontSize:13 }}>{c.department||"—"}</td>
                  <td style={{ padding:"14px 16px" }}><code style={{ background:"#334155", color:"#94a3b8", padding:"3px 8px", borderRadius:4, fontSize:12 }}>{c.payGrade||"—"}</code></td>
                  <td style={{ padding:"14px 16px", color:"#10b981", fontWeight:700, fontSize:14 }}>{fmt(c.currentCtc, c.currency)}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ padding:"4px 10px", borderRadius:20, background:c.status==="Active"?"#10b98122":"#f59e0b22", color:c.status==="Active"?"#10b981":"#fcd34d", fontSize:12, fontWeight:600 }}>{c.status}</span>
                  </td>
                  <td style={{ padding:"14px 16px", color:"#64748b", fontSize:12 }}>{c.lastRevisionDate ? new Date(c.lastRevisionDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
