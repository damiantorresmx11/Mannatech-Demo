"use client"

import { createContext, useContext } from "react"

interface CMSGlobals {
  header?: {
    announcementBar?: { text: string; color: string; active: boolean }
    navItems?: { label: string; link: string; children?: { label: string; link: string }[] }[]
  }
  footer?: {
    disclaimer?: string
    links?: { label: string; url: string }[]
    copyright?: string
  }
  navigation?: {
    mainMenu?: { label: string; link: string; children?: { label: string; link: string }[] }[]
    footerMenu?: { label: string; link: string }[]
  }
}

const CMSContext = createContext<CMSGlobals>({})

export function CMSProvider({ globals, children }: { globals: CMSGlobals; children: React.ReactNode }) {
  return <CMSContext.Provider value={globals}>{children}</CMSContext.Provider>
}

export function useCMSGlobals() {
  return useContext(CMSContext)
}
