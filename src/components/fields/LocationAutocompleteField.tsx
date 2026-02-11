'use client'

import type { TextFieldClientComponent } from 'payload'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FieldDescription, FieldError, FieldLabel, TextInput, useField } from '@payloadcms/ui'

import { useDebounce } from '@/utilities/useDebounce'

type AddressFeature = {
  properties?: {
    city?: string
    label?: string
    name?: string
    postcode?: string
  }
}

type AddressResponse = {
  features?: AddressFeature[]
}

type Suggestion = {
  id: string
  label: string
  value: string
}

const defaultPlaceholder = 'Commencez a taper une ville ou une adresse...'

const toSuggestion = (feature: AddressFeature, index: number): Suggestion | null => {
  const city = feature.properties?.city || feature.properties?.name
  const postcode = feature.properties?.postcode
  const label = feature.properties?.label

  if (city && postcode) {
    return {
      id: `${city}-${postcode}-${index}`,
      label: `${city} (${postcode})`,
      value: `${city} (${postcode})`,
    }
  }

  if (label) {
    return {
      id: `${label}-${index}`,
      label,
      value: label,
    }
  }

  return null
}

const LocationAutocompleteField: TextFieldClientComponent = ({
  field,
  path: pathFromProps,
  readOnly,
}) => {
  const {
    admin: { className, description, placeholder } = {},
    label,
    localized,
    required,
  } = field

  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    path,
    setValue,
    showError,
    value,
  } = useField<string>({
    potentiallyStalePath: pathFromProps,
  })

  const inputValue = typeof value === 'string' ? value : ''
  const query = useDebounce(inputValue.trim(), 250)

  const resolvedPlaceholder = useMemo(() => {
    if (typeof placeholder === 'string' && placeholder.trim()) {
      return placeholder
    }

    return defaultPlaceholder
  }, [placeholder])

  useEffect(() => {
    if (readOnly || query.length < 2) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const run = async () => {
      setIsLoading(true)

      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&type=municipality&limit=6`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          setSuggestions([])
          return
        }

        const data = (await response.json()) as AddressResponse
        const nextSuggestions = (data.features || [])
          .map((feature, index) => toSuggestion(feature, index))
          .filter((item): item is Suggestion => Boolean(item))

        setSuggestions(nextSuggestions)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setSuggestions([])
        }
      } finally {
        setIsLoading(false)
      }
    }

    void run()

    return () => {
      controller.abort()
    }
  }, [query, readOnly])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const showDropdown = isFocused && !readOnly && (isLoading || suggestions.length > 0)

  return (
    <div className={className} ref={wrapperRef}>
      <TextInput
        AfterInput={AfterInput}
        BeforeInput={BeforeInput}
        Description={
          Description || (
            <FieldDescription description={description} path={path} />
          )
        }
        Error={Error || <FieldError path={path} showError={showError} />}
        Label={Label || <FieldLabel label={label} localized={localized} path={path} required={required} />}
        label={label}
        localized={localized}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setValue(event.target.value)
          setIsFocused(true)
        }}
        path={path}
        placeholder={resolvedPlaceholder}
        readOnly={readOnly}
        required={required}
        showError={showError}
        value={inputValue}
      />

      {showDropdown && (
        <div
          style={{
            background: '#fff',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            marginTop: '6px',
            maxHeight: '220px',
            overflowY: 'auto',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {isLoading ? (
            <button
              type="button"
              disabled
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--theme-text)',
                display: 'block',
                padding: '10px 12px',
                textAlign: 'left',
                width: '100%',
              }}
            >
              Recherche...
            </button>
          ) : (
            suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => {
                  setValue(suggestion.value)
                  setIsFocused(false)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--theme-text)',
                  cursor: 'pointer',
                  display: 'block',
                  padding: '10px 12px',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                {suggestion.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default LocationAutocompleteField
