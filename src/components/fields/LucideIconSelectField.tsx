'use client'

import type { SelectFieldClientComponent } from 'payload'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'

import {
  navLucideIcons,
  navLucideIconOptions,
  navLucideSearchAliases,
  type NavLucideIconName,
} from '@/Header/lucideIcons'

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const LucideIconSelectField: SelectFieldClientComponent = ({
  field,
  path: pathFromProps,
  readOnly,
}) => {
  const {
    admin: { className, description } = {},
    label,
    localized,
    required,
  } = field

  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const {
    path,
    setValue,
    showError,
    value,
  } = useField<string>({
    potentiallyStalePath: pathFromProps,
  })

  const currentValue = typeof value === 'string' ? value : ''

  const selectedOption = useMemo(
    () => navLucideIconOptions.find((option) => option.value === currentValue),
    [currentValue],
  )
  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeText(query)
    if (!normalizedQuery) return navLucideIconOptions

    return navLucideIconOptions.filter((option) => {
      const label = normalizeText(option.label)
      const value = normalizeText(option.value)
      const aliases =
        navLucideSearchAliases[option.value as NavLucideIconName]
          ?.map((alias) => normalizeText(alias))
          .join(' ') ?? ''
      return (
        label.includes(normalizedQuery) ||
        value.includes(normalizedQuery) ||
        aliases.includes(normalizedQuery)
      )
    })
  }, [query])

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('mousedown', onClickOutside)

    return () => {
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [])

  const SelectedIcon = selectedOption
    ? navLucideIcons[selectedOption.value as NavLucideIconName]
    : null

  return (
    <div className={className} ref={wrapperRef}>
      <FieldLabel label={label} localized={localized} path={path} required={required} />

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={readOnly}
          onClick={() => {
            if (!readOnly) {
              setIsOpen((open) => {
                const nextOpen = !open
                if (!nextOpen) setQuery('')
                return nextOpen
              })
            }
          }}
          style={{
            alignItems: 'center',
            background: 'var(--theme-elevation-0)',
            border: '1px solid var(--theme-input-border)',
            borderRadius: '8px',
            color: 'var(--theme-text)',
            cursor: readOnly ? 'not-allowed' : 'pointer',
            display: 'flex',
            fontSize: '14px',
            gap: '10px',
            justifyContent: 'space-between',
            minHeight: '42px',
            padding: '9px 12px',
            width: '100%',
          }}
        >
          <span style={{ alignItems: 'center', display: 'inline-flex', gap: '8px' }}>
            {SelectedIcon && <SelectedIcon aria-hidden size={16} />}
            <span>{selectedOption?.label || 'Aucune icone'}</span>
          </span>
          <ChevronDown aria-hidden size={16} />
        </button>

        {isOpen && (
          <div
            role="listbox"
            aria-label={typeof label === 'string' ? label : 'Icone'}
            style={{
              background: 'var(--theme-elevation-0)',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              left: 0,
              marginTop: '6px',
              maxHeight: '260px',
              overflowY: 'auto',
              position: 'absolute',
              right: 0,
              zIndex: 30,
            }}
          >
            <div style={{ padding: '10px 12px', position: 'sticky', top: 0, zIndex: 2 }}>
              <input
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                }}
                placeholder="Rechercher une icone..."
                style={{
                  background: 'var(--theme-elevation-0)',
                  border: '1px solid var(--theme-input-border)',
                  borderRadius: '8px',
                  color: 'var(--theme-text)',
                  fontSize: '14px',
                  minHeight: '36px',
                  outline: 'none',
                  padding: '6px 10px',
                  width: '100%',
                }}
              />
            </div>
            <button
              type="button"
              role="option"
              aria-selected={!currentValue}
              onClick={() => {
                setValue(null)
                setIsOpen(false)
                setQuery('')
              }}
              style={{
                alignItems: 'center',
                background: !currentValue ? 'var(--theme-elevation-100)' : 'transparent',
                border: 'none',
                color: 'var(--theme-text)',
                cursor: 'pointer',
                display: 'flex',
                gap: '10px',
                padding: '10px 12px',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <span aria-hidden style={{ display: 'inline-flex', width: '16px' }}>
                -
              </span>
              <span>Aucune icone</span>
            </button>
            {filteredOptions.map((option) => {
              const OptionIcon = navLucideIcons[option.value as NavLucideIconName]
              const isActive = currentValue === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setValue(option.value)
                    setIsOpen(false)
                    setQuery('')
                  }}
                  style={{
                    alignItems: 'center',
                    background: isActive ? 'var(--theme-elevation-100)' : 'transparent',
                    border: 'none',
                    color: 'var(--theme-text)',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '10px',
                    padding: '10px 12px',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <OptionIcon aria-hidden size={16} />
                  <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px' }}>
                    <span>{option.label}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', opacity: 0.7 }}>
                      {option.value}
                    </span>
                  </span>
                </button>
              )
            })}
            {filteredOptions.length === 0 && (
              <div
                style={{
                  color: 'var(--theme-text)',
                  fontSize: '13px',
                  opacity: 0.7,
                  padding: '10px 12px',
                }}
              >
                Aucune icone ne correspond a la recherche.
              </div>
            )}
          </div>
        )}
      </div>

      <FieldDescription description={description} path={path} />
      <FieldError path={path} showError={showError} />
    </div>
  )
}

export default LucideIconSelectField
