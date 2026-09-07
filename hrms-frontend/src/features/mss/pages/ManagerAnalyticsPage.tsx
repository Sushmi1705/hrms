import { useQuery } from "@tanstack/react-query";
import { getTeamAnalytics } from "../api/mssApi";
import type { HeadcountBreakdownDto, AttendanceTrendPoint } from "../types/mss";

export default function ManagerAnalyticsPage() {
  const { data, isLoading } = useQuery({ queryKey:["mss-analytics"], queryFn: getTeamAnalytics });

  if (isLoading) return <div style={{ padding:40, textAlign:"center", color:"#64748b" }}>Loading analytics...</div>;
  const d = data;

  const metrics = [
    { label:"Attendance Rate", value:d?.attendanceRate||0, color:"#10b981", suffix:"%" },
    { label:"Absence Rate", value:d?.absenceRate||0, color:"#ef4444", suffix:"%" },
    { label:"Late Rate", value:d?.lateRate||0, color:"#f59e0b", suffix:"%" },
    { label:"Leave Utilization", value:d?.leaveUtilization||0, color:"#8b5cf6", suffix:"%" },
    { label:"Goal Completion", value:d?.goalCompletionRate||0, color:"#6366f1", suffix:"%" },
    { label:"Training Completion", value:d?.trainingCompletionRate||0, color:"#14b8a6", suffix:"%" },
    { label:"Review Completion", value:d?.reviewCompletionRate||0, color:"#ec4899", suffix:"%" },
  ];

  return (
    <div style={{ padding:24, maxWidth:1400, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ color:"#e2e8f0", fontSize:24, fontWeight:700, margin:0 }}>📊 Team Analytics</h1>
        <p style={{ color:"#94a3b8", fontSize:14, marginTop:4 }}>Comprehensive performance metrics for your team</p>
      </div>

      {/* Metric Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:16, marginBottom:28 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background:"#1e293b", borderRadius:12, padding:"20px 16px", border:`1px solid ${m.color}22` }}>
            <div style={{ color:m.color, fontSize:32, fontWeight:700, marginBottom:4 }}>{m.value}{m.suffix}</div>
            <div style={{ color:"#94a3b8", fontSize:12 }}>{m.label}</div>
            <div style={{ marginTop:10, height:4, background:"#334155", borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${Math.min(100,m.value)}%`, background:m.color, borderRadius:2 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:24 }}>
        {/* Attendance Trend */}
        <div style={{ background:"#1e293b", borderRadius:12, padding:20, border:"1px solid #334155" }}>
          <h3 style={{ color:"#e2e8f0", fontWeight:600, fontSize:16, margin:"0 0 16px" }}>📈 7-Day Attendance Trend</h3>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:160 }}>
            {d?.attendanceTrend?.map((pt: AttendanceTrendPoint, i: number) => {
              const maxVal = Math.max(...(d.attendanceTrend||[]).map((x:AttendanceTrendPoint)=>x.present+x.absent+x.late+x.onLeave),1);
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:2, justifyContent:"flex-end", height:140 }}>
                    {pt.present>0&&<div style={{height:`${(pt.present/maxVal)*140}px`,background:"#10b981",borderRadius:3}} title={`Present:${pt.present}`}/>}
                    {pt.late>0&&<div style={{height:`${(pt.late/maxVal)*140}px`,background:"#f59e0b",borderRadius:3}} title={`Late:${pt.late}`}/>}
                    {pt.absent>0&&<div style={{height:`${(pt.absent/maxVal)*140}px`,background:"#ef4444",borderRadius:3}} title={`Absent:${pt.absent}`}/>}
                  </div>
                  <div style={{ color:"#64748b", fontSize:10, whiteSpace:"nowrap" }}>{pt.date}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Department */}
        <div style={{ background:"#1e293b", borderRadius:12, padding:20, border:"1px solid #334155" }}>
          <h3 style={{ color:"#e2e8f0", fontWeight:600, fontSize:16, margin:"0 0 16px" }}>🏢 By Department</h3>
          {!d?.byDepartment?.length ? (
            <div style={{ textAlign:"center", color:"#64748b", padding:20 }}>No data</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {d.byDepartment.map((dept: HeadcountBreakdownDto, i: number) => {
                const max = Math.max(...d.byDepartment.map((x:HeadcountBreakdownDto)=>x.count),1);
                const colors = ["#6366f1","#8b5cf6","#ec4899","#14b8a6","#f59e0b","#10b981"];
                const c = colors[i%colors.length];
                return (
                  <div key={dept.label} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:90, color:"#94a3b8", fontSize:12, flexShrink:0, textOverflow:"ellipsis", overflow:"hidden", whiteSpace:"nowrap" }} title={dept.label}>{dept.label}</div>
                    <div style={{ flex:1, height:20, background:"#0f172a", borderRadius:4, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${(dept.count/max)*100}%`, background:c, borderRadius:4, display:"flex", alignItems:"center", paddingLeft:6, minWidth:24 }}>
                        <span style={{ color:"#fff", fontSize:11, fontWeight:600 }}>{dept.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
