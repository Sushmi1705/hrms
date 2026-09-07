import { useQuery } from "@tanstack/react-query";
import { getTeamTraining } from "../api/mssApi";
import type { MssTrainingDto } from "../types/mss";

const statusColor: Record<string,string> = { "Not Started":"#64748b", "In Progress":"#6366f1", Completed:"#10b981" };

export default function ManagerTrainingPage() {
  const { data, isLoading } = useQuery({ queryKey:["mss-training"], queryFn: getTeamTraining });
  const overdue = data?.filter((t:MssTrainingDto)=>t.isOverdue)||[];
  const inProgress = data?.filter((t:MssTrainingDto)=>t.status==="In Progress")||[];
  const completed = data?.filter((t:MssTrainingDto)=>t.status==="Completed")||[];

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ color:"#e2e8f0", fontSize:24, fontWeight:700, margin:0 }}>📚 Team Training</h1>
        <p style={{ color:"#94a3b8", fontSize:14, marginTop:4 }}>Course assignments and completion status</p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:16, marginBottom:24 }}>
        {[
          { label:"Total Assignments", value:data?.length||0, color:"#6366f1", icon:"📚" },
          { label:"Completed", value:completed.length, color:"#10b981", icon:"✅" },
          { label:"In Progress", value:inProgress.length, color:"#f59e0b", icon:"🔄" },
          { label:"Overdue", value:overdue.length, color:"#ef4444", icon:"⚠️" },
        ].map(s => (
          <div key={s.label} style={{ background:"#1e293b", borderRadius:12, padding:"20px 16px", border:`1px solid ${s.color}22` }}>
            <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
            <div style={{ color:s.color, fontSize:28, fontWeight:700 }}>{s.value}</div>
            <div style={{ color:"#94a3b8", fontSize:12, marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {overdue.length > 0 && (
        <div style={{ background:"#ef444415", border:"1px solid #ef444444", borderRadius:12, padding:"14px 20px", marginBottom:20 }}>
          <div style={{ color:"#f87171", fontWeight:600, marginBottom:8 }}>⚠️ {overdue.length} Overdue Training Assignment{overdue.length>1?"s":""}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {overdue.map((t:MssTrainingDto)=>(
              <span key={t.assignmentId} style={{ background:"#ef444422", border:"1px solid #ef444444", borderRadius:20, padding:"4px 10px", color:"#f87171", fontSize:12 }}>
                {t.employeeName}: {t.courseName}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ background:"#1e293b", borderRadius:12, border:"1px solid #334155", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#0f172a" }}>
                {["Employee","Course","Type","Progress","Status"].map(h=>(
                  <th key={h} style={{ padding:"14px 16px", textAlign:"left", color:"#94a3b8", fontSize:12, fontWeight:600, textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={5} style={{padding:40,textAlign:"center",color:"#64748b"}}>Loading...</td></tr>
              : !data?.length ? <tr><td colSpan={5} style={{padding:40,textAlign:"center",color:"#64748b"}}>No training assignments</td></tr>
              : data.map((t:MssTrainingDto) => (
                <tr key={t.assignmentId} style={{ borderTop:"1px solid #0f172a" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background="#1a2440"}
                  onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background="transparent"}>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      {t.isOverdue && <span style={{ color:"#ef4444", fontSize:14 }}>⚠️</span>}
                      <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:500 }}>{t.employeeName}</div>
                    </div>
                  </td>
                  <td style={{ padding:"14px 16px", color:"#cbd5e1", fontSize:13 }}>{t.courseName}</td>
                  <td style={{ padding:"14px 16px", color:"#94a3b8", fontSize:12 }}>{t.courseType||"—"}</td>
                  <td style={{ padding:"14px 16px", minWidth:140 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ flex:1, height:6, background:"#334155", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${t.completionPercentage||0}%`, background:t.status==="Completed"?"#10b981":"linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius:3 }} />
                      </div>
                      <span style={{ color:"#94a3b8", fontSize:11, whiteSpace:"nowrap" }}>{t.completionPercentage||0}%</span>
                    </div>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ padding:"4px 10px", borderRadius:20, background:`${statusColor[t.status]||"#475569"}22`, color:statusColor[t.status]||"#94a3b8", fontSize:12, fontWeight:600 }}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
