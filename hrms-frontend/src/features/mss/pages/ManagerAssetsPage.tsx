import { useQuery } from "@tanstack/react-query";
import { getTeamAssets } from "../api/mssApi";
import type { MssTeamAssetDto } from "../types/mss";

export default function ManagerAssetsPage() {
  const { data, isLoading } = useQuery({ queryKey:["mss-assets"], queryFn: getTeamAssets });

  return (
    <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ color:"#e2e8f0", fontSize:24, fontWeight:700, margin:0 }}>💼 Team Assets</h1>
        <p style={{ color:"#94a3b8", fontSize:14, marginTop:4 }}>Assets assigned to your team members</p>
      </div>
      <div style={{ background:"#1e293b", borderRadius:12, border:"1px solid #334155", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#0f172a" }}>
                {["Employee","Asset Tag","Asset Name","Category","Condition","Status","Assigned"].map(h=>(
                  <th key={h} style={{ padding:"14px 16px", textAlign:"left", color:"#94a3b8", fontSize:12, fontWeight:600, textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} style={{padding:40,textAlign:"center",color:"#64748b"}}>Loading...</td></tr>
              : !data?.length ? <tr><td colSpan={7} style={{padding:40,textAlign:"center",color:"#64748b"}}>No assets assigned to team</td></tr>
              : data.map((a:MssTeamAssetDto) => (
                <tr key={a.assetId} style={{ borderTop:"1px solid #0f172a" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background="#1a2440"}
                  onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background="transparent"}>
                  <td style={{ padding:"14px 16px", color:"#e2e8f0", fontSize:13, fontWeight:500 }}>{a.employeeName}</td>
                  <td style={{ padding:"14px 16px" }}><code style={{ background:"#334155", color:"#94a3b8", padding:"3px 8px", borderRadius:4, fontSize:12 }}>{a.assetTag}</code></td>
                  <td style={{ padding:"14px 16px", color:"#cbd5e1", fontSize:13 }}>{a.assetName}</td>
                  <td style={{ padding:"14px 16px", color:"#94a3b8", fontSize:13 }}>{a.category}</td>
                  <td style={{ padding:"14px 16px", color:"#94a3b8", fontSize:12 }}>{a.condition||"—"}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ padding:"4px 10px", borderRadius:20, background:"#10b98122", color:"#10b981", fontSize:12, fontWeight:600 }}>{a.status}</span>
                  </td>
                  <td style={{ padding:"14px 16px", color:"#64748b", fontSize:12 }}>{new Date(a.assignedDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
