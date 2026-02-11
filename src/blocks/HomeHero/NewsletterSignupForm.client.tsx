'use client'

import { FormEvent, useState } from 'react'

type Props = {
  placeholder: string
  buttonText: string
}

type SubmitState = 'idle' | 'loading' | 'success' | 'already' | 'error'

export const NewsletterSignupForm = ({ placeholder, buttonText }: Props) => {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<SubmitState>('idle')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) return

    setState('loading')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'home-hero',
          sourcePath: window.location.pathname,
        }),
      })

      const payload = (await response.json()) as { alreadySubscribed?: boolean; ok?: boolean }

      if (!response.ok) {
        setState('error')
        return
      }

      if (payload.alreadySubscribed) {
        setState('already')
        return
      }

      setState('success')
      setEmail('')
    } catch {
      setState('error')
    }
  }

  return (
    <form className="flex w-full flex-col gap-2" onSubmit={onSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center items-center">
        <input
          aria-label="Adresse mail"
          className="flex-1 rounded-full border border-white/60 bg-white/90 px-6 py-2 shadow-lg text-base font-medium text-slate-900 outline-none placeholder:text-slate-500"
          style={{
            height: '47px',
            lineHeight: '50px',
          }}
          placeholder={placeholder}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[var(--brand-green)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-black transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-green)] self-center sm:self-auto sm:-ml-16 sm:relative sm:z-10 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            height: '47px',
            minHeight: '47px',
            width: '174px',
            fontFamily: 'var(--font-akshar), var(--font-geist-sans), system-ui, sans-serif',
            fontWeight: 500,
            fontSize: '18px',
            lineHeight: '70px',
            letterSpacing: '0em',
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
        >
          {state === 'loading' ? 'Envoi...' : buttonText}
        </button>
      </div>
      <p aria-live="polite" className="text-sm text-white/90 text-center min-h-5">
        {state === 'success' ? 'Merci, votre inscription est enregistrée.' : null}
        {state === 'already' ? 'Cette adresse est déjà inscrite.' : null}
        {state === 'error' ? 'Impossible de valider pour le moment. Réessayez.' : null}
      </p>
    </form>
  )
}
