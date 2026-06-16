'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { Shield, Check, Star } from 'lucide-react'

function Pricing() {
  const p = useSearchParams()
  async function go(plan: string) {
    const r = await fetch('/api/stripe/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan})})
    const d = await r.json()
    if (d.url) window.location.href = d.url
  }
  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',color:'#e2e8f0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'80px 24px',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:40}}>
        <Shield color="#6366f1" size={18}/>
        <span style={{fontWeight:600}}>Vibegu<span style={{color:'#6366f1'}}>ARD</span> <span style={{color:'#6b7280'}}>by Jota!</span></span>
      </div>
      {p.get('success')&&<div style={{background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.3)',borderRadius:12,padding:'16px 24px',marginBottom:32,textAlign:'center'}}>
        <p style={{color:'#4ade80',fontWeight:600}}>¡Bienvenido a PRO! 🎉</p>
        <p style={{fontSize:13,color:'#94a3b8',marginTop:4}}>Acceso activo. Activa el toggle PRO en la app.</p>
      </div>}
      {p.get('canceled')&&<div style={{background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:12,padding:'12px 24px',marginBottom:32}}>
        <p style={{color:'#fbbf24'}}>Pago cancelado. Puedes intentarlo cuando quieras.</p>
      </div>}
      <h1 style={{fontSize:28,fontWeight:700,marginBottom:40,textAlign:'center'}}>Planes VibeguARD</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16,width:'100%',maxWidth:600}}>
        <div style={{background:'#111118',border:'1px solid #1e1e2e',borderRadius:16,padding:24}}>
          <p style={{fontSize:26,fontWeight:700,marginBottom:4}}>$0</p>
          <p style={{fontSize:13,color:'#94a3b8',marginBottom:20}}>para siempre</p>
          <ul style={{listStyle:'none',padding:0,margin:'0 0 20px'}}>
            {['1 auditoría/día','5 puntos base','Stack automático'].map(f=><li key={f} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,marginBottom:8}}><Check size={13} color="#4ade80"/>{f}</li>)}
          </ul>
          <Link href="/" style={{display:'block',textAlign:'center',padding:'10px 0',borderRadius:10,border:'1px solid #1e1e2e',color:'#94a3b8',textDecoration:'none',fontSize:13}}>Usar gratis</Link>
        </div>
        <div style={{background:'#111118',border:'1px solid #6366f1',borderRadius:16,padding:24,position:'relative',boxShadow:'0 0 30px rgba(99,102,241,0.15)'}}>
          <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'#6366f1',color:'white',fontSize:11,padding:'4px 12px',borderRadius:99,display:'flex',alignItems:'center',gap:4,whiteSpace:'nowrap'}}>
            <Star size={10} fill="currentColor"/>Mejor valor
          </div>
          <p style={{fontSize:26,fontWeight:700,marginBottom:4}}>$9<span style={{fontSize:13,fontWeight:400,color:'#94a3b8'}}>/mes</span></p>
          <p style={{fontSize:13,color:'#94a3b8',marginBottom:20}}>o <strong style={{color:'white'}}>$59/año</strong> — ahorra 45%</p>
          <ul style={{listStyle:'none',padding:0,margin:'0 0 20px'}}>
            {['Ilimitado','22 puntos','Prompts Claude Code','Reporte MD'].map(f=><li key={f} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,marginBottom:8}}><Check size={13} color="#6366f1"/>{f}</li>)}
          </ul>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <button onClick={()=>go('annual')} style={{width:'100%',padding:'10px 0',borderRadius:10,border:'none',background:'#6366f1',color:'white',fontSize:13,fontWeight:600,cursor:'pointer'}}>PRO Anual — $59/año</button>
            <button onClick={()=>go('monthly')} style={{width:'100%',padding:'9px 0',borderRadius:10,border:'1px solid #1e1e2e',background:'transparent',color:'#94a3b8',fontSize:13,cursor:'pointer'}}>PRO Mensual — $9/mes</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default function PricingPage() { return <Suspense><Pricing/></Suspense> }
