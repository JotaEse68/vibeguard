'use client'
import { useState } from 'react'
import { Shield, Download, Copy, Check, ChevronDown, ChevronUp, Lock, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import { AnalysisResponse, AuditResult } from '@/types'
import { generateMD } from '@/lib/report'

const SC: Record<string,{e:string;bg:string;bd:string;tx:string}> = {
  red:   {e:'🔴',bg:'rgba(239,68,68,0.1)',   bd:'rgba(239,68,68,0.3)',   tx:'#f87171'},
  yellow:{e:'🟡',bg:'rgba(245,158,11,0.1)',  bd:'rgba(245,158,11,0.3)',  tx:'#fbbf24'},
  green: {e:'✅',bg:'rgba(34,197,94,0.1)',   bd:'rgba(34,197,94,0.3)',   tx:'#4ade80'},
  skip:  {e:'⏭️',bg:'#111118',               bd:'#1e1e2e',               tx:'#6b7280'}
}
const EL: Record<string,string> = {minutes:'Min',hours:'Horas',days:'Días'}
const SV: Record<string,string> = {critical:'#f87171',high:'#fb923c',medium:'#fbbf24',low:'#94a3b8'}
const VD: Record<string,{l:string;c:string;b:string}> = {
  'lanza ya':                {l:'🚀 Lanza ya',                c:'#4ade80',b:'rgba(34,197,94,0.1)'},
  'arregla estos 3 primero': {l:'⚠️ Arregla estos 3 primero', c:'#fbbf24',b:'rgba(245,158,11,0.1)'},
  'no lances todavía':       {l:'🛑 No lances todavía',       c:'#fb923c',b:'rgba(249,115,22,0.1)'},
  'necesita trabajo serio':  {l:'🔴 Necesita trabajo serio',  c:'#f87171',b:'rgba(239,68,68,0.1)'}
}

function Card({r,isPro}:{r:AuditResult;isPro:boolean}) {
  const [open,setOpen] = useState(r.status==='red')
  const [cp,setCp] = useState(false)
  const c = SC[r.status]||SC.skip
  if (r.status==='skip') return null
  return (
    <div style={{border:`1px solid ${open?c.bd:'#1e1e2e'}`,borderRadius:12,overflow:'hidden',background:open?c.bg:'#111118',marginBottom:8}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'14px 16px',cursor:'pointer',background:'transparent',border:'none',color:'#e2e8f0',textAlign:'left'}}>
        <span style={{fontSize:16}}>{c.e}</span>
        <div style={{flex:1,minWidth:0}}>
          <p style={{fontWeight:500,fontSize:14,margin:0}}>{r.title}</p>
          {!open&&r.found&&<p style={{fontSize:12,color:'#6b7280',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.found}</p>}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
          {r.severity&&r.severity!=='low'&&<span style={{fontSize:11,fontFamily:'monospace',color:SV[r.severity]||'#94a3b8'}}>{r.severity.toUpperCase()}</span>}
          {r.effort&&r.status!=='green'&&<span style={{fontSize:11,color:'#6b7280'}}>{EL[r.effort]}</span>}
          {open?<ChevronUp size={13} color="#6b7280"/>:<ChevronDown size={13} color="#6b7280"/>}
        </div>
      </button>
      {open&&(
        <div style={{padding:'0 16px 16px',borderTop:'1px solid #1e1e2e'}}>
          <div style={{marginTop:12}}>
            <p style={{fontSize:11,color:'#6b7280',fontWeight:500,marginBottom:4}}>QUÉ ENCONTRÓ</p>
            <p style={{fontSize:13,lineHeight:1.6}}>{r.found}</p>
          </div>
          {r.status!=='green'&&<>
            <div style={{marginTop:10}}>
              <p style={{fontSize:11,color:'#6b7280',fontWeight:500,marginBottom:4}}>POR QUÉ IMPORTA</p>
              <p style={{fontSize:13,color:'#94a3b8',lineHeight:1.6}}>{r.risk}</p>
            </div>
            <div style={{marginTop:10}}>
              <p style={{fontSize:11,color:'#6b7280',fontWeight:500,marginBottom:4}}>CÓMO ARREGLARLO</p>
              <p style={{fontSize:13,color:'#94a3b8',lineHeight:1.6}}>{r.solution}</p>
            </div>
          </>}
          {isPro&&r.claudeCodePrompt?(
            <div style={{marginTop:12,background:'#0a0a0f',border:'1px solid #1e1e2e',borderRadius:8,padding:12}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                <span style={{fontSize:11,color:'#6b7280',fontWeight:500}}>PROMPT PARA CLAUDE CODE</span>
                <button onClick={()=>{navigator.clipboard.writeText(r.claudeCodePrompt!);setCp(true);setTimeout(()=>setCp(false),2000)}}
                  style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'#818cf8',background:'transparent',border:'none',cursor:'pointer'}}>
                  {cp?<><Check size={11}/>Copiado</>:<><Copy size={11}/>Copiar</>}
                </button>
              </div>
              <pre style={{fontSize:11,color:'#94a3b8',fontFamily:'monospace',lineHeight:1.5,whiteSpace:'pre-wrap',margin:0}}>{r.claudeCodePrompt}</pre>
            </div>
          ):!isPro&&(
            <div style={{marginTop:12,display:'flex',alignItems:'center',gap:8,background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:8,padding:'8px 12px'}}>
              <Lock size={12} color="#818cf8"/>
              <span style={{fontSize:12,color:'#818cf8'}}>Prompt de Claude Code disponible en PRO</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ReportView({data}:{data:AnalysisResponse}) {
  const {stack,results,summary,is_pro} = data
  const [dl,setDl] = useState(false)
  const v = VD[summary.launch_verdict]||VD['no lances todavía']
  const cats = [{k:'base',l:'🏗️ La base'},{k:'security',l:'🔒 Seguridad'},{k:'quality',l:'✨ Calidad'},{k:'production',l:'🚀 Producción'}]

  function download() {
    const md = generateMD(stack,results,summary,data.app_input||'')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([md],{type:'text/markdown'}))
    a.download = `vibeguard-${Date.now()}.md`; a.click()
    setDl(true); setTimeout(()=>setDl(false),2000)
  }

  return (
    <div className="animate-in" style={{marginTop:32}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Shield size={16} color="#6366f1"/>
          <span style={{fontWeight:600,fontSize:14}}>Reporte de auditoría</span>
          {is_pro&&<span style={{fontSize:11,background:'rgba(99,102,241,0.2)',color:'#818cf8',padding:'2px 8px',borderRadius:99}}>{data.points_analyzed} puntos · PRO</span>}
        </div>
        {is_pro&&<button onClick={download} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'#6366f1',border:'1px solid rgba(99,102,241,0.3)',background:'transparent',borderRadius:8,padding:'6px 12px',cursor:'pointer'}}>
          {dl?<><Check size={12}/>Descargado</>:<><Download size={12}/>Descargar MD</>}
        </button>}
      </div>

      <div style={{border:`1px solid ${v.c}40`,borderRadius:12,padding:20,background:v.b,marginBottom:16}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16}}>
          <div>
            <p style={{fontSize:18,fontWeight:700,color:v.c,marginBottom:4}}>{v.l}</p>
            <p style={{fontSize:13,color:'#94a3b8'}}>{summary.summary}</p>
          </div>
          <div style={{textAlign:'right',flexShrink:0}}>
            <p style={{fontSize:32,fontWeight:700}}>{summary.overall_score}</p>
            <p style={{fontSize:11,color:'#6b7280'}}>/100</p>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:16}}>
          {[{l:'Crítico/Alto',v:(summary.critical_count||0)+(summary.high_count||0),I:AlertTriangle,c:'#f87171'},{l:'Atención',v:summary.medium_count||0,I:Zap,c:'#fbbf24'},{l:'OK',v:summary.green_count||0,I:CheckCircle,c:'#4ade80'}].map(s=>(
            <div key={s.l} style={{background:'rgba(0,0,0,0.2)',borderRadius:8,padding:'10px 0',textAlign:'center'}}>
              <p style={{fontSize:22,fontWeight:700,color:s.c}}>{s.v}</p>
              <p style={{fontSize:11,color:'#6b7280'}}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {summary.top_3_fixes?.length>0&&(
        <div style={{background:'#111118',border:'1px solid #1e1e2e',borderRadius:12,padding:16,marginBottom:16}}>
          <p style={{fontSize:13,fontWeight:600,marginBottom:10,display:'flex',alignItems:'center',gap:6}}><Zap size={14} color="#f59e0b"/>Arregla esto primero</p>
          <ol style={{paddingLeft:0,listStyle:'none',margin:0}}>
            {summary.top_3_fixes.map((f,i)=>(
              <li key={f.id} style={{display:'flex',gap:8,fontSize:13,marginBottom:6}}>
                <span style={{color:'#6366f1',fontWeight:700,fontFamily:'monospace',flexShrink:0}}>{i+1}.</span>
                <span><span style={{fontWeight:500}}>{f.title}</span><span style={{color:'#94a3b8'}}> — {f.why_urgent}</span></span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div style={{background:'#111118',border:'1px solid #1e1e2e',borderRadius:12,padding:16,marginBottom:20}}>
        <p style={{fontSize:11,color:'#6b7280',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:10}}>Stack detectado</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {[['Framework',stack.framework],['BD',stack.database],['Auth',stack.auth],['Hosting',stack.hosting],['Pagos',stack.payments]].map(([l,v])=>
            v&&v!=='unknown'&&v!=='none'?(
              <span key={String(l)} style={{fontSize:11,background:'#1e1e2e',color:'#94a3b8',padding:'3px 10px',borderRadius:99}}>
                <span style={{color:'#6b7280'}}>{l}: </span>{String(v)}
              </span>
            ):null
          )}
          {stack.ai_apis?.length>0&&<span style={{fontSize:11,background:'#1e1e2e',color:'#94a3b8',padding:'3px 10px',borderRadius:99}}><span style={{color:'#6b7280'}}>IA: </span>{stack.ai_apis.join(', ')}</span>}
          {!stack.has_tests&&<span style={{fontSize:11,background:'rgba(239,68,68,0.1)',color:'#f87171',border:'1px solid rgba(239,68,68,0.3)',padding:'3px 10px',borderRadius:99}}>Sin tests</span>}
          {!stack.has_gitignore&&<span style={{fontSize:11,background:'rgba(245,158,11,0.1)',color:'#fbbf24',border:'1px solid rgba(245,158,11,0.3)',padding:'3px 10px',borderRadius:99}}>Sin .gitignore</span>}
        </div>
      </div>

      {cats.map(cat=>{
        const items = results.filter(r=>r.category===cat.k)
        if (!items.length) return null
        return (
          <div key={cat.k} style={{marginBottom:20}}>
            <p style={{fontSize:12,color:'#6b7280',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:10}}>{cat.l}</p>
            {items.map(r=><Card key={r.id} r={r} isPro={is_pro}/>)}
          </div>
        )
      })}

      {!is_pro&&(
        <div style={{background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:12,padding:24,textAlign:'center',marginTop:8}}>
          <Lock size={20} color="#6366f1" style={{margin:'0 auto 10px'}}/>
          <p style={{fontWeight:600,marginBottom:6}}>17 puntos más en PRO</p>
          <p style={{fontSize:13,color:'#94a3b8',marginBottom:16}}>Seguridad, calidad y producción — con soluciones y prompts para Claude Code.</p>
          <a href="#precios" style={{display:'inline-block',background:'#6366f1',color:'white',padding:'10px 20px',borderRadius:8,fontSize:13,fontWeight:600,textDecoration:'none'}}>Ver planes PRO</a>
        </div>
      )}

      <p style={{textAlign:'center',fontSize:12,color:'#6b7280',marginTop:16}}>
        ¿Repo privado? Conviértelo a MD en{' '}
        <a href="https://tokenslayer.netlify.app" target="_blank" rel="noopener noreferrer" style={{color:'#6366f1'}}>TokenSlayer — gratis</a>
      </p>
    </div>
  )
}
