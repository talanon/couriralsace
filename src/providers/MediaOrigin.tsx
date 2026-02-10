'use client'

import React, { createContext, useContext } from 'react'

const MediaOriginContext = createContext<string>('http://localhost:3000')

export const MediaOriginProvider: React.FC<{ origin: string; children: React.ReactNode }> = ({
  origin,
  children,
}) => {
  return <MediaOriginContext.Provider value={origin}>{children}</MediaOriginContext.Provider>
}

export const useMediaOrigin = () => useContext(MediaOriginContext)
