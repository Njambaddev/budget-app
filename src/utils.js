export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
export const COLORS = ['#2F5D8C','#E8A598','#6AA84F','#F2C14E','#7B6CB8','#4FB0C6','#D96C6C','#9AA5B1','#C17F4E','#5E8C6A','#B56BAE','#3E7CB1']
export const NAVY = '#2F5D8C'
export const SALMON = '#E8A598'
export const GREEN = '#6AA84F'

export const sum = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0)
export const fmt = (n) => 'KSh ' + Math.round(Number(n) || 0).toLocaleString('en-KE')
export const pct = (n) => ((Number(n) || 0) * 100).toFixed(1) + '%'

export function compute(data) {
  const monthly = MONTHS.map((name, m) => {
    const income = sum(data.incomeSources.map((s) => s.values[m]))
    const expense = sum(data.categories.map((c) => c.values[m]))
    const savings = income - expense
    return { name, short: name.slice(0, 3), income, expense, savings, rate: income ? savings / income : 0 }
  })
  const income = sum(monthly.map((x) => x.income))
  const expense = sum(monthly.map((x) => x.expense))
  const total = { income, expense, savings: income - expense, rate: income ? (income - expense) / income : 0 }
  return { monthly, total }
}

// category rows for one month (m = 0..11) or the whole year (m = null)
export function categoryRows(data, m = null) {
  const rows = data.categories.map((c) => ({
    key: c.id,
    name: c.name,
    amount: m === null ? sum(c.values) : Number(c.values[m]) || 0,
  }))
  const total = sum(rows.map((r) => r.amount))
  return rows.map((r) => ({ ...r, share: total ? r.amount / total : 0 }))
}
