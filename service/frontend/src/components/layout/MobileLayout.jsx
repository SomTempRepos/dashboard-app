import TopBar from './TopBar'
import BottomNav from './BottomNav'

export default function MobileLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <TopBar />
      <div
        style={{
          minHeight: '100vh',
          padding: '56px 16px 60px 16px',
          background: '#fff',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
      <BottomNav />
    </div>
  )
}