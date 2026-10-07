import { useState } from 'react'
import { useAuth } from './auth.jsx'
import './login.css'

const BARS = [
  [36, '#3B6FA3'], [44, '#4379B0'], [42, '#4C84BC'], [54, '#5890C7'], [50, '#659CD1'], [62, '#74A8DA'],
  [58, '#86B4E1'], [72, '#9BC2E8'], [68, '#B4D2EF'], [84, '#D3E3F5'], [98, '#F2C2B6'], [100, '#E8A598'],
]

function Logo({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <rect width="34" height="34" rx="9" fill="#E8A598" />
      <rect x="7" y="17" width="5" height="10" rx="1.5" fill="#0E2740" />
      <rect x="14.5" y="12" width="5" height="15" rx="1.5" fill="#0E2740" />
      <rect x="22" y="7" width="5" height="20" rx="1.5" fill="#0E2740" />
    </svg>
  )
}

function PasswordField({ id, label, value, onChange, error, placeholder, autoComplete, hint }) {
  const [show, setShow] = useState(false)
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-control">
        <input id={id} className="has-toggle" type={show ? 'text' : 'password'} value={value} onChange={onChange}
               placeholder={placeholder} autoComplete={autoComplete} aria-invalid={error ? 'true' : undefined} />
        <button type="button" className="auth-toggle" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {hint && <div className="auth-hint">{hint}</div>}
      {error && <div className="auth-err" role="alert">{error}</div>}
    </div>
  )
}

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('in')
  const [v, setV] = useState({ name: '', email: '', password: '', confirm: '' })
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)
  const isIn = mode === 'in'
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }))

  const switchMode = () => {
    setMode(isIn ? 'up' : 'in')
    setV((s) => ({ ...s, password: '', confirm: '' }))
    setErrors({}); setFormError('')
  }

  const validate = () => {
    const e = {}
    const email = v.email.trim()
    if (!isIn && !v.name.trim()) e.name = 'Enter your name.'
    if (!email) e.email = 'Enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address, like you@example.com.'
    if (!v.password) e.password = 'Enter your password.'
    else if (!isIn && v.password.length < 8) e.password = 'Use at least 8 characters.'
    if (!isIn && v.confirm !== v.password) e.confirm = 'Passwords do not match.'
    return e
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setFormError('')
    const e = validate()
    setErrors(e)
    const first = ['name', 'email', 'password', 'confirm'].find((k) => e[k])
    if (first) { document.getElementById(first)?.focus(); return }
    setBusy(true)
    try {
      await (isIn ? signIn : signUp)({ name: v.name, email: v.email, password: v.password, remember })
    } catch (err) {
      setFormError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const err = (k) => errors[k] && <div className="auth-err" role="alert">{errors[k]}</div>

  return (
    <div className="auth">
      <aside className="auth-hero">
        <div className="auth-hero-in">
          <div className="brand"><Logo size={32} /> Budget Tracker</div>
          <div className="auth-bars" aria-hidden="true">
            {BARS.map(([h, c], i) => <i key={i} style={{ '--h': h, '--n': i, '--c': c }} />)}
          </div>
        </div>
      </aside>

      <main className="auth-side">
        <section className="auth-panel">
          <h2>{isIn ? 'Welcome back' : 'Create your account'}</h2>
          <p className="auth-sub">{isIn ? 'Sign in to your budget.' : 'Set up your budget in a minute.'}</p>

          <form onSubmit={onSubmit} noValidate>
            {formError && <div className="auth-formerror" role="alert">{formError}</div>}
            {!isIn && (
              <div className="auth-field">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" value={v.name} onChange={set('name')} placeholder="Your name" autoComplete="name" aria-invalid={errors.name ? 'true' : undefined} />
                {err('name')}
              </div>
            )}
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={v.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" aria-invalid={errors.email ? 'true' : undefined} />
              {err('email')}
            </div>
            <PasswordField id="password" label="Password" value={v.password} onChange={set('password')} error={errors.password}
              placeholder={isIn ? 'Your password' : 'Create a password'} autoComplete={isIn ? 'current-password' : 'new-password'}
              hint={isIn ? null : 'At least 8 characters.'} />
            {!isIn && (
              <PasswordField id="confirm" label="Confirm password" value={v.confirm} onChange={set('confirm')} error={errors.confirm}
                placeholder="Repeat your password" autoComplete="new-password" />
            )}
            <label className="auth-remember">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Keep me signed in on this device
            </label>
            <button className="auth-btn" type="submit" disabled={busy}>
              {busy ? (isIn ? 'Signing in…' : 'Creating account…') : isIn ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            {isIn ? 'New here?' : 'Already have an account?'}{' '}
            <button type="button" className="auth-link" onClick={switchMode}>{isIn ? 'Create an account' : 'Sign in'}</button>
          </p>
        </section>
      </main>
    </div>
  )
}
