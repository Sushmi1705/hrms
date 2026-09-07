import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getAttendanceRequests, approveAttendanceRequest, rejectAttendanceRequest } from "../api/mssApi";
import type { MssAttendanceRequestDto } from "../types/mss";

const statusColor: Record<string,string> = { Approved:"#10b981", Pending:"#f59e0b", Rejected:"#ef4444" };

export default function ManagerAttendanceRequestsPage() {
  const [status, setStatus] = useState("Pending");
  const [selected, setSelected] = useState<MssAttendanceRequestDto|null>(null);
  const [actionType, setActionType] = useState<"approve"|"reject">("approve");
  const [comments, setComments] = useState("");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey:["mss-att-requests",status], queryFn:()=>getAttendanceRequests(status||undefined) });
  const approveMut = useMutation({ mutationFn:({id,c}:{id:string,c:string})=>approveAttendanceRequest(id,c), onSuccess:()=>{qc.invalidateQueries({queryKey:["mss-att-requests"]});setSelected(null);} });
  const rejectMut = useMutation({ mutationFn:({id,c}:{id:string,c:string})=>rejectAttendanceRequest(id,c), onSuccess:()=>{qc.invalidateQueries({queryKey:["mss-att-requests"]});setSelected(null);} });

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ color:"#e2e8f0", fontSize:24, fontWeight:700, margin:0 }}>⏰ Attendance Requests</h1>
        <p style={{ color:"#94a3b8", fontSize:14, marginTop:4 }}>Attendance corrections and regularization requests from your team</p>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {["Pending","Approved","Rejected",""].map(s => (
          <button key={s||"All"} onClick={()=>setStatus(s)} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid", borderColor:status===s?"#6366f1":"#334155", background:status===s?"#6366f133":"#1e293b", color:status===s?"#a5b4fc":"#94a3b8", fontSize:13, cursor:"pointer" }}>
            {s||"All"}
          </button>
        ))}
      </div>

      <div style={{ background:"#1e293b", borderRadius:12, border:"1px solid #334155", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#0f172a" }}>
                {["Employee","Date","Type","Requested","Reason","Status","Action"].map(h=>(
                  <th key={h} style={{ padding:"14px 16px", textAlign:"left", color:"#94a3b8", fontSize:12, fontWeight:600, textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} style={{padding:40,textAlign:"center",color:"#64748b"}}>Loading...</td></tr>
              : !data?.length ? <tr><td colSpan={7} style={{padding:40,textAlign:"center",color:"#64748b"}}>No requests found</td></tr>
              : data.map((req: MssAttendanceRequestDto) => (
                <tr key={req.requestId} style={{ borderTop:"1px solid #0f172a" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background="#1a2440"}
                  onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background="transparent"}>
                  <td style={{ padding:"14px 16px", color:"#e2e8f0", fontSize:13, fontWeight:500 }}>{req.employeeName}</td>
                  <td style={{ padding:"14px 16px", color:"#94a3b8", fontSize:13 }}>{new Date(req.attendanceDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</td>
                  <td style={{ padding:"14px 16px", color:"#cbd5e1", fontSize:13 }}>{req.requestType}</td>
                  <td style={{ padding:"14px 16px", color:"#94a3b8", fontSize:12 }}>
                    {req.requestedClockIn && <div>In: {req.requestedClockIn}</div>}
                    {req.requestedClockOut && <div>Out: {req.requestedClockOut}</div>}
                    {!req.requestedClockIn && !req.requestedClockOut && "—"}
                  </td>
                  <td style={{ padding:"14px 16px", color:"#94a3b8", fontSize:12, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={req.reason}>{req.reason}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ padding:"4px 10px", borderRadius:20, background:`${statusColor[req.status]||"#475569"}22`, color:statusColor[req.status]||"#94a3b8", fontSize:12, fontWeight:600 }}>{req.status}</span>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    {req.status==="Pending" && (
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={()=>{setSelected(req);setActionType("approve");setComments("");}} style={{ padding:"5px 12px", background:"#10b98122", border:"1px solid #10b981", borderRadius:6, color:"#10b981", fontSize:12, cursor:"pointer" }}>✓</button>
                        <button onClick={()=>{setSelected(req);setActionType("reject");setComments("");}} style={{ padding:"5px 12px", background:"#ef444422", border:"1px solid #ef4444", borderRadius:6, color:"#ef4444", fontSize:12, cursor:"pointer" }}>✗</button>
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
            <h3 style={{ color:"#e2e8f0", margin:"0 0 12px" }}>{actionType==="approve"?"✓ Approve":"✗ Reject"} Request</h3>
            <p style={{ color:"#94a3b8", fontSize:13, margin:"0 0 16px" }}>{selected.employeeName} — {selected.requestType} on {new Date(selected.attendanceDate).toLocaleDateString()}</p>
            <textarea placeholder="Comments..." value={comments} onChange={e=>setComments(e.target.value)} rows={3} style={{ width:"100%", background:"#0f172a", border:"1px solid #334155", borderRadius:8, padding:"10px 14px", color:"#e2e8f0", fontSize:14, resize:"none", outline:"none", boxSizing:"border-box" }} />
            <div style={{ display:"flex", gap:12, marginTop:16, justifyContent:"flex-end" }}>
              <button onClick={()=>setSelected(null)} style={{ padding:"10px 20px", background:"#334155", border:"1px solid #475569", borderRadius:8, color:"#94a3b8", cursor:"pointer" }}>Cancel</button>
              <button onClick={()=>{if(actionType==="approve")approveMut.mutate({id:selected.requestId,c:comments});else rejectMut.mutate({id:selected.requestId,c:comments});}} disabled={approveMut.isPending||rejectMut.isPending} style={{ padding:"10px 20px", background:actionType==="approve"?"#10b981":"#ef4444", border:"none", borderRadius:8, color:"#fff", fontWeight:600, cursor:"pointer" }}>
                {(approveMut.isPending||rejectMut.isPending)?"Processing...":actionType==="approve"?"Approve":"Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
