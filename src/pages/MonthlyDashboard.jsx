import { useState } from 'react'
import { Col, Row, Select, Typography } from 'antd'
import { useBudget } from '../store.jsx'
import { MONTHS, categoryRows, compute } from '../utils.js'
import StatCards from '../components/StatCards.jsx'
import { CategoryBar, ExpensePie, SummaryBar } from '../components/Charts.jsx'
import CategoryTable from '../components/CategoryTable.jsx'

export default function MonthlyDashboard() {
  const { data } = useBudget()
  const [month, setMonth] = useState(Math.min(new Date().getMonth(), 11))
  const { monthly } = compute(data)
  const m = monthly[month]
  const rows = categoryRows(data, month)

  return (
    <div className="page">
      <div className="page-head">
        <Typography.Title level={2}>Monthly dashboard – {MONTHS[month]} {data.year}</Typography.Title>
        <Select
          value={month}
          onChange={setMonth}
          style={{ width: 180 }}
          options={MONTHS.map((n, i) => ({ value: i, label: n }))}
        />
      </div>
      <StatCards income={m.income} expense={m.expense} savings={m.savings} rate={m.rate} />
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={8}><SummaryBar income={m.income} expense={m.expense} balance={m.savings} /></Col>
        <Col xs={24} lg={8}><ExpensePie title="Where your money went" rows={rows} /></Col>
        <Col xs={24} lg={8}><CategoryBar title="Expenses by category" rows={rows} /></Col>
        <Col span={24}><CategoryTable title="Top expense sources" rows={rows} /></Col>
      </Row>
    </div>
  )
}
