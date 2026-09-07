import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getTeamLeave, approveLeave, rejectLeave } from "../api/mssApi";
import type { MssLeaveRequestDto } from "../types/mss";

const statusColor: Record<string,string> = { Approved:"#10b981", Pending:"#f59e0b", Rejected:"#ef4444" };

export default function ManagerLeavePage() {
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");
  const [selected, setSelected] = useState<MssLeaveRequestDto|null>(null);
  const [actionType, setActionType] = useState<"approve"|"reject">("approve");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey:["mss-leave",status], queryFn:()=>getTeamLeave(status||undefined) });

  const approveMut = useMutation({ mutationFn:({id,c}:{id:string,c:string})=>approveLeave(id,c), onSuccess:()=>{qc.invalidateQueries({queryKey:["mss-leave"]});qc.invalidateQueries({queryKey:["mss-dashboard"]});setSelected(null);setComments("");} });
  const rejectMut = useMutation({ mutationFn:({id,c}:{id:string,c:string})=>rejectLeave(id,c), onSuccess:()=>{qc.invalidateQueries({queryKey:["mss-leave"]});qc.invalidateQueries({queryKey:["mss-dashboard"]});setSelected(null);setComments("");} });

  const pending = data?.filter((l:MssLeaveRequestDto)=>l.status==="Pending")?.length || 0;

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ color:"#e2e8f0", fontSize:24, fontWeight:700, margin:0 }}>🏖️ Team Leave</h1>
          <p style={{ color:"#94a3b8", fontSize:14, marginTop:4 }}>Manage and approve team leave requests</p>
        </div>
        {pending > 0 && <div style={{ background:"#f59e0b22", border:"1px solid #f59e0b44", borderRadius:10, padding:"10px 16px", color:"#fcd34d", fontSize:14, fontWeight:600 }}>⏰ {pending} Pending Approval{pending>1?"s":""}</div>}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["","Pending","Approved","Rejected"].map(s => (
          <button key={s||"All"} onClick={()=>setStatus(s)} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid", borderColor:status===s?"#6366f1":"#334155", background:status===s?"#6366f133":"#1e293b", color:status===s?"#a5b4fc":"#94a3b8", fontSize:13, cursor:"pointer" }}>
            {s||"All Requests"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:"#1e293b", borderRadius:12, border:"1px solid #334155", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#0f172a" }}>
                {["Employee","Leave Type","From","To","Days","Reason","Status","Action"].map(h=>(
                  <th key={h} style={{ padding:"14px 16px", textAlign:"left", color:"#94a3b8", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={8} style={{padding:40,textAlign:"center",color:"#64748b"}}>Loading...</td></tr>
              : !data?.length ? <tr><td colSpan={8} style={{padding:40,textAlign:"center",color:"#64748b"}}>No leave requests found</td></tr>
              : data.map((l:MssLeaveRequestDto) => (
                <tr key={l.leaveRequestId} style={{ borderTop:"1px solid #0f172a", transition:"background 0.15s" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background="#1a2440"}
                  onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background="transparent"}>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:32, height:32, background:"#6366f133", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#818cf8", fontWeight:700, fontSize:13, flexShrink:0 }}>{l.employeeName.charAt(0)}</div>
                      <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:500 }}>{l.employeeName}</div>
                    </div>
                  </td>
                  <td style={{ padding:"14px 16px", color:"#cbd5e1", fontSize:13 }}>{l.leaveType}{l.isHalfDay&&<span style={{color:"#94a3b8",fontSize:11}}> (Half)</span>}</td>
                  <td style={{ padding:"14px 16px", color:"#94a3b8", fontSize:13 }}>{new Date(l.fromDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}</td>
                  <td style={{ padding:"14px 16px", color:"#94a3b8", fontSize:13 }}>{new Date(l.toDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}</td>
                  <td style={{ padding:"14px 16px", color:"#e2e8f0", fontWeight:600, fontSize:14 }}>{l.totalDays}</td>
                  <td style={{ padding:"14px 16px", color:"#94a3b8", fontSize:12, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={l.reason}>{l.reason}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ padding:"4px 10px", borderRadius:20, background:`${statusColor[l.status]||"#475569"}22`, color:statusColor[l.status]||"#94a3b8", fontSize:12, fontWeight:600 }}>{l.status}</span>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    {l.status==="Pending" && (
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={()=>{setSelected(l);setActionType("approve");setComments("");}} style={{ padding:"5px 12px", background:"#10b98122", border:"1px solid #10b981", borderRadius:6, color:"#10b981", fontSize:12, cursor:"pointer" }}>✓</button>
                        <button onClick={()=>{setSelected(l);setActionType("reject");setComments("");}} style={{ padding:"5px 12px", background:"#ef444422", border:"1px solid #ef4444", borderRadius:6, color:"#ef4444", fontSize:12, cursor:"pointer" }}>✗</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#1e293b", borderRadius:16, padding:28, width:"100%", maxWidth:480, border:"1px solid #334155" }}>
            <h3 style={{ color:"#e2e8f0", margin:"0 0 8px" }}>{actionType==="approve"?"✓ Approve":"✗ Reject"} Leave</h3>
            <p style={{ color:"#94a3b8", margin:"0 0 4px", fontSize:14 }}><strong style={{color:"#e2e8f0"}}>{selected.employeeName}</strong></p>
            <p style={{ color:"#94a3b8", margin:"0 0 16px", fontSize:13 }}>{selected.leaveType}: {new Date(selected.fromDate).toLocaleDateString()} – {new Date(selected.toDate).toLocaleDateString()} ({selected.totalDays} days)</p>
            <textarea placeholder="Comments (optional)..." value={comments} onChange={e=>setComments(e.target.value)} rows={3} style={{ width:"100%", background:"#0f172a", border:"1px solid #334155", borderRadius:8, padding:"10px 14px", color:"#e2e8f0", fontSize:14, resize:"none", outline:"none", boxSizing:"border-box" }} />
            <div style={{ display:"flex", gap:12, marginTop:16, justifyContent:"flex-end" }}>
              <button onClick={()=>setSelected(null)} style={{ padding:"10px 20px", background:"#334155", border:"1px solid #475569", borderRadius:8, color:"#94a3b8", cursor:"pointer" }}>Cancel</button>
              <button onClick={()=>{if(actionType==="approve")approveMut.mutate({id:selected.leaveRequestId,c:comments});else rejectMut.mutate({id:selected.leaveRequestId,c:comments});}} disabled={approveMut.isPending||rejectMut.isPending} style={{ padding:"10px 20px", background:actionType==="approve"?"#10b981":"#ef4444", border:"none", borderRadius:8, color:"#fff", fontWeight:600, cursor:"pointer" }}>
                {(approveMut.isPending||rejectMut.isPending)?"Processing...":actionType==="approve"?"Confirm Approve":"Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
