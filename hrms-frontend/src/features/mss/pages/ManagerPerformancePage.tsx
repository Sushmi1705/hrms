import { useQuery } from "@tanstack/react-query";
import { getTeamPerformance, getTeamGoals } from "../api/mssApi";
import type { MssGoalDto, MssReviewItemDto } from "../types/mss";

const statusColor: Record<string,string> = { "Not Started":"#64748b", "In Progress":"#6366f1", "Completed":"#10b981", Overdue:"#ef4444", "On Track":"#10b981" };
const priorityColor: Record<string,string> = { High:"#ef4444", Medium:"#f59e0b", Low:"#10b981" };

export default function ManagerPerformancePage() {
  const { data: perf, isLoading: pl } = useQuery({ queryKey:["mss-performance"], queryFn: getTeamPerformance });
  const { data: goals, isLoading: gl } = useQuery({ queryKey:["mss-goals"], queryFn: ()=>getTeamGoals() });

  if (pl || gl) return <div style={{ padding:40, textAlign:"center", color:"#64748b" }}>Loading performance data...</div>;

  const p = perf;

  return (
    <div style={{ padding:24, maxWidth:1400, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ color:"#e2e8f0", fontSize:24, fontWeight:700, margin:0 }}>⭐ Team Performance</h1>
        <p style={{ color:"#94a3b8", fontSize:14, marginTop:4 }}>Reviews, goals, and performance insights</p>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:16, marginBottom:28 }}>
        {[
          { label:"Pending Reviews", value: p?.reviewsPending||0, color:"#f59e0b", icon:"📋" },
          { label:"Reviews Done", value: p?.reviewsCompleted||0, color:"#10b981", icon:"✅" },
          { label:"Goals On Track", value: p?.goalsOnTrack||0, color:"#6366f1", icon:"🎯" },
          { label:"Goals At Risk", value: p?.goalsAtRisk||0, color:"#ef4444", icon:"⚠️" },
          { label:"Goals Completed", value: p?.goalsCompleted||0, color:"#10b981", icon:"🏆" },
          { label:"Total Goals", value: p?.goalsTotal||0, color:"#8b5cf6", icon:"📊" },
        ].map(kpi => (
          <div key={kpi.label} style={{ background:"#1e293b", borderRadius:12, padding:"20px 16px", border:`1px solid ${kpi.color}22` }}>
            <div style={{ fontSize:24, marginBottom:8 }}>{kpi.icon}</div>
            <div style={{ color:kpi.color, fontSize:28, fontWeight:700 }}>{kpi.value}</div>
            <div style={{ color:"#94a3b8", fontSize:12, marginTop:4 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, alignItems:"start" }}>
        {/* Pending Reviews */}
        <div style={{ background:"#1e293b", borderRadius:12, padding:20, border:"1px solid #334155" }}>
          <h3 style={{ color:"#e2e8f0", fontWeight:600, fontSize:16, margin:"0 0 16px" }}>📋 Pending Reviews</h3>
          {!p?.pendingReviews?.length ? (
            <div style={{ padding:20, textAlign:"center", color:"#64748b" }}>No pending reviews 🎉</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {p.pendingReviews.map((r: MssReviewItemDto) => (
                <div key={r.reviewId} style={{ background:"#0f172a", borderRadius:8, padding:"12px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ color:"#e2e8f0", fontWeight:500, fontSize:14 }}>{r.employeeName}</div>
                    <div style={{ color:"#64748b", fontSize:12, marginTop:2 }}>{r.reviewCycle} · Submitted: {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short"}) : "—"}</div>
                    {r.selfRating && <div style={{ color:"#94a3b8", fontSize:12, marginTop:2 }}>Self Rating: {r.selfRating}/5</div>}
                  </div>
                  <span style={{ padding:"4px 10px", borderRadius:20, background:"#f59e0b22", color:"#fcd34d", fontSize:12, fontWeight:600 }}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rating Distribution */}
        <div style={{ background:"#1e293b", borderRadius:12, padding:20, border:"1px solid #334155" }}>
          <h3 style={{ color:"#e2e8f0", fontWeight:600, fontSize:16, margin:"0 0 16px" }}>🏆 Rating Distribution</h3>
          {!p?.ratingDistribution?.length ? (
            <div style={{ padding:20, textAlign:"center", color:"#64748b" }}>No finalized ratings yet</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {p.ratingDistribution.map((r: any) => {
                const max = Math.max(...p.ratingDistribution.map((x: any)=>x.count));
                return (
                  <div key={r.rating} style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:100, color:"#94a3b8", fontSize:13, flexShrink:0 }}>{r.rating}</div>
                    <div style={{ flex:1, height:24, background:"#0f172a", borderRadius:4, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${(r.count/max)*100}%`, background:"linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius:4, display:"flex", alignItems:"center", paddingLeft:8 }}>
                        <span style={{ color:"#fff", fontSize:12, fontWeight:600 }}>{r.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Goals Table */}
      <div style={{ background:"#1e293b", borderRadius:12, padding:20, border:"1px solid #334155", marginTop:24 }}>
        <h3 style={{ color:"#e2e8f0", fontWeight:600, fontSize:16, margin:"0 0 16px" }}>🎯 Team Goals</h3>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#0f172a" }}>
                {["Employee","Goal","Type","Priority","Progress","Deadline","Status"].map(h=>(
                  <th key={h} style={{ padding:"12px 14px", textAlign:"left", color:"#94a3b8", fontSize:12, fontWeight:600, textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!goals?.length ? <tr><td colSpan={7} style={{padding:30,textAlign:"center",color:"#64748b"}}>No goals found</td></tr>
              : goals.map((g: MssGoalDto) => (
                <tr key={g.goalId} style={{ borderTop:"1px solid #0f172a" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background="#1a2440"}
                  onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background="transparent"}>
                  <td style={{ padding:"12px 14px", color:"#e2e8f0", fontSize:13 }}>{g.employeeName}</td>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:500 }}>{g.title}</div>
                    <div style={{ color:"#64748b", fontSize:11, marginTop:2, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.description}</div>
                  </td>
                  <td style={{ padding:"12px 14px", color:"#94a3b8", fontSize:12 }}>{g.goalType}</td>
                  <td style={{ padding:"12px 14px" }}>
                    <span style={{ padding:"3px 8px", borderRadius:20, background:`${priorityColor[g.priority]||"#475569"}22`, color:priorityColor[g.priority]||"#94a3b8", fontSize:11, fontWeight:600 }}>{g.priority}</span>
                  </td>
                  <td style={{ padding:"12px 14px", minWidth:120 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ flex:1, height:6, background:"#334155", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${g.progressPercentage}%`, background:`linear-gradient(90deg,#6366f1,#8b5cf6)`, borderRadius:3 }} />
                      </div>
                      <span style={{ color:"#94a3b8", fontSize:11, whiteSpace:"nowrap" }}>{g.progressPercentage}%</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 14px", color:"#94a3b8", fontSize:12 }}>{new Date(g.deadline).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</td>
                  <td style={{ padding:"12px 14px" }}>
                    <span style={{ padding:"3px 8px", borderRadius:20, background:`${statusColor[g.status]||"#475569"}22`, color:statusColor[g.status]||"#94a3b8", fontSize:11, fontWeight:600 }}>{g.status}</span>
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
