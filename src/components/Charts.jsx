import { Card, Empty } from 'antd'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { COLORS, fmt, GREEN, NAVY, SALMON } from '../utils.js'

const compact = (v) => (Math.abs(v) >= 1000 ? `${Math.round(v / 1000)}k` : v)
const H = 300

function Box({ title, empty, children }) {
  return (
    <Card title={title} style={{ height: '100%' }}>
      {empty ? <Empty description="No data yet – add figures on the Monthly Input page" style={{ height: H - 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} /> : (
        <ResponsiveContainer width="100%" height={H}>{children}</ResponsiveContainer>
      )}
    </Card>
  )
}

export function SummaryBar({ income, expense, balance }) {
  const rows = [
    { name: 'Income', value: income, fill: NAVY },
    { name: 'Expenses', value: expense, fill: SALMON },
    { name: 'Balance', value: balance, fill: GREEN },
  ]
  return (
    <Box title="Income vs expenses vs balance" empty={!income && !expense}>
      <BarChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={compact} />
        <Tooltip formatter={(v) => fmt(v)} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {rows.map((r) => <Cell key={r.name} fill={r.fill} />)}
        </Bar>
      </BarChart>
    </Box>
  )
}

export function ExpensePie({ title, rows }) {
  const data = rows.filter((r) => r.amount > 0)
  return (
    <Box title={title} empty={data.length === 0}>
      <PieChart>
        <Pie data={data} dataKey="amount" nameKey="name" innerRadius={60} outerRadius={105} paddingAngle={2}>
          {data.map((r, i) => <Cell key={r.key} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v) => fmt(v)} />
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </Box>
  )
}

export function CategoryBar({ title, rows, color = SALMON }) {
  const data = rows.filter((r) => r.amount > 0).sort((a, b) => b.amount - a.amount)
  return (
    <Box title={title} empty={data.length === 0}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={compact} />
        <YAxis type="category" dataKey="name" width={110} />
        <Tooltip formatter={(v) => fmt(v)} />
        <Bar dataKey="amount" fill={color} radius={[0, 6, 6, 0]} />
      </BarChart>
    </Box>
  )
}

export function MonthlyCompare({ monthly }) {
  return (
    <Box title="Income vs expenses by month" empty={monthly.every((m) => !m.income && !m.expense)}>
      <BarChart data={monthly}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="short" />
        <YAxis tickFormatter={compact} />
        <Tooltip formatter={(v) => fmt(v)} />
        <Legend />
        <Bar dataKey="income" name="Income" fill={NAVY} radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" name="Expenses" fill={SALMON} radius={[4, 4, 0, 0]} />
      </BarChart>
    </Box>
  )
}

export function SavingsLine({ monthly }) {
  return (
    <Box title="Monthly savings" empty={monthly.every((m) => !m.income && !m.expense)}>
      <LineChart data={monthly}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="short" />
        <YAxis tickFormatter={compact} />
        <Tooltip formatter={(v) => fmt(v)} />
        <Line type="linear" dataKey="savings" name="Savings" stroke={GREEN} strokeWidth={2.5} dot={{ r: 4 }} />
      </LineChart>
    </Box>
  )
}
