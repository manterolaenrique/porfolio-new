import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Enrique Manterola - Full Stack Developer'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #6C5CE7 0%, #00B894 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>Enrique Manterola</div>
          <div style={{ fontSize: 48, marginTop: 20 }}>Full Stack Developer</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
