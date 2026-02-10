import type { PayloadRequest, ServerProps } from 'payload'

import { Logout } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { EntityType, groupNavItems } from '@payloadcms/ui/shared'
import type { EntityToGroup } from '@payloadcms/ui/shared'
import React from 'react'

import { DefaultNavClient, NavHamburger, NavWrapper } from '@payloadcms/next/client'

import { getNavPrefs } from '@/utilities/getNavPrefs'

import { isSuperAdmin } from '@/access/index'

import { SettingsMenuButton } from './SettingsMenuButton'

type AdminNavProps = {
  req?: PayloadRequest
} & ServerProps

const restrictedCollections = new Set([
  'categories',
  'events',
  'users',
  'form-submissions',
  'redirects',
])

const restrictedGlobals = new Set(['header', 'footer'])

const baseClass = 'nav'

export const AdminNav: React.FC<AdminNavProps> = async (props) => {
  const {
    documentSubViewType,
    i18n,
    locale,
    params,
    payload,
    permissions,
    req,
    searchParams,
    user,
    viewType,
    visibleEntities,
  } = props

  if (!payload?.config) {
    return null
  }

  const {
    admin: {
      components: { afterNav, afterNavLinks, beforeNav, beforeNavLinks, logout, settingsMenu },
    },
    collections,
    globals,
  } = payload.config

  const hideRestricted = !isSuperAdmin(user)
  const navCollections = hideRestricted
    ? collections.filter((collection) => !restrictedCollections.has(collection.slug))
    : collections
  const navGlobals = hideRestricted
    ? globals.filter((global) => !restrictedGlobals.has(global.slug))
    : globals

  const visibleCollectionSlugs = visibleEntities?.collections ?? []
  const visibleGlobalSlugs = visibleEntities?.globals ?? []

  const groups = groupNavItems(
    [
      ...navCollections
        .filter(({ slug }) => visibleCollectionSlugs.includes(slug))
        .map(
          (collection) =>
            ({
              type: EntityType.collection,
              entity: collection,
            }) satisfies EntityToGroup,
        ),
      ...navGlobals
        .filter(({ slug }) => visibleGlobalSlugs.includes(slug))
        .map(
          (global) =>
            ({
              type: EntityType.global,
              entity: global,
            }) satisfies EntityToGroup,
        ),
    ],
    permissions ?? ({} as any),
    i18n,
  )

  const navPreferences = await getNavPrefs(req)

  const LogoutComponent = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: logout?.Button,
    Fallback: Logout,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const RenderedSettingsMenu =
    settingsMenu && Array.isArray(settingsMenu)
      ? settingsMenu.map((item, index) =>
          RenderServerComponent({
            clientProps: {
              documentSubViewType,
              viewType,
            },
            Component: item,
            importMap: payload.importMap,
            key: `settings-menu-item-${index}`,
            serverProps: {
              i18n,
              locale,
              params,
              payload,
              permissions,
              searchParams,
              user,
            },
          }),
        )
      : []

  const RenderedBeforeNav = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: beforeNav,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const RenderedBeforeNavLinks = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: beforeNavLinks,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const RenderedAfterNavLinks = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: afterNavLinks,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const RenderedAfterNav = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: afterNav,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  return (
    <NavWrapper baseClass={baseClass}>
      {RenderedBeforeNav}
      <nav className={`${baseClass}__wrap`}>
        {RenderedBeforeNavLinks}
        <DefaultNavClient groups={groups} navPreferences={navPreferences ?? ({} as any)} />
        {RenderedAfterNavLinks}
        <div className={`${baseClass}__controls`}>
          <SettingsMenuButton settingsMenu={RenderedSettingsMenu} />
          {LogoutComponent}
        </div>
      </nav>
      {RenderedAfterNav}
      <div className={`${baseClass}__header`}>
        <div className={`${baseClass}__header-content`}>
          <NavHamburger baseClass={baseClass} />
        </div>
      </div>
    </NavWrapper>
  )
}

export default AdminNav
