import React from 'react'

export const textWithBreaks = (value?: string | null): React.ReactNode => {
  if (!value) return null

  const lines = value.split(/<br\s*\/?>/gi)

  return lines.map((line, index) => (
    <React.Fragment key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </React.Fragment>
  ))
}

