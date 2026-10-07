import { Card, Col, Progress, Row, Statistic } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined, WalletOutlined } from '@ant-design/icons'
import { fmt, GREEN, NAVY, SALMON } from '../utils.js'

export default function StatCards({ income, expense, savings, rate }) {
  const rateClamped = Math.max(0, Math.min(100, rate * 100))
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Total income" value={fmt(income)} prefix={<ArrowUpOutlined />} valueStyle={{ color: NAVY }} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Total expenses" value={fmt(expense)} prefix={<ArrowDownOutlined />} valueStyle={{ color: '#d9534f' }} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Balance"
            value={fmt(savings)}
            prefix={<WalletOutlined />}
            valueStyle={{ color: savings < 0 ? '#d9534f' : GREEN }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Savings rate" value={(rate * 100).toFixed(1)} suffix="%" />
          <Progress percent={rateClamped} showInfo={false} strokeColor={SALMON} size="small" />
        </Card>
      </Col>
    </Row>
  )
}
