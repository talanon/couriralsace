'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { normalizeTenantId } from '@/access/clientTenants'
import type { User } from '@/payload-types'
import { useDocumentInfo, useTranslation } from '@payloadcms/ui'
import { PlusIcon } from '@payloadcms/ui'
import { TrashIcon } from '@payloadcms/ui/icons/Trash'
import { requests } from '@payloadcms/ui/shared'

const baseClass = 'tenant-members-panel'
const roles = [
  { value: 'admin', label: 'Administrateur' },
  { value: 'organizer', label: 'Organisateur' },
  { value: 'viewer', label: 'Visiteur' },
]

type TenantMembership = {
  tenant?: string | number | null | Record<string, unknown>
  role?: string | null
}

type MemberRow = User & {
  tenantMemberships?: TenantMembership[]
}

const getTenantIdString = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return null
  return String(value)
}

const getMembershipForTenant = (user: MemberRow, tenantId: string) =>
  user.tenantMemberships?.find((membership) => normalizeTenantId(membership?.tenant) === tenantId)

const TenantMembersPanel: React.FC = () => {
  const { id: tenantId } = useDocumentInfo()
  const { t } = useTranslation()
  const [members, setMembers] = useState<MemberRow[]>([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState(roles[0].value)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)

  const tenantIdString = tenantId ? getTenantIdString(tenantId) : ''
  const fetchMembers = useCallback(async () => {
    if (!tenantIdString) return

    setLoading(true)
    setError(null)
    try {
      const response = await requests.get(`/api/tenants/${tenantIdString}/members`, {
        params: {
          depth: 0,
          limit: 200,
          sort: 'name',
        },
      })

      if (!response.ok) {
        throw new Error('Unable to fetch tenant members')
      }

      const data = await response.json()
      setMembers(data.docs ?? [])
    } catch (caught) {
      console.error(caught)
      setError(t('general:unableToLoad', { label: 'membres' }))
    } finally {
      setLoading(false)
    }
  }, [tenantIdString, t])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  useEffect(() => {
    if (!tenantIdString) return
    const wrap = document.querySelector('.document-fields__sidebar-wrap')
    if (wrap && wrap.parentElement) {
      const parent = wrap.parentElement
      while (wrap.firstChild) {
        parent.insertBefore(wrap.firstChild, wrap)
      }
      wrap.remove()
    }
    const sidebar = document.querySelector('.document-fields__sidebar')
    if (sidebar) {
      sidebar.classList.remove('document-fields__sidebar')
    }
  }, [tenantIdString])

  const handleInvite = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault()

      if (!tenantIdString) return

      setInviteError(null)
      setInviteSuccess(null)
      setInviteLoading(true)
      try {
        const response = await requests.post(`/api/tenants/${tenantIdString}/invite`, {
          body: JSON.stringify({
            email: inviteEmail,
            role: inviteRole,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const json = await response.json().catch(() => null)
          throw new Error(json?.error ?? json?.message ?? 'Impossible d’inviter')
        }

        setInviteSuccess(`Invitation envoyée à ${inviteEmail}`)
        setInviteEmail('')
        setInviteRole(roles[0].value)
        await fetchMembers()
      } catch (caught) {
        setInviteError((caught as Error).message ?? 'Impossible d’inviter')
      } finally {
        setInviteLoading(false)
      }
    },
    [inviteEmail, inviteRole, tenantIdString, fetchMembers],
  )

  const updateMember = useCallback(
    async (member: MemberRow, updater: (membership: TenantMembership) => TenantMembership | null) => {
      if (!tenantIdString) return

      const nextMemberships = (member.tenantMemberships ?? [])
        .map((membership) => {
          if (normalizeTenantId(membership?.tenant) !== tenantIdString) {
            return membership
          }
          return updater(membership)
        })
        .filter(Boolean) as TenantMembership[]

      setUpdatingId(member.id)
      setFeedback(null)
      setError(null)

      try {
        const response = await requests.patch(`/api/tenants/${tenantIdString}/members/${member.id}`, {
          body: JSON.stringify({
            tenantMemberships: nextMemberships,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Unable to update member')
        }

        setFeedback('Membre mis à jour')
        await fetchMembers()
      } catch (caught) {
        console.error(caught)
        setError('Impossible de mettre à jour le membre')
      } finally {
        setUpdatingId(null)
      }
    },
    [fetchMembers, tenantIdString],
  )

  const handleRoleChange = (member: MemberRow, role: string) => {
    updateMember(member, (membership) => ({ ...membership, role }))
  }

  const handleRemove = (member: MemberRow) => {
    updateMember(member, () => null)
  }

  const memberRows = useMemo(() => {
    if (!tenantIdString) return []
    return members.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: getMembershipForTenant(member, tenantIdString)?.role,
      member,
    }))
  }, [members, tenantIdString])

  if (!tenantIdString) {
    return (
      <section className={baseClass}>
        <p>Affiche les utilisateurs affiliés après avoir enregistré l’organisateur.</p>
      </section>
    )
  }

  const infoStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.35rem',
    alignItems: 'baseline',
  }

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }

  const selectStyle: React.CSSProperties = {
    borderRadius: '0.35rem',
    border: '1px solid #d6d3d1',
    padding: '0.35rem 0.75rem',
    background: '#fff',
    fontSize: '0.95rem',
    boxShadow: '0 0 0 1px rgba(15,23,42,0.05)',
  }

  const buttonStyle: React.CSSProperties = {
    borderRadius: '0.35rem',
    border: '1px solid #d6d3d1',
    padding: '0.35rem',
    background: '#fff',
    cursor: 'pointer',
    lineHeight: 0,
  }

  const inviteFormStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.75rem',
    alignItems: 'center',
  }

  const formInputStyle: React.CSSProperties = {
    borderRadius: '0.35rem',
    border: '1px solid #d6d3d1',
    padding: '0.45rem 0.75rem',
    background: '#fff',
    fontSize: '0.95rem',
  }


  const itemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.9rem 1rem',
    borderRadius: '0.65rem',
    border: '1px solid #e5e7eb',
    background: 'rgba(248,250,252,0.9)',
    gap: '1rem',
  }

  return (
    <section className={baseClass}>
      <header className={`${baseClass}__header`}>
        <div>
          <h3>Affiliations à l’organisation</h3>
          <p>Supprimez, modifiez les droits ou invitez de nouveaux membres depuis cette fiche.</p>
        </div>
      </header>
      <div className={`${baseClass}__invite-form`} style={inviteFormStyle}>
        <input
          type="email"
          value={inviteEmail}
          placeholder="Adresse email"
          required
          onChange={(event) => setInviteEmail(event.target.value)}
          style={formInputStyle}
          disabled={inviteLoading}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              void handleInvite()
            }
          }}
        />
        <select
          value={inviteRole}
          onChange={(event) => setInviteRole(event.target.value)}
          style={formInputStyle}
          disabled={inviteLoading}
        >
          {roles.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="button button--primary"
          disabled={!inviteEmail || inviteLoading}
          onClick={() => void handleInvite()}
        >
          {inviteLoading ? 'Envoi...' : 'Inviter'}
        </button>
      </div>
      {inviteError && <p className={`${baseClass}__error`}>{inviteError}</p>}
      {inviteSuccess && <p className={`${baseClass}__feedback`}>{inviteSuccess}</p>}

      {loading && <p>Chargement...</p>}
      {error && <p className={`${baseClass}__error`}>{error}</p>}
      {feedback && <p className={`${baseClass}__feedback`}>{feedback}</p>}

      {memberRows.length === 0 && !loading ? (
        <p>Aucun membre associé à ce tenant.</p>
      ) : (
        <ul
          className={`${baseClass}__list`}
          style={{ paddingLeft: 0, marginTop: '1rem', listStyle: 'none' }}
        >
          {memberRows.map(({ id, name, email, role, member }) => (
            <li key={id} className={`${baseClass}__item`} style={itemStyle}>
                  <div className={`${baseClass}__info`} style={infoStyle}>
                    <strong>{name || email || 'Utilisateur'}</strong>
                    {email && (
                      <span style={{ color: '#475467', fontSize: '0.85rem' }}>{`· ${email}`}</span>
                    )}
                  </div>
                  <div className={`${baseClass}__actions`} style={actionsStyle}>
                    <select
                      value={role ?? ''}
                      onChange={(event) => handleRoleChange(member, event.target.value)}
                      disabled={updatingId === member.id}
                      aria-label="Rôle"
                      style={selectStyle}
                    >
                  <option value="">Rôle</option>
                  {roles.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                  <button
                    type="button"
                    className={`${baseClass}__remove`}
                    onClick={() => handleRemove(member)}
                    disabled={updatingId === member.id}
                    aria-label="Retirer du tenant"
                    style={buttonStyle}
                  >
                    <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default TenantMembersPanel
