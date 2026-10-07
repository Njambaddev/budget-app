import { Alert, Card, InputNumber, Table, Typography } from 'antd'
import { useBudget } from '../store.jsx'
import { MONTHS, fmt, sum } from '../utils.js'

const formatter = (v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const parser = (v) => v.replace(/,/g, '')

function Grid({ kind, title, nameLabel }) {
  const { data, setValue } = useBudget()
  const rows = data[kind]

  const columns = [
    { title: nameLabel, dataIndex: 'name', fixed: 'left', width: 180 },
    ...MONTHS.map((mn, m) => ({
      title: mn.slice(0, 3),
      width: 110,
      render: (_, r) => (
        <InputNumber
          size="small"
          min={0}
          controls={false}
          placeholder="0"
          style={{ width: '100%' }}
          value={r.values[m] || null}
          formatter={formatter}
          parser={parser}
          onChange={(v) => setValue(kind, r.id, m, v || 0)}
        />
      ),
    })),
    { title: 'Year total', fixed: 'right', width: 130, align: 'right', render: (_, r) => <b>{fmt(sum(r.values))}</b> },
  ]

  return (
    <Card title={title} style={{ marginBottom: 16 }}>
      <Table
        size="small"
        rowKey="id"
        pagination={false}
        dataSource={rows}
        columns={columns}
        scroll={{ x: 180 + 12 * 110 + 130 }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
              {MONTHS.map((_, m) => (
                <Table.Summary.Cell key={m} index={m + 1} align="right">
                  {fmt(sum(rows.map((r) => r.values[m])))}
                </Table.Summary.Cell>
              ))}
              <Table.Summary.Cell index={13} align="right">
                {fmt(sum(rows.map((r) => sum(r.values))))}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  )
}

export default function MonthlyInput() {
  const { data } = useBudget()
  return (
    <div className="page">
      <div className="page-head">
        <Typography.Title level={2}>Monthly input – {data.year}</Typography.Title>
      </div>
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="Fill in each month separately – every month can have different income and expenses. Changes save automatically in this browser and the dashboards update instantly."
      />
      <Grid kind="incomeSources" title="Income" nameLabel="Income source" />
      <Grid kind="categories" title="Expenses" nameLabel="Expense category" />
    </div>
  )
}
