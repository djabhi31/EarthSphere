import { ImageResponse } from 'next/og';
 
// Route segment config
export const runtime = 'edge';
 
// Image metadata
export const alt = 'EarthSphere - Real-time Earth Event Intelligence';
export const size = {
  width: 1200,
  height: 630,
};
 
export const contentType = 'image/png';
 
// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #050A1F, #000000)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '60%',
            height: '80%',
            background: 'radial-gradient(circle, rgba(0,210,255,0.15) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
          }}
        />
        
        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '60px 100px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            zIndex: 10,
          }}
        >
          {/* Logo / Brand Name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #FFFFFF, #B0B9D6)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ marginRight: 20, fontSize: 80 }}>🌍</span>
            EarthSphere
          </div>
          
          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: '#8A99C7',
              letterSpacing: '0.01em',
              marginTop: 10,
            }}
          >
            Real-time Earth Event Intelligence
          </div>
          
          {/* URL Tag */}
          <div
            style={{
              marginTop: 40,
              fontSize: 24,
              color: '#00D2FF',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 210, 255, 0.1)',
              padding: '10px 24px',
              borderRadius: '999px',
            }}
          >
            earthsphere.in
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
