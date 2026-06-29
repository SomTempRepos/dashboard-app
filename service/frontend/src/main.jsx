  // import React from 'react'
  // import ReactDOM from 'react-dom/client'
  // import { BrowserRouter } from 'react-router-dom'
  // import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  // import { App as AntApp, ConfigProvider } from 'antd'
  // import App from './App'

  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       retry: 1,
  //       staleTime: 30000,
  //     },
  //   },
  // })

  // ReactDOM.createRoot(document.getElementById('root')).render(
  //   <React.StrictMode>
  //     <QueryClientProvider client={queryClient}>
  //       <BrowserRouter>
  //         <ConfigProvider>
  //           <AntApp>
  //             <App />
  //           </AntApp>
  //         </ConfigProvider>
  //       </BrowserRouter>
  //     </QueryClientProvider>
  //   </React.StrictMode>
  // )
  import React, { createContext, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntApp, ConfigProvider, Grid } from 'antd'
import App from './App'

// ─────────────────────────────────────────────
// Responsive Context
// ─────────────────────────────────────────────
const ResponsiveContext = createContext({})

export const useResponsive = () => useContext(ResponsiveContext)

const ResponsiveProvider = ({ children }) => {
  const screens = Grid.useBreakpoint()

  const responsive = {
    // Raw breakpoints
    screens,

    // Breakpoint booleans
    isXs: !!screens.xs && !screens.sm,           // < 576px
    isSm: !!screens.sm && !screens.md,           // 576px - 767px
    isMd: !!screens.md && !screens.lg,           // 768px - 991px
    isLg: !!screens.lg && !screens.xl,           // 992px - 1199px
    isXl: !!screens.xl && !screens.xxl,          // 1200px - 1599px
    isXxl: !!screens.xxl,                        // >= 1600px

    // Grouped helpers
    isMobile: !screens.md,                       // < 768px
    isTablet: !!screens.md && !screens.lg,       // 768px - 991px
    isDesktop: !!screens.lg,                     // >= 992px
    isLargeDesktop: !!screens.xl,               // >= 1200px

    // Sizes based on screen
    componentSize: !screens.md ? 'small' : 'middle',
    gutterSize: !screens.md ? 8 : !screens.lg ? 16 : 24,
    paddingSize: !screens.md ? 12 : !screens.lg ? 16 : 24,
    marginSize: !screens.md ? 8 : !screens.lg ? 16 : 24,
    colSpan: {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 8,
      xl: 6,
      xxl: 4,
    },
  }

  return (
    <ResponsiveContext.Provider value={responsive}>
      {children}
    </ResponsiveContext.Provider>
  )
}

// ─────────────────────────────────────────────
// Query Client
// ─────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
})

