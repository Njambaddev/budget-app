import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LEGACY_KEY = 'budget-tracker-v1'
const uid = () => Math.random().toString(36).slice(2, 9)
const zeros = () => Array(12).fill(0)
const item = (name, vals = {}) => ({ id: uid(), name, values: Object.assign(zeros(), vals) })

// Sample data (October) so the dashboards are not empty on first run.
export const seed = () => ({
  year: 2026,
  incomeSources: [
    item('Salary', { 9: 70000 }),
    item('Freelancing', { 9: 40000 }),
    item('Side Hustle', { 9: 25000 }),
  ],
  categories: [
    item('Rent', { 9: 25000 }),
    item('Shopping'),
    item('Transport/Fuel'),
    item('Groceries', { 9: 5000 }),
    item('School Fees'),
    item('Personal Upkeep'),
    item('Bills'),
    item('Miscellaneous'),
    item('Eating Out'),
    item('Family'),
    item('Entertainment & Wifi'),
  ],
})

const Ctx = createContext(null)
export const useBudget = () => useContext(Ctx)

export function BudgetProvider({ userId, children }) {
  const KEY = `${LEGACY_KEY}:${userId}`
  const [data, setData] = useState(() => {
    try {
      let s = localStorage.getItem(KEY)
      if (!s) {
        // first sign-in: adopt data saved before accounts existed
        s = localStorage.getItem(LEGACY_KEY)
        if (s) { localStorage.setItem(KEY, s); localStorage.removeItem(LEGACY_KEY) }
      }
      return s ? JSON.parse(s) : seed()
    } catch {
      return seed()
    }
  })

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* storage unavailable */ }
  }, [data, KEY])

  const actions = useMemo(() => {
    const mapKind = (kind, fn) => setData((d) => ({ ...d, [kind]: fn(d[kind]) }))
    return {
      setYear: (year) => setData((d) => ({ ...d, year })),
      setValue: (kind, id, month, value) =>
        mapKind(kind, (list) =>
          list.map((it) => (it.id === id ? { ...it, values: it.values.map((v, i) => (i === month ? value : v)) } : it))),
      addItem: (kind, name) => mapKind(kind, (list) => [...list, item(name)]),
      renameItem: (kind, id, name) => mapKind(kind, (list) => list.map((it) => (it.id === id ? { ...it, name } : it))),
      removeItem: (kind, id) => mapKind(kind, (list) => list.filter((it) => it.id !== id)),
      clearFigures: () =>
        setData((d) => ({
          ...d,
          incomeSources: d.incomeSources.map((i) => ({ ...i, values: zeros() })),
          categories: d.categories.map((i) => ({ ...i, values: zeros() })),
        })),
      restoreSample: () => setData(seed()),
    }
  }, [])

  return <Ctx.Provider value={{ data, ...actions }}>{children}</Ctx.Provider>
}
