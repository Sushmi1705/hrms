import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getManagerRequests, createManagerRequest } from "../api/mssApi";
import type { MssHRRequestDto } from "../types/mss";

const statusColor: Record<string,string> = { Open:"#6366f1", "In Progress":"#f59e0b", Resolved:"#10b981", Closed:"#64748b" };

export default function ManagerRequestsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ category:"Transfer", subject:"", description:"", priority:"Medium" });
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey:["mss-requests"], queryFn:()=>getManagerRequests() });
  const createMut = useMutation({ mutationFn:()=>createManagerRequest(form), onSuccess:()=>{qc.invalidateQueries({queryKey:["mss-requests"]});setShowCreate(false);setForm({category:"Transfer",subject:"",description:"",priority:"Medium"});} });

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ color:"#e2e8f0", fontSize:24, fontWeight:700, margin:0 }}>📁 HR Requests</h1>
          <p style={{ color:"#94a3b8", fontSize:14, marginTop:4 }}>Submit and track HR requests for your team</p>
        </div>
        <button onClick={()=>setShowCreate(true)} style={{ padding:"10px 20px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:8, color:"#fff", fontWeight:600, fontSize:14, cursor:"pointer" }}>+ New Request</button>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {isLoading ? <div style={{ padding:40, textAlign:"center", color:"#64748b" }}>Loading...</div>
        : !data?.length ? (
          <div style={{ padding:40, textAlign:"center", background:"#1e293b", borderRadius:12, border:"1px solid #334155" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📁</div>
            <div style={{ color:"#94a3b8", fontSize:16 }}>No HR requests yet</div>
            <button onClick={()=>setShowCreate(true)} style={{ marginTop:16, padding:"10px 20px", background:"#6366f1", border:"none", borderRadius:8, color:"#fff", cursor:"pointer" }}>Create First Request</button>
          </div>
        ) : data.map((r:MssHRRequestDto) => (
          <div key={r.requestId} style={{ background:"#1e293b", borderRadius:12, padding:"16px 20px", border:"1px solid #334155", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <code style={{ background:"#334155", color:"#94a3b8", padding:"2px 6px", borderRadius:4, fontSize:11 }}>{r.requestNumber}</code>
                <span style={{ padding:"3px 8px", borderRadius:20, background:"#6366f122", color:"#818cf8", fontSize:11 }}>{r.category}</span>
                <span style={{ padding:"3px 8px", borderRadius:20, background:r.priority==="High"?"#ef444422":"#33415522", color:r.priority==="High"?"#f87171":"#94a3b8", fontSize:11 }}>{r.priority}</span>
              </div>
              <div style={{ color:"#e2e8f0", fontWeight:600, fontSize:14 }}>{r.subject}</div>
              <div style={{ color:"#94a3b8", fontSize:13, marginTop:4 }}>{r.description}</div>
              <div style={{ color:"#64748b", fontSize:11, marginTop:4 }}>{new Date(r.submittedAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div>
            </div>
            <span style={{ padding:"6px 14px", borderRadius:20, background:`${statusColor[r.status]||"#475569"}22`, color:statusColor[r.status]||"#94a3b8", fontSize:13, fontWeight:600, flexShrink:0 }}>{r.status}</span>
          </div>
        ))}
      </div>

      {showCreate && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#1e293b", borderRadius:16, padding:28, width:"100%", maxWidth:520, border:"1px solid #334155" }}>
            <h3 style={{ color:"#e2e8f0", margin:"0 0 20px", fontSize:18 }}>+ New HR Request</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ color:"#94a3b8", fontSize:12, display:"block", marginBottom:6 }}>Category</label>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={{ width:"100%", background:"#0f172a", border:"1px solid #334155", borderRadius:8, padding:"10px 14px", color:"#e2e8f0", fontSize:14, outline:"none" }}>
                  {["Transfer","Promotion","Headcount","Schedule Change","Training Request","Policy Exception","Other"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color:"#94a3b8", fontSize:12, display:"block", marginBottom:6 }}>Subject</label>
                <input type="text" placeholder="Brief subject..." value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} style={{ width:"100%", background:"#0f172a", border:"1px solid #334155", borderRadius:8, padding:"10px 14px", color:"#e2e8f0", fontSize:14, outline:"none", boxSizing:"border-box" }} />
              </div>
              <div>
                <label style={{ color:"#94a3b8", fontSize:12, display:"block", marginBottom:6 }}>Description</label>
                <textarea placeholder="Describe the request..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={4} style={{ width:"100%", background:"#0f172a", border:"1px solid #334155", borderRadius:8, padding:"10px 14px", color:"#e2e8f0", fontSize:14, resize:"vertical", outline:"none", boxSizing:"border-box" }} />
              </div>
              <div>
                <label style={{ color:"#94a3b8", fontSize:12, display:"block", marginBottom:6 }}>Priority</label>
                <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} style={{ width:"100%", background:"#0f172a", border:"1px solid #334155", borderRadius:8, padding:"10px 14px", color:"#e2e8f0", fontSize:14, outline:"none" }}>
                  {["Low","Medium","High","Critical"].map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:"flex", gap:12, marginTop:20, justifyContent:"flex-end" }}>
              <button onClick={()=>setShowCreate(false)} style={{ padding:"10px 20px", background:"#334155", border:"1px solid #475569", borderRadius:8, color:"#94a3b8", cursor:"pointer" }}>Cancel</button>
              <button onClick={()=>createMut.mutate()} disabled={!form.subject||!form.description||createMut.isPending} style={{ padding:"10px 20px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:8, color:"#fff", fontWeight:600, cursor:"pointer", opacity:(!form.subject||!form.description)?0.5:1 }}>
                {createMut.isPending?"Submitting...":"Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