// ─────────────────────────────────────────────
// Theme Config
// ─────────────────────────────────────────────
const themeConfig = {
  token: {
    // ── Colors ──────────────────────────────
    colorPrimary: '#6d6f71',
    colorInfo: '#6d6f71',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorTextBase: '#1f1f1f',
    colorBgBase: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    colorTextSecondary: '#8c8c8c',
    colorTextTertiary: '#bfbfbf',
    colorTextDisabled: '#bfbfbf',
    colorLink: '#6d6f71',
    colorLinkHover: '#4a4c4e',
    colorLinkActive: '#4a4c4e',

    // ── Typography ───────────────────────────
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    fontWeightStrong: 600,
    lineHeight: 1.5715,

    // ── Spacing ──────────────────────────────
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,
    margin: 16,
    marginXS: 8,
    marginSM: 12,
    marginLG: 24,
    marginXL: 32,

    // ── Border ───────────────────────────────
    borderRadius: 4,
    borderRadiusSM: 2,
    borderRadiusLG: 6,
    borderRadiusXS: 2,

    // ── Shadow ───────────────────────────────
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)',
    boxShadowSecondary: '0 3px 6px rgba(0,0,0,0.08), 0 3px 6px rgba(0,0,0,0.10)',

    // ── Size ─────────────────────────────────
    controlHeight: 36,
    controlHeightSM: 28,
    controlHeightLG: 44,

    // ── Motion ───────────────────────────────
    motion: true,
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',

    // ── Misc ─────────────────────────────────
    wireframe: true,
    zIndexPopupBase: 1000,
    opacityImage: 1,

    // ── Responsive Breakpoints ────────────────
    screenXS: 480,
    screenXSMin: 480,
    screenXSMax: 575,
    screenSM: 576,
    screenSMMin: 576,
    screenSMMax: 767,
    screenMD: 768,
    screenMDMin: 768,
    screenMDMax: 991,
    screenLG: 992,
    screenLGMin: 992,
    screenLGMax: 1199,
    screenXL: 1200,
    screenXLMin: 1200,
    screenXLMax: 1599,
    screenXXL: 1600,
    screenXXLMin: 1600,
  },

  components: {
    // ── Layout ───────────────────────────────
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
      headerPadding: '0 24px',
      siderBg: '#ffffff',
      bodyBg: '#f5f5f5',
      footerBg: '#ffffff',
      footerPadding: '16px 24px',
    },

    // ── Menu ─────────────────────────────────
    Menu: {
      itemBg: 'transparent',
      itemColor: '#1f1f1f',
      itemHoverColor: '#6d6f71',
      itemSelectedColor: '#6d6f71',
      itemSelectedBg: '#f5f5f5',
      itemActiveBg: '#f0f0f0',
      itemBorderRadius: 4,
      subMenuItemBg: 'transparent',
      darkItemBg: '#1f1f1f',
      darkItemColor: '#ffffff',
      darkItemSelectedBg: '#6d6f71',
      collapsedWidth: 48,
      collapsedIconSize: 18,
    },

    // ── Button ───────────────────────────────
    Button: {
      borderRadius: 4,
      controlHeight: 36,
      controlHeightSM: 28,
      controlHeightLG: 44,
      paddingInline: 16,
      fontWeight: 500,
      primaryShadow: 'none',
      defaultShadow: 'none',
      onlyIconSize: 16,
      onlyIconSizeSM: 12,
      onlyIconSizeLG: 18,
    },

    // ── Input ────────────────────────────────
    Input: {
      borderRadius: 4,
      controlHeight: 36,
      controlHeightSM: 28,
      controlHeightLG: 44,
      paddingInline: 12,
      addonBg: '#f5f5f5',
    },

    // ── Select ───────────────────────────────
    Select: {
      borderRadius: 4,
      controlHeight: 36,
      controlHeightSM: 28,
      controlHeightLG: 44,
      optionSelectedBg: '#f5f5f5',
      optionSelectedColor: '#6d6f71',
      optionActiveBg: '#fafafa',
    },

    // ── Table ────────────────────────────────
    Table: {
      headerBg: '#fafafa',
      headerColor: '#1f1f1f',
      headerSortActiveBg: '#f0f0f0',
      headerSortHoverBg: '#f5f5f5',
      rowHoverBg: '#fafafa',
      rowSelectedBg: '#f5f5f5',
      rowSelectedHoverBg: '#f0f0f0',
      borderColor: '#f0f0f0',
      footerBg: '#fafafa',
      cellPaddingBlock: 12,
      cellPaddingInline: 16,
      cellPaddingBlockSM: 8,
      cellPaddingInlineSM: 8,
      scrollbarSize: 8,
      scrollbarThumbBg: '#d9d9d9',
      scrollbarBg: 'transparent',
    },

    // ── Card ─────────────────────────────────
    Card: {
      borderRadius: 4,
      headerBg: 'transparent',
      headerFontSize: 16,
      headerFontSizeSM: 14,
      headerHeight: 48,
      headerHeightSM: 36,
      actionsBg: '#fafafa',
      actionsLiMargin: '12px 0',
      extraColor: '#6d6f71',
      paddingLG: 24,
    },

    // ── Modal ────────────────────────────────
    Modal: {
      borderRadius: 4,
      headerBg: '#ffffff',
      titleColor: '#1f1f1f',
      titleFontSize: 16,
      contentBg: '#ffffff',
      footerBg: 'transparent',
      padding: 24,
    },

    // ── Form ─────────────────────────────────
    Form: {
      labelColor: '#1f1f1f',
      labelFontSize: 14,
      labelHeight: 36,
      labelRequiredMarkColor: '#ff4d4f',
      itemMarginBottom: 20,
      verticalLabelPadding: '0 0 8px',
    },

    // ── Notification ─────────────────────────
    Notification: {
      borderRadius: 4,
      padding: 16,
      paddingMD: 20,
      width: 384,
    },

    // ── Message ──────────────────────────────
    Message: {
      borderRadius: 4,
      contentPadding: '10px 16px',
    },

    // ── Tabs ─────────────────────────────────
    Tabs: {
      borderRadius: 4,
      cardBg: '#fafafa',
      cardHeight: 40,
      cardPadding: '6px 16px',
      horizontalMargin: '0 0 16px 0',
      inkBarColor: '#6d6f71',
      itemActiveColor: '#6d6f71',
      itemHoverColor: '#6d6f71',
      itemSelectedColor: '#6d6f71',
    },

    // ── Badge ────────────────────────────────
    Badge: {
      colorBorderBg: '#ffffff',
    },

    // ── Breadcrumb ───────────────────────────
    Breadcrumb: {
      itemColor: '#8c8c8c',
      lastItemColor: '#1f1f1f',
      linkColor: '#6d6f71',
      linkHoverColor: '#4a4c4e',
      separatorColor: '#bfbfbf',
      separatorMargin: 8,
      fontSize: 14,
    },

    // ── Pagination ───────────────────────────
    Pagination: {
      borderRadius: 4,
      itemActiveBg: '#6d6f71',
      itemSize: 32,
      itemSizeSM: 24,
    },

    // ── Tooltip ──────────────────────────────
    Tooltip: {
      borderRadius: 4,
      colorBgSpotlight: 'rgba(0,0,0,0.75)',
      colorTextLightSolid: '#ffffff',
    },

    // ── Dropdown ─────────────────────────────
    Dropdown: {
      borderRadius: 4,
      paddingBlock: 5,
    },

    // ── Drawer ───────────────────────────────
    Drawer: {
      paddingLG: 24,
      footerPaddingBlock: 12,
      footerPaddingInline: 24,
    },

    // ── DatePicker ───────────────────────────
    DatePicker: {
      borderRadius: 4,
      controlHeight: 36,
      cellWidth: 36,
      cellHeight: 24,
    },

    // ── Checkbox ─────────────────────────────
    Checkbox: {
      borderRadius: 2,
    },

    // ── Radio ────────────────────────────────
    Radio: {
      borderRadius: 4,
    },

    // ── Switch ───────────────────────────────
    Switch: {
      borderRadius: 100,
      trackHeight: 22,
      trackMinWidth: 44,
    },

    // ── Slider ───────────────────────────────
    Slider: {
      borderRadius: 4,
      handleSize: 14,
      handleSizeHover: 16,
      railSize: 4,
      dotSize: 8,
    },

    // ── Tag ──────────────────────────────────
    Tag: {
      borderRadius: 4,
      defaultBg: '#fafafa',
      defaultColor: '#1f1f1f',
    },

    // ── Avatar ───────────────────────────────
    Avatar: {
      borderRadius: 4,
      groupSpace: 4,
      groupBorderColor: '#ffffff',
      containerSize: 40,
      containerSizeSM: 28,
      containerSizeLG: 56,
    },

    // ── Steps ────────────────────────────────
    Steps: {
      iconSize: 32,
      iconSizeSM: 24,
      titleLineHeight: 32,
      customIconSize: 32,
      customIconTop: 0,
    },

    // ── Alert ────────────────────────────────
    Alert: {
      borderRadius: 4,
      paddingContentVerticalSM: 8,
      withDescriptionIconSize: 24,
      withDescriptionPadding: 16,
    },

    // ── Progress ─────────────────────────────
    Progress: {
      defaultColor: '#6d6f71',
      remainingColor: '#f5f5f5',
      circleIconFontSize: 14,
      lineBorderRadius: 100,
    },

    // ── Spin ─────────────────────────────────
    Spin: {
      colorPrimary: '#6d6f71',
      dotSize: 20,
      dotSizeSM: 14,
      dotSizeLG: 32,
    },

    // ── Statistic ────────────────────────────
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 24,
    },

    // ── Result ───────────────────────────────
    Result: {
      iconFontSize: 72,
      titleFontSize: 24,
      subtitleFontSize: 14,
      extraMargin: '24px 0 0',
    },
  },
}

// ─────────────────────────────────────────────
// Root Render
// ─────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ConfigProvider theme={themeConfig}>
          <AntApp>
            <ResponsiveProvider>
              <App />
            </ResponsiveProvider>
          </AntApp>
        </ConfigProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)