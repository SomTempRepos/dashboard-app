import { Grid } from 'antd'
import DesktopLayout from './DesktopLayout'
import MobileLayout from './MobileLayout'

const { useBreakpoint } = Grid

export default function AppLayout({ children }) {
  const screens = useBreakpoint()
  const isDesktop = screens.md

  if (isDesktop) {
    return <DesktopLayout>{children}</DesktopLayout>
  }

  return <MobileLayout>{children}</MobileLayout>
}