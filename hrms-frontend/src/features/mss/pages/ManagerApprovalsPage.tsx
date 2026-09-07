import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getManagerApprovals, approveLeave, rejectLeave, approveAttendanceRequest, rejectAttendanceRequest } from "../api/mssApi";
import type { MssApprovalItemDto } from "../types/mss";

const catColor: Record<string, string> = { Leave:"#8b5cf6", Attendance:"#10b981", Performance:"#f59e0b", Compensation:"#ec4899", Default:"#6366f1" };

export default function ManagerApprovalsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [comments, setComments] = useState("");
  const [selected, setSelected] = useState<MssApprovalItemDto | null>(null);
  const [actionType, setActionType] = useState<"approve"|"reject"|null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["mss-approvals", activeCategory],
    queryFn: () => getManagerApprovals(activeCategory === "All" ? undefined : activeCategory),
  });

  const approveMutation = useMutation({
    mutationFn: async ({ item, comments }: { item: MssApprovalItemDto, comments: string }) => {
      if (item.category === "Leave") return approveLeave(item.approvalId, comments);
      if (item.category === "Attendance") return approveAttendanceRequest(item.approvalId, comments);
    },
    onSuccess: () => { qc.invalidateQueries({queryKey:["mss-approvals"]}); qc.invalidateQueries({queryKey:["mss-dashboard"]}); setSelected(null); setComments(""); },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ item, comments }: { item: MssApprovalItemDto, comments: string }) => {
      if (item.category === "Leave") return rejectLeave(item.approvalId, comments);
      if (item.category === "Attendance") return rejectAttendanceRequest(item.approvalId, comments);
    },
    onSuccess: () => { qc.invalidateQueries({queryKey:["mss-approvals"]}); qc.invalidateQueries({queryKey:["mss-dashboard"]}); setSelected(null); setComments(""); },
  });

  const categories = ["All","Leave","Attendance","Performance","Compensation"];

  const handleAction = () => {
    if (!selected) return;
    if (actionType === "approve") approveMutation.mutate({ item: selected, comments });
    else rejectMutation.mutate({ item: selected, comments });
  };

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ color:"#e2e8f0", fontSize:24, fontWeight:700, margin:0 }}>📋 Approval Inbox</h1>
        <p style={{ color:"#94a3b8", fontSize:14, marginTop:4 }}>Review and approve team requests</p>
      </div>

      {/* Category Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={()=>setActiveCategory(cat)} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid", borderColor:activeCategory===cat?"#6366f1":"#334155", background:activeCategory===cat?"#6366f133":"#1e293b", color:activeCategory===cat?"#a5b4fc":"#94a3b8", fontSize:13, fontWeight:activeCategory===cat?600:400, cursor:"pointer", transition:"all 0.2s" }}>
            {cat} {cat!=="All" && data ? `(${data.filter((i:MssApprovalItemDto)=>i.category===cat).length})` : data ? `(${data.length})` : ""}
          </button>
        ))}
      </div>

      {/* Approvals List */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {isLoading ? (
          <div style={{ padding:40, textAlign:"center", color:"#64748b", background:"#1e293b", borderRadius:12 }}>Loading approvals...</div>
        ) : !data?.length ? (
          <div style={{ padding:40, textAlign:"center", background:"#1e293b", borderRadius:12, border:"1px solid #334155" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
            <div style={{ color:"#10b981", fontSize:18, fontWeight:600 }}>All caught up!</div>
            <div style={{ color:"#64748b", fontSize:14, marginTop:8 }}>No pending approvals</div>
          </div>
        ) : data.map((item: MssApprovalItemDto) => (
          <div key={item.approvalId} style={{ background:"#1e293b", borderRadius:12, padding:"16px 20px", border:"1px solid #334155", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <div style={{ width:40, height:40, borderRadius:10, background:`${catColor[item.category]||catColor.Default}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
              {item.category==="Leave"?"🏖️":item.category==="Attendance"?"⏰":item.category==="Performance"?"⭐":"📁"}
            </div>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <span style={{ padding:"3px 10px", borderRadius:20, background:`${catColor[item.category]||catColor.Default}22`, color:catColor[item.category]||catColor.Default, fontSize:11, fontWeight:600 }}>{item.category}</span>
                <span style={{ padding:"3px 10px", borderRadius:20, background:item.priority==="High"?"#ef444422":"#33415522", color:item.priority==="High"?"#f87171":"#94a3b8", fontSize:11 }}>{item.priority}</span>
              </div>
              <div style={{ color:"#e2e8f0", fontWeight:500, fontSize:14 }}>{item.employeeName}</div>
              <div style={{ color:"#94a3b8", fontSize:13, marginTop:2 }}>{item.description}</div>
              <div style={{ color:"#64748b", fontSize:11, marginTop:4 }}>Submitted: {new Date(item.submittedAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
            </div>
            <div style={{ display:"flex", gap:8, flexShrink:0 }}>
              <button onClick={()=>{setSelected(item);setActionType("approve");setComments("");}} style={{ padding:"8px 16px", background:"#10b98122", border:"1px solid #10b981", borderRadius:8, color:"#10b981", fontSize:13, fontWeight:600, cursor:"pointer" }}>✓ Approve</button>
              <button onClick={()=>{setSelected(item);setActionType("reject");setComments("");}} style={{ padding:"8px 16px", background:"#ef444422", border:"1px solid #ef4444", borderRadius:8, color:"#ef4444", fontSize:13, fontWeight:600, cursor:"pointer" }}>✗ Reject</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#1e293b", borderRadius:16, padding:28, width:"100%", maxWidth:480, border:"1px solid #334155" }}>
            <h3 style={{ color:"#e2e8f0", margin:"0 0 8px", fontSize:18 }}>{actionType==="approve"?"✓ Approve":"✗ Reject"} Request</h3>
            <p style={{ color:"#94a3b8", margin:"0 0 16px", fontSize:14 }}><strong style={{color:"#e2e8f0"}}>{selected.employeeName}</strong> — {selected.description}</p>
            <textarea placeholder={`Add comments (${actionType==="reject"?"required":"optional"})...`} value={comments} onChange={e=>setComments(e.target.value)} rows={4} style={{ width:"100%", background:"#0f172a", border:"1px solid #334155", borderRadius:8, padding:"10px 14px", color:"#e2e8f0", fontSize:14, resize:"vertical", outline:"none", boxSizing:"border-box" }} />
            <div style={{ display:"flex", gap:12, marginTop:16, justifyContent:"flex-end" }}>
              <button onClick={()=>setSelected(null)} style={{ padding:"10px 20px", background:"#334155", border:"1px solid #475569", borderRadius:8, color:"#94a3b8", fontSize:14, cursor:"pointer" }}>Cancel</button>
              <button onClick={handleAction} disabled={approveMutation.isPending || rejectMutation.isPending} style={{ padding:"10px 20px", background:actionType==="approve"?"#10b981":"#ef4444", border:"none", borderRadius:8, color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer" }}>
                {(approveMutation.isPending || rejectMutation.isPending) ? "Processing..." : actionType==="approve"?"Confirm Approve":"Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
