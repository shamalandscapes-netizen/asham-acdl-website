import { ImageResponse } from '@vercel/og';
 
export const runtime = 'edge';
 
export async function GET() {
  // We can load the Montserrat font data here if needed for absolute precision,
  // but for simplicity, we'll rely on system sans-serif which looks close enough in this context.

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#06392F', // Brand Deep Green
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px', // Architectural Grid Pattern
          position: 'relative',
        }}
      >
        {/* Decorative "Blueprint" Lines */}
        <div style={{ position: 'absolute', top: '50%', right: '-100px', width: '600px', height: '600px', border: '2px solid rgba(199, 91, 57, 0.3)', borderRadius: '100%', transform: 'translateY(-50%)' }}></div>
        <div style={{ position: 'absolute', top: '50%', right: '50px', width: '400px', height: '400px', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '100%', transform: 'translateY(-50%)' }}></div>

        {/* Logo Placeholder Icon */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
           <div style={{ width: '60px', height: '60px', backgroundColor: '#C75B39', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px' }}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
               <path d="M12 2L2 22h20L12 2z"/> {/* Simple 'A' shape / Roof */}
             </svg>
           </div>
           <span style={{ color: 'white', fontSize: '24px', fontWeight: 900, letterSpacing: '0.2em' }}>ASHAM GROUP</span>
        </div>

        {/* Main Title */}
        <div
          style={{
            color: 'white',
            fontSize: '80px',
            fontFamily: 'montserrat',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Asham Design</span>
          <span>Construction.</span>
        </div>

        {/* Subtitle with Accents */}
        <div
          style={{
            color: '#C75B39', // Brand Orange
            fontSize: '28px',
            fontFamily: 'sans-serif',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <span>NCA 6 Registered</span>
          <span style={{ width: '4px', height: '4px', backgroundColor: 'white', borderRadius: '50%' }}></span>
          <span>NEMA Compliant</span>
           <span style={{ width: '4px', height: '4px', backgroundColor: 'white', borderRadius: '50%' }}></span>
          <span>East Africa</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
