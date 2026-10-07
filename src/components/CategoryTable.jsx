import { Card, Progress, Table } from 'antd'
import { fmt, pct, SALMON } from '../utils.js'

export default function CategoryTable({ title, rows }) {
  const sorted = [...rows].sort((a, b) => b.amount - a.amount)
  const total = rows.reduce((s, r) => s + r.amount, 0)
  return (
    <Card title={title}>
      <Table
        size="small"
        pagination={false}
        dataSource={sorted}
        columns={[
          { title: '#', width: 48, render: (_, __, i) => i + 1 },
          { title: 'Category', dataIndex: 'name' },
          { title: 'Amount', dataIndex: 'amount', align: 'right', render: (v) => (v ? fmt(v) : '–') },
          {
            title: '% of expenses', dataIndex: 'share', width: 220,
            render: (v) => (
              <Progress percent={Math.round(v * 1000) / 10} format={() => pct(v)} strokeColor={SALMON} size="small" />
            ),
          },
        ]}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} />
            <Table.Summary.Cell index={1}>Total</Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="right">{fmt(total)}</Table.Summary.Cell>
            <Table.Summary.Cell index={3} />
          </Table.Summary.Row>
        )}
      />
    </Card>
  )
}
