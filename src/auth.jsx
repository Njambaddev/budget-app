import { createContext, useContext, useMemo, useState } from 'react'

// Local, on-device accounts. Passwords are salted and hashed (PBKDF2) before they are stored,
// but there is no server: accounts only exist in this browser. Swap these functions for real
// API calls when a backend is added.
const USERS = 'bt-users'
const SESSION = 'bt-session'
const enc = new TextEncoder()

const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

async function hashPassword(password, saltB64) {
  if (!window.crypto?.subtle) {
    throw new Error('Sign-in needs a secure connection. Open the app on localhost or over https.')
  }
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: fromB64(saltB64), iterations: 150000, hash: 'SHA-256' }, key, 256)
  return toB64(bits)
}

const readUsers = () => { try { return JSON.parse(localStorage.getItem(USERS) || '[]') } catch { return [] } }
const writeUsers = (u) => localStorage.setItem(USERS, JSON.stringify(u))
const readSession = () => { try { return localStorage.getItem(SESSION) || sessionStorage.getItem(SESSION) } catch { return null } }
const publicUser = ({ id, name, email }) => ({ id, name, email })

function startSession(id, remember) {
  localStorage.removeItem(SESSION); sessionStorage.removeItem(SESSION)
  ;(remember ? localStorage : sessionStorage).setItem(SESSION, id)
}

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = readUsers().find((x) => x.id === readSession())
    return u ? publicUser(u) : null
  })

  const api = useMemo(() => ({
    async signUp({ name, email, password, remember }) {
      const mail = email.trim().toLowerCase()
      const users = readUsers()
      if (users.some((u) => u.email === mail)) throw new Error('An account with this email already exists. Sign in instead.')
      const salt = toB64(crypto.getRandomValues(new Uint8Array(16)))
      const rec = {
        id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
        name: name.trim(), email: mail, salt, hash: await hashPassword(password, salt),
      }
      writeUsers([...users, rec])
      startSession(rec.id, remember)
      setUser(publicUser(rec))
    },
    async signIn({ email, password, remember }) {
      const rec = readUsers().find((u) => u.email === email.trim().toLowerCase())
      const ok = rec && (await hashPassword(password, rec.salt)) === rec.hash
      if (!ok) throw new Error('Email or password is incorrect. Check both and try again.')
      startSession(rec.id, remember)
      setUser(publicUser(rec))
    },
    signOut() {
      localStorage.removeItem(SESSION); sessionStorage.removeItem(SESSION)
      setUser(null)
    },
  }), [])

  return <Ctx.Provider value={{ user, ...api }}>{children}</Ctx.Provider>
}
