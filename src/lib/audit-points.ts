export interface AuditPoint {
  id: string
  num: number
  category: 'base' | 'security' | 'quality' | 'production'
  categoryLabel: string
  title: string
  what: string
  plan: 'free' | 'pro'
  claudeCodePrompt: string
}

export const AUDIT_POINTS: AuditPoint[] = [
  { id:'frontend-build', num:1, category:'base', categoryLabel:'La base', plan:'free',
    title:'Front-end sin filtraciones',
    what:'Código comprimido, sin source maps ni claves privadas expuestas al navegador.',
    claudeCodePrompt:`Actúa como auditor de seguridad de front-end.
1. El build genera source maps subidos al servidor? Desactívalos.
2. Busca claves o tokens en el código del cliente. Lista archivo y línea.
3. Mueve cada secreto al servidor o variables de entorno.
4. Verifica que el build salga minificado y sin comentarios.
Primero el reporte. No cambies nada hasta que diga aplícalo.`},
  { id:'database-rls', num:2, category:'base', categoryLabel:'La base', plan:'free',
    title:'Base de datos con candado (RLS)',
    what:'Cada usuario solo puede ver y tocar sus propios datos.',
    claudeCodePrompt:`Actúa como experto en seguridad de base de datos.
1. Revisa tabla por tabla si tiene RLS activado.
2. Señala tablas con datos sensibles abiertas a cualquier usuario.
3. Propón políticas RLS con el SQL exacto.
4. Dame un caso de prueba para confirmar que usuario A no ve datos de usuario B.
Diagnóstico y SQL propuesto primero.`},
  { id:'git-versioning', num:3, category:'base', categoryLabel:'La base', plan:'free',
    title:'Control de versiones limpio',
    what:'Git configurado correctamente y sin secretos en el historial.',
    claudeCodePrompt:`Actúa como guía de control de versiones.
1. Existe .gitignore correcto? Excluye node_modules, .env y builds?
2. Hay secretos en el historial de commits?
3. Si los hay, cómo limpiarlos sin romper el repo.
4. Propón flujo seguro: rama estable, ramas por feature.
Diagnóstico primero.`},
  { id:'apis-secure', num:4, category:'base', categoryLabel:'La base', plan:'free',
    title:'APIs autenticadas y validadas',
    what:'Cada endpoint verifica quién llama y valida los datos que recibe.',
    claudeCodePrompt:`Actúa como arquitecto de APIs.
1. Lista endpoints propios. Marca los sin autenticación.
2. Verifica auth, permisos y validación de entrada en cada ruta sensible.
3. Señala dónde falta validación antes de tocar la BD.
Inventario y hallazgos primero.`},
  { id:'env-vars', num:5, category:'base', categoryLabel:'La base', plan:'free',
    title:'Variables de entorno correctas',
    what:'Variables privadas en servidor, nada sensible llega al navegador.',
    claudeCodePrompt:`Actúa como experto en configuración segura.
1. Lista todas las variables del .env. Clasifica: pública/privada/sensible.
2. Busca variables sensibles con prefijo NEXT_PUBLIC_ u equivalente.
3. Verifica que .env real no está commiteado.
Reporte primero.`},
  { id:'auth-sessions', num:6, category:'security', categoryLabel:'Seguridad', plan:'pro',
    title:'Autenticación y sesiones',
    what:'Login sólido: tokens con expiración, cierre de sesión real.',
    claudeCodePrompt:`Actúa como auditor de autenticación.
1. Cómo se generan, almacenan y expiran los tokens?
2. El cierre de sesión invalida el token en el servidor?
3. Hay protección contra fuerza bruta?
Reporte con severidad.`},
  { id:'rate-limiting', num:7, category:'security', categoryLabel:'Seguridad', plan:'pro',
    title:'Rate limiting en endpoints caros',
    what:'Endpoints de IA, email y pagos con límite de peticiones.',
    claudeCodePrompt:`Actúa como experto en rate limiting.
1. Identifica endpoints que llaman a IA, email o pagos.
2. Hay algún límite hoy? Si no, calcula el riesgo económico.
3. Propón límites por ruta con Upstash/Redis.
Plan con límites sugeridos.`},
  { id:'input-sanitization', num:8, category:'security', categoryLabel:'Seguridad', plan:'pro',
    title:'Sanitización de inputs',
    what:'Todo lo que viene del usuario se valida antes de usarlo.',
    claudeCodePrompt:`Actúa como experto en seguridad de inputs.
1. Busca inputs usados directamente en consultas a BD sin parametrizar.
2. Identifica contenido renderizado como HTML sin escapar (XSS).
3. Verifica validación de tipo y longitud en servidor.
Lista de vulnerabilidades por severidad.`},
  { id:'dependencies', num:9, category:'security', categoryLabel:'Seguridad', plan:'pro',
    title:'Dependencias sin vulnerabilidades',
    what:'Paquetes sin CVEs conocidos y razonablemente actualizados.',
    claudeCodePrompt:`Actúa como auditor de dependencias.
1. Ejecuta npm audit y lista vulnerabilidades por severidad.
2. Identifica paquetes abandonados.
3. Para cada crítica, propón el fix.
Reporte ordenado por severidad.`},
  { id:'error-handling', num:10, category:'quality', categoryLabel:'Calidad', plan:'pro',
    title:'Gestión de errores completa',
    what:'Errores con try/catch, log y mensaje claro para el usuario.',
    claudeCodePrompt:`Actúa como experto en resiliencia de apps.
1. Busca llamadas a APIs y BD sin try/catch.
2. Identifica errores silenciosos (catch vacío).
3. El usuario ve mensajes claros o pantallas en blanco?
Inventario de puntos sin cobertura.`},
  { id:'code-quality', num:11, category:'quality', categoryLabel:'Calidad', plan:'pro',
    title:'Calidad y limpieza de código',
    what:'Sin imports muertos, funciones duplicadas ni código espagueti.',
    claudeCodePrompt:`Actúa como revisor de calidad de código.
1. Identifica imports sin usar y variables no usadas.
2. Busca lógica duplicada que debería centralizarse.
3. Señala archivos con más de 300 líneas.
Lista de hallazgos por impacto.`},
  { id:'ux-states', num:12, category:'quality', categoryLabel:'Calidad', plan:'pro',
    title:'UX: estados de carga y error',
    what:'El usuario siempre sabe qué pasa: loaders, mensajes claros, formularios que validan.',
    claudeCodePrompt:`Actúa como auditor de UX.
1. Busca botones sin estado de carga.
2. Formularios sin validación en cliente?
3. Estados vacíos tienen mensaje útil?
Lista de pantallas afectadas.`},
  { id:'accessibility', num:13, category:'quality', categoryLabel:'Calidad', plan:'pro',
    title:'Accesibilidad básica',
    what:'Imágenes con alt text, contraste mínimo, navegación por teclado.',
    claudeCodePrompt:`Actúa como auditor de accesibilidad WCAG 2.1 AA.
1. Imágenes sin atributo alt?
2. Textos con contraste insuficiente (mínimo 4.5:1)?
3. Elementos interactivos usables con teclado?
Reporte con severidad.`},
  { id:'documentation', num:14, category:'quality', categoryLabel:'Calidad', plan:'pro',
    title:'Documentación interna mínima',
    what:'README explica cómo levantar el proyecto y qué hace cada variable.',
    claudeCodePrompt:`Actúa como technical writer.
1. El README explica cómo instalar y arrancar el proyecto?
2. Cada variable en .env.example tiene comentario?
3. Genera README mejorado y .env.example comentado.
Muéstrame el borrador antes de sobreescribir.`},
  { id:'hosting-deploy', num:15, category:'production', categoryLabel:'Producción', plan:'pro',
    title:'Hosting y deploy estable',
    what:'Dominio con HTTPS, entornos separados y deploy automático.',
    claudeCodePrompt:`Actúa como ingeniero de despliegue.
1. Hay entornos separados con sus propias variables?
2. HTTPS forzado sin mixed content?
3. Deploy automático desde Git?
Plan de mejoras.`},
  { id:'performance', num:16, category:'production', categoryLabel:'Producción', plan:'pro',
    title:'Rendimiento y caché',
    what:'Operaciones lentas con caché, imágenes optimizadas.',
    claudeCodePrompt:`Actúa como especialista en rendimiento web.
1. Consultas a BD o APIs que se repiten sin caché?
2. Imágenes optimizadas con WebP y lazy loading?
3. Propón caché con TTL para cada caso.
Diagnóstico con impacto estimado.`},
  { id:'scalability', num:17, category:'production', categoryLabel:'Producción', plan:'pro',
    title:'Escalabilidad bajo carga',
    what:'App aguanta picos de usuarios sin caerse.',
    claudeCodePrompt:`Actúa como arquitecto de escalabilidad.
1. Consultas en bucles N+1 o sin índices?
2. Procesos síncronos lentos para mover a background?
3. Hay connection pooling en la BD?
Reporte de cuellos de botella.`},
  { id:'monitoring', num:18, category:'production', categoryLabel:'Producción', plan:'pro',
    title:'Monitoreo y alertas',
    what:'Visibilidad de errores y gasto con alertas activas.',
    claudeCodePrompt:`Actúa como ingeniero de monitoreo.
1. Hay captura de errores en producción? Si no, integra Sentry.
2. Define métricas: error rate, tiempos, gasto en APIs.
3. Configura alertas para errores críticos.
Plan primero.`},
  { id:'tests', num:19, category:'production', categoryLabel:'Producción', plan:'pro',
    title:'Tests mínimos en rutas críticas',
    what:'Smoke tests en login, función core y pago tras cada deploy.',
    claudeCodePrompt:`Actúa como ingeniero de QA.
1. Identifica las 3-5 rutas más críticas.
2. Escribe smoke tests para cada una.
3. Configura que corran en CI antes de deployar.
Tests escritos primero para revisión.`},
  { id:'seo', num:20, category:'production', categoryLabel:'Producción', plan:'pro',
    title:'SEO técnico básico',
    what:'Meta tags, og:image, robots.txt y sitemap correctos.',
    claudeCodePrompt:`Actúa como especialista en SEO técnico.
1. Cada página tiene title único, meta description y og:image?
2. Existe robots.txt correcto?
3. Hay sitemap.xml generado?
Lista de lo que falta.`},
  { id:'gdpr', num:21, category:'production', categoryLabel:'Producción', plan:'pro',
    title:'GDPR y privacidad mínima',
    what:'Aviso de cookies, política de privacidad y claridad sobre datos guardados.',
    claudeCodePrompt:`Actúa como consultor de privacidad.
1. Hay aviso de cookies si se usan analytics?
2. Existe política de privacidad en el footer?
3. Claro qué datos se guardan y por cuánto tiempo?
Lista de lo que falta.`},
  { id:'payments', num:22, category:'production', categoryLabel:'Producción', plan:'pro',
    title:'Pagos seguros',
    what:'Stripe en producción, webhooks verificados, fallos manejados.',
    claudeCodePrompt:`Actúa como experto en integración de pagos.
1. Los webhooks verifican la firma de Stripe?
2. La app maneja pagos fallidos y cancelaciones?
3. Las claves son de producción (sk_live_)?
Reporte de la integración actual.`}
]

export const FREE_POINTS = AUDIT_POINTS.filter(p => p.plan === 'free')
