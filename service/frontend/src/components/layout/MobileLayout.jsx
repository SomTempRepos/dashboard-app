import TopBar from './TopBar'
import BottomNav from './BottomNav'

export default function MobileLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <TopBar />
      <div
        style={{
          paddingTop: 56,
          paddingBottom: 60,
          minHeight: '100vh',
          padding: '72px 16px 76px 16px',
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