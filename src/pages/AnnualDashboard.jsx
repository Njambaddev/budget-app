import { Col, Row, Typography } from 'antd'
import { useBudget } from '../store.jsx'
import { categoryRows, compute, NAVY } from '../utils.js'
import StatCards from '../components/StatCards.jsx'
import { CategoryBar, ExpensePie, MonthlyCompare, SavingsLine } from '../components/Charts.jsx'
import CategoryTable from '../components/CategoryTable.jsx'

export default function AnnualDashboard() {
  const { data } = useBudget()
  const { monthly, total } = compute(data)
  const rows = categoryRows(data, null)

  return (
    <div className="page">
      <div className="page-head">
        <Typography.Title level={2}>Annual dashboard – {data.year}</Typography.Title>
      </div>
      <StatCards income={total.income} expense={total.expense} savings={total.savings} rate={total.rate} />
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}><MonthlyCompare monthly={monthly} /></Col>
        <Col xs={24} lg={12}><SavingsLine monthly={monthly} /></Col>
        <Col xs={24} lg={12}><ExpensePie title="Annual expense share" rows={rows} /></Col>
        <Col xs={24} lg={12}><CategoryBar title="Annual expenses by category" rows={rows} color={NAVY} /></Col>
        <Col span={24}><CategoryTable title="Top expense sources (year)" rows={rows} /></Col>
      </Row>
    </div>
  )
}
