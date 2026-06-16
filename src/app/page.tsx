'use client'
import { useState, useRef } from 'react'
import { Shield, Github, FileText, ArrowRight, Check, Zap, Star, AlertTriangle, ExternalLink } from 'lucide-react'
import { AnalysisResponse } from '@/types'
import ReportView from '@/components/report/ReportView'

const MSGS = ['Detectando stack...','Analizando seguridad...','Auditando calidad y producción...','Generando reporte...']

export default function Home() {
  const [tab,setTab] = useState<'github'|'markdown'>('github')
  const [url,setUrl] = useState('')
  const [md,setMd] = useState('')
  const [pro,setPro] = useState(false)
  const [loading,setLoading] = useState(false)
  const [msg,setMsg] = useState('')
  const [result,setResult] = useState<AnalysisResponse|null>(null)
  const [err,setErr] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function analyze() {
    setErr(''); setResult(null)
    if (tab==='github'&&!url.includes('github.com')) { setErr('Introduce una URL válida de GitHub'); return }
    if (tab==='markdown'&&!md.trim()) { setErr('Pega el Markdown o sube un archivo .md'); return }
    setLoading(true); let i=0; setMsg(MSGS[0])
    const t = setInterval(()=>{ i=(i+1)%MSGS.length; setMsg(MSGS[i]) },4000)
    try {
      const res = await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input_type:tab,github_url:tab==='github'?url:undefined,markdown_content:tab==='markdown'?md:undefined,is_pro:pro})})
      const data = await res.json()
      if (!res.ok) throw new Error(data.error||'Error en el análisis')
      setResult(data)
      setTimeout(()=>document.getElementById('report')?.scrollIntoView({behavior:'smooth'}),100)
    } catch(e) { setErr(e instanceof Error?e.message:'Error inesperado') }
    finally { clearInterval(t); setLoading(false) }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f=e.target.files?.[0]; if(!f) return
    const r=new FileReader(); r.onload=ev=>setMd(String(ev.target?.result||'')); r.readAsText(f)
  }

  const btn = {background:'transparent',border:'none',cursor:'pointer',color:'inherit'}

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',color:'#e2e8f0',fontFamily:'Inter,system-ui,sans-serif'}}>

      {/* NAV */}
      <nav style={{borderBottom:'1px solid #1e1e2e',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Shield color="#6366f1" size={20}/>
          <span style={{fontWeight:600}}>Vibegu<span style={{color:'#6366f1'}}>ARD</span></span>
          <span style={{fontSize:11,color:'#6b7280',marginLeft:4}}>by Jota!</span>
        </div>
        <div style={{display:'flex',gap:20,fontSize:13,color:'#94a3b8'}}>
          <a href="#como-funciona" style={{color:'#94a3b8',textDecoration:'none'}}>Cómo funciona</a>
          <a href="#puntos" style={{color:'#94a3b8',textDecoration:'none'}}>22 puntos</a>
          <a href="#precios" style={{color:'#94a3b8',textDecoration:'none'}}>Precios</a>
          <a href="https://tokenslayer.netlify.app" target="_blank" rel="noopener noreferrer" style={{color:'#94a3b8',textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>TokenSlayer <ExternalLink size={11}/></a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{maxWidth:800,margin:'0 auto',padding:'80px 24px 60px',textAlign:'center'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'#111118',border:'1px solid #1e1e2e',borderRadius:99,padding:'6px 16px',fontSize:12,color:'#94a3b8',marginBottom:32}}>
          <Zap size={11} color="#6366f1"/>22 puntos · Stack automático · Prompts para Claude Code
        </div>
        <h1 style={{fontSize:48,fontWeight:700,lineHeight:1.15,marginBottom:20,letterSpacing:'-0.02em'}}>
          Audita tu app<br/><span style={{color:'#6366f1'}}>antes de que lo haga</span><br/>alguien con malas intenciones
        </h1>
        <p style={{fontSize:17,color:'#94a3b8',maxWidth:480,margin:'0 auto 48px',lineHeight:1.7}}>
          Los vibe coders lanzan rápido. Eso está bien.<br/>Lanzar con vulnerabilidades abiertas, no tanto.
        </p>

        {/* INPUT BOX */}
        <div style={{background:'#111118',border:'1px solid #1e1e2e',borderRadius:16,padding:24,textAlign:'left',boxShadow:'0 0 40px rgba(99,102,241,0.08)'}}>
          {/* Tabs */}
          <div style={{display:'flex',gap:4,background:'#0a0a0f',borderRadius:10,padding:4,marginBottom:20}}>
            {([['github','URL de GitHub',Github],['markdown','Archivo MD',FileText]] as const).map(([k,l,Icon])=>(
              <button key={k} onClick={()=>setTab(k)} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'8px 0',borderRadius:8,fontSize:13,fontWeight:500,border:'none',cursor:'pointer',transition:'all 0.15s',background:tab===k?'#6366f1':'transparent',color:tab===k?'white':'#94a3b8'}}>
                <Icon size={14}/>{l}
              </button>
            ))}
          </div>

          {tab==='github'?(
            <div style={{marginBottom:16}}>
              <input type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://github.com/usuario/mi-app"
                style={{width:'100%',background:'#0a0a0f',border:'1px solid #1e1e2e',borderRadius:10,padding:'12px 16px',fontSize:13,color:'white',outline:'none',fontFamily:'monospace',boxSizing:'border-box'}}
                onFocus={e=>{e.target.style.borderColor='#6366f1'}} onBlur={e=>{e.target.style.borderColor='#1e1e2e'}}/>
              <p style={{fontSize:12,color:'#6b7280',marginTop:6}}>Solo repos públicos. Para privados usa el archivo MD.</p>
            </div>
          ):(
            <div style={{marginBottom:16}}>
              <textarea value={md} onChange={e=>setMd(e.target.value)} rows={5} placeholder="Pega aquí el Markdown de tu repo (generado con Repomix o TokenSlayer)..."
                style={{width:'100%',background:'#0a0a0f',border:'1px solid #1e1e2e',borderRadius:10,padding:'12px 16px',fontSize:12,color:'white',outline:'none',fontFamily:'monospace',resize:'none',boxSizing:'border-box'}}
                onFocus={e=>{e.target.style.borderColor='#6366f1'}} onBlur={e=>{e.target.style.borderColor='#1e1e2e'}}/>
              <div style={{display:'flex',gap:12,marginTop:8}}>
                <button onClick={()=>fileRef.current?.click()} style={{...btn,fontSize:12,color:'#6366f1',display:'flex',alignItems:'center',gap:4}}><FileText size={12}/>Subir .md</button>
                <span style={{color:'#4b5563',fontSize:12}}>·</span>
                <a href="https://tokenslayer.netlify.app" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:'#94a3b8',textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>Convertir con TokenSlayer <ExternalLink size={10}/></a>
                <input ref={fileRef} type="file" accept=".md,.txt" style={{display:'none'}} onChange={onFile}/>
              </div>
            </div>
          )}

          {/* Toggle PRO */}
          <div style={{display:'flex',alignItems:'center',gap:12,background:'#0a0a0f',border:'1px solid #1e1e2e',borderRadius:10,padding:12,marginBottom:16}}>
            <button onClick={()=>setPro(!pro)} style={{position:'relative',width:40,height:20,borderRadius:99,border:'none',cursor:'pointer',background:pro?'#6366f1':'#1e1e2e',flexShrink:0,transition:'background 0.2s'}}>
              <span style={{position:'absolute',top:2,left:2,width:16,height:16,borderRadius:'50%',background:'white',transition:'transform 0.2s',transform:pro?'translateX(20px)':'translateX(0)'}}/>
            </button>
            <div>
              <span style={{fontSize:13,fontWeight:500}}>Análisis PRO</span>
              <span style={{fontSize:12,color:'#6b7280',marginLeft:8}}>{pro?'22 puntos + prompts Claude Code':'5 puntos base · gratis'}</span>
            </div>
            {pro&&<span style={{marginLeft:'auto',fontSize:11,background:'rgba(99,102,241,0.2)',color:'#818cf8',padding:'2px 8px',borderRadius:99}}>PRO</span>}
          </div>

          {err&&(
            <div style={{display:'flex',alignItems:'flex-start',gap:8,background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:10,padding:'10px 14px',marginBottom:16}}>
              <AlertTriangle size={14} color="#f87171" style={{flexShrink:0,marginTop:1}}/>
              <p style={{fontSize:13,color:'#fca5a5',margin:0}}>{err}</p>
            </div>
          )}

          <button onClick={analyze} disabled={loading}
            style={{width:'100%',background:'#6366f1',color:'white',border:'none',borderRadius:10,padding:'13px 0',fontSize:14,fontWeight:600,cursor:loading?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:loading?0.8:1}}>
            {loading?(<><span style={{width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>{msg}</>):(<><Shield size={14}/>Auditar ahora {!pro&&'— gratis'}<ArrowRight size={14}/></>)}
          </button>
        </div>
      </section>

      {/* REPORT */}
      {result&&(
        <section id="report" style={{maxWidth:800,margin:'0 auto',padding:'0 24px 80px'}}>
          <ReportView data={result}/>
        </section>
      )}

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" style={{borderTop:'1px solid #1e1e2e',padding:'80px 24px'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <h2 style={{fontSize:26,fontWeight:700,textAlign:'center',marginBottom:12}}>Cómo funciona</h2>
          <p style={{color:'#94a3b8',textAlign:'center',marginBottom:48}}>3 pasos. Sin instalación. Sin registro para el plan Free.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
            {[{n:'01',t:'Pega la URL o el MD',d:'URL de tu repo GitHub público, o el MD generado con Repomix o TokenSlayer si el repo es privado.'},
              {n:'02',t:'VibeguARD analiza',d:'Detecta tu stack automáticamente y audita los puntos adaptados a tu tecnología real, no en genérico.'},
              {n:'03',t:'Recibes el reporte',d:'Semáforo, riesgo explicado en simple, solución concreta y prompt listo para Claude Code.'}
            ].map(s=>(
              <div key={s.n} style={{background:'#111118',border:'1px solid #1e1e2e',borderRadius:12,padding:20}}>
                <p style={{fontSize:36,fontWeight:700,fontFamily:'monospace',color:'rgba(99,102,241,0.3)',marginBottom:12}}>{s.n}</p>
                <p style={{fontWeight:600,marginBottom:8}}>{s.t}</p>
                <p style={{fontSize:13,color:'#94a3b8',lineHeight:1.6}}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 22 PUNTOS */}
      <section id="puntos" style={{borderTop:'1px solid #1e1e2e',padding:'80px 24px',background:'rgba(17,17,24,0.5)'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <h2 style={{fontSize:26,fontWeight:700,textAlign:'center',marginBottom:12}}>22 puntos de auditoría</h2>
          <p style={{color:'#94a3b8',textAlign:'center',marginBottom:48}}>Organizados en 4 categorías. Adaptados al stack de tu app.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:12}}>
            {[{e:'🏗️',l:'La base',pl:'Free',pts:['Front-end sin filtraciones','Base de datos con candado (RLS)','Control de versiones limpio','APIs autenticadas y validadas','Variables de entorno correctas']},
              {e:'🔒',l:'Seguridad',pl:'PRO',pts:['Autenticación y sesiones','Rate limiting en endpoints caros','Sanitización de inputs','Dependencias sin vulnerabilidades']},
              {e:'✨',l:'Calidad',pl:'PRO',pts:['Gestión de errores completa','Calidad y limpieza de código','UX: estados de carga y error','Accesibilidad básica','Documentación interna']},
              {e:'🚀',l:'Producción',pl:'PRO',pts:['Hosting y deploy estable','Rendimiento y caché','Escalabilidad bajo carga','Monitoreo y alertas','Tests mínimos','SEO técnico básico','GDPR y privacidad','Pagos seguros']}
            ].map(c=>(
              <div key={c.l} style={{background:'#111118',border:'1px solid #1e1e2e',borderRadius:12,padding:20}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
                  <span style={{fontSize:20}}>{c.e}</span>
                  <span style={{fontWeight:600}}>{c.l}</span>
                  <span style={{marginLeft:'auto',fontSize:11,padding:'2px 8px',borderRadius:99,background:c.pl==='Free'?'rgba(99,102,241,0.2)':'rgba(245,158,11,0.2)',color:c.pl==='Free'?'#818cf8':'#fbbf24'}}>{c.pl}</span>
                </div>
                <ul style={{listStyle:'none',padding:0,margin:0}}>
                  {c.pts.map(p=>(
                    <li key={p} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'#94a3b8',marginBottom:6}}>
                      <Check size={12} color="#6366f1" style={{flexShrink:0}}/>{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" style={{borderTop:'1px solid #1e1e2e',padding:'80px 24px'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <h2 style={{fontSize:26,fontWeight:700,textAlign:'center',marginBottom:12}}>Precios</h2>
          <p style={{color:'#94a3b8',textAlign:'center',marginBottom:48}}>Sin sorpresas. Sin tarjeta para el plan Free.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
            <div style={{background:'#111118',border:'1px solid #1e1e2e',borderRadius:16,padding:24}}>
              <p style={{fontSize:28,fontWeight:700,marginBottom:4}}>$0</p>
              <p style={{fontSize:13,color:'#94a3b8',marginBottom:20}}>para siempre</p>
              <ul style={{listStyle:'none',padding:0,margin:'0 0 24px'}}>
                {['1 auditoría al día','5 puntos de la base','Stack automático','Semáforo de resultados'].map(f=>(
                  <li key={f} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,marginBottom:10}}><Check size={13} color="#4ade80"/>{f}</li>
                ))}
              </ul>
              <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
                style={{width:'100%',padding:'10px 0',borderRadius:10,border:'1px solid #1e1e2e',background:'transparent',color:'#94a3b8',fontSize:13,fontWeight:500,cursor:'pointer'}}>
                Empezar gratis
              </button>
            </div>
            <div style={{background:'#111118',border:'1px solid #6366f1',borderRadius:16,padding:24,position:'relative',boxShadow:'0 0 30px rgba(99,102,241,0.15)'}}>
              <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'#6366f1',color:'white',fontSize:11,padding:'4px 12px',borderRadius:99,display:'flex',alignItems:'center',gap:4}}>
                <Star size={10} fill="currentColor"/>Mejor valor
              </div>
              <p style={{fontSize:28,fontWeight:700,marginBottom:4}}>$9<span style={{fontSize:14,fontWeight:400,color:'#94a3b8'}}>/mes</span></p>
              <p style={{fontSize:13,color:'#94a3b8',marginBottom:4}}>o <strong style={{color:'white'}}>$59/año</strong> — ahorra 45%</p>
              <p style={{fontSize:11,color:'#6b7280',marginBottom:20}}>= $4.9/mes facturado anualmente</p>
              <ul style={{listStyle:'none',padding:0,margin:'0 0 24px'}}>
                {['Todo lo del plan Free','Auditorías ilimitadas','22 puntos completos','Soluciones concretas','Prompts para Claude Code','Reporte descargable en MD'].map(f=>(
                  <li key={f} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,marginBottom:10}}><Check size={13} color="#6366f1"/>{f}</li>
                ))}
              </ul>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <button onClick={()=>fetch('/api/stripe/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan:'annual'})}).then(r=>r.json()).then(d=>d.url&&(window.location.href=d.url))}
                  style={{width:'100%',padding:'11px 0',borderRadius:10,border:'none',background:'#6366f1',color:'white',fontSize:13,fontWeight:600,cursor:'pointer'}}>
                  PRO Anual — $59/año
                </button>
                <button onClick={()=>fetch('/api/stripe/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan:'monthly'})}).then(r=>r.json()).then(d=>d.url&&(window.location.href=d.url))}
                  style={{width:'100%',padding:'10px 0',borderRadius:10,border:'1px solid #1e1e2e',background:'transparent',color:'#94a3b8',fontSize:13,fontWeight:500,cursor:'pointer'}}>
                  PRO Mensual — $9/mes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:'1px solid #1e1e2e',padding:'40px 24px',textAlign:'center'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:12}}>
          <Shield size={15} color="#6366f1"/>
          <span style={{fontSize:13,fontWeight:500}}>VibeguARD <span style={{color:'#6b7280'}}>by Jota!</span></span>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:20,fontSize:12,color:'#6b7280'}}>
          <a href="https://tokenslayer.netlify.app" target="_blank" rel="noopener noreferrer" style={{color:'#6b7280',textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>TokenSlayer <ExternalLink size={10}/></a>
          <span>·</span>
          <span>Audit your AI-built app before the internet does.</span>
        </div>
      </footer>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
