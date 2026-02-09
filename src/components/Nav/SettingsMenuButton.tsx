'use client'

import { GearIcon, Popup, useTranslation } from '@payloadcms/ui'
import React, { Fragment } from 'react'

type SettingsMenuButtonProps = {
  settingsMenu?: React.ReactNode[]
}

const baseClass = 'settings-menu-button'

export const SettingsMenuButton: React.FC<SettingsMenuButtonProps> = ({ settingsMenu }) => {
  const { t } = useTranslation()

  if (!settingsMenu || settingsMenu.length === 0) {
    return null
  }

  return (
    <Popup
      button={<GearIcon ariaLabel={t('general:menu')} />}
      className={baseClass}
      horizontalAlign="left"
      id="settings-menu"
      size="small"
      verticalAlign="bottom"
    >
      {settingsMenu.map((item, index) => (
        <Fragment key={`settings-menu-item-${index}`}>{item}</Fragment>
      ))}
    </Popup>
  )
}
