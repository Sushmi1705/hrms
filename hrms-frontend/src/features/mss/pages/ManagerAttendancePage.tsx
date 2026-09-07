import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTeamAttendance } from "../api/mssApi";
import type { TeamAttendanceDayDto } from "../types/mss";

const statusColor: Record<string,string> = { Present:"#10b981", Absent:"#ef4444", Late:"#f59e0b", Leave:"#8b5cf6" };

export default function ManagerAttendancePage() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth()+1);
  const [year, setYear] = useState(today.getFullYear());

  const { data, isLoading } = useQuery({ queryKey:["mss-attendance",month,year], queryFn:()=>getTeamAttendance(month,year) });

  // Group by date
  const byDate = (data||[]).reduce((acc: Record<string,TeamAttendanceDayDto[]>, log: TeamAttendanceDayDto) => {
    const d = log.date.split("T")[0];
    if (!acc[d]) acc[d] = [];
    acc[d].push(log);
    return acc;
  }, {});

  const daysInMonth = new Date(year, month, 0).getDate();

  const prev = () => { if(month===1){setMonth(12);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const next = () => { if(month===12){setMonth(1);setYear(y=>y+1);}else setMonth(m=>m+1); };

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ color:"#e2e8f0", fontSize:24, fontWeight:700, margin:0 }}>⏰ Team Attendance</h1>
          <p style={{ color:"#94a3b8", fontSize:14, marginTop:4 }}>Monthly attendance overview</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={prev} style={{ padding:"8px 14px", background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#94a3b8", cursor:"pointer" }}>←</button>
          <div style={{ color:"#e2e8f0", fontWeight:600, fontSize:16, minWidth:140, textAlign:"center" }}>
            {new Date(year,month-1).toLocaleString("en-IN",{month:"long",year:"numeric"})}
          </div>
          <button onClick={next} style={{ padding:"8px 14px", background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#94a3b8", cursor:"pointer" }}>→</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:16, marginBottom:20, flexWrap:"wrap" }}>
        {[["#10b981","Present"],["#f59e0b","Late"],["#8b5cf6","On Leave"],["#ef4444","Absent"]].map(([c,l])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:12, height:12, background:c, borderRadius:3 }} />
            <span style={{ color:"#94a3b8", fontSize:13 }}>{l}</span>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div style={{ padding:60, textAlign:"center", color:"#64748b", background:"#1e293b", borderRadius:12 }}>Loading attendance...</div>
      ) : (
        <div style={{ background:"#1e293b", borderRadius:12, border:"1px solid #334155", overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#0f172a" }}>
                  <th style={{ padding:"12px 16px", textAlign:"left", color:"#94a3b8", fontSize:12, fontWeight:600, textTransform:"uppercase", minWidth:100 }}>Date</th>
                  <th style={{ padding:"12px 16px", textAlign:"center", color:"#10b981", fontSize:12, fontWeight:600 }}>Present</th>
                  <th style={{ padding:"12px 16px", textAlign:"center", color:"#f59e0b", fontSize:12, fontWeight:600 }}>Late</th>
                  <th style={{ padding:"12px 16px", textAlign:"center", color:"#8b5cf6", fontSize:12, fontWeight:600 }}>On Leave</th>
                  <th style={{ padding:"12px 16px", textAlign:"center", color:"#ef4444", fontSize:12, fontWeight:600 }}>Absent</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({length:daysInMonth},(_,i)=>{
                  const d = new Date(year,month-1,i+1);
                  const isWeekend = d.getDay()===0||d.getDay()===6;
                  const dateKey = `${year}-${String(month).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`;
                  const logs = byDate[dateKey]||[];
                  const present = logs.filter((l:TeamAttendanceDayDto)=>l.clockIn&&!l.isLate).length;
                  const late = logs.filter((l:TeamAttendanceDayDto)=>l.isLate).length;
                  const onLeave = logs.filter((l:TeamAttendanceDayDto)=>l.status==="Leave").length;
                  return (
                    <tr key={i} style={{ borderTop:"1px solid #0f172a", background:isWeekend?"#0f172a09":undefined }}
                      onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background="#1a2440"}
                      onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background=isWeekend?"#0f172a11":"transparent"}>
                      <td style={{ padding:"10px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ color:isWeekend?"#475569":"#e2e8f0", fontSize:13, fontWeight:500 }}>
                            {d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",weekday:"short"})}
                          </div>
                          {isWeekend && <span style={{ color:"#475569", fontSize:11 }}>Weekend</span>}
                          {dateKey===today.toISOString().split("T")[0] && <span style={{ background:"#6366f133", color:"#818cf8", fontSize:10, padding:"2px 6px", borderRadius:10 }}>Today</span>}
                        </div>
                      </td>
                      <td style={{ padding:"10px 16px", textAlign:"center" }}>
                        {present>0 ? <span style={{ color:"#10b981", fontWeight:600 }}>{present}</span> : <span style={{ color:"#334155" }}>—</span>}
                      </td>
                      <td style={{ padding:"10px 16px", textAlign:"center" }}>
                        {late>0 ? <span style={{ color:"#f59e0b", fontWeight:600 }}>{late}</span> : <span style={{ color:"#334155" }}>—</span>}
                      </td>
                      <td style={{ padding:"10px 16px", textAlign:"center" }}>
                        {onLeave>0 ? <span style={{ color:"#8b5cf6", fontWeight:600 }}>{onLeave}</span> : <span style={{ color:"#334155" }}>—</span>}
                      </td>
                      <td style={{ padding:"10px 16px", textAlign:"center" }}>
                        {!isWeekend && logs.length===0 ? <span style={{ color:"#334155" }}>—</span>
                          : !isWeekend && <span style={{ color:"#ef4444", fontWeight:600 }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
