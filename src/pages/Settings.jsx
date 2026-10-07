import { useState } from 'react'
import { Button, Card, Col, Input, InputNumber, List, Popconfirm, Row, Space, Typography, message } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useBudget } from '../store.jsx'

function ItemList({ kind, title, placeholder }) {
  const { data, addItem, renameItem, removeItem } = useBudget()
  const [name, setName] = useState('')
  const add = () => {
    const n = name.trim()
    if (!n) return
    addItem(kind, n)
    setName('')
  }
  return (
    <Card title={title}>
      <List
        size="small"
        dataSource={data[kind]}
        renderItem={(it) => (
          <List.Item
            actions={[
              <Popconfirm
                key="del"
                title="Delete this row and its figures?"
                okText="Delete"
                onConfirm={() => removeItem(kind, it.id)}
              >
                <Button type="text" danger icon={<DeleteOutlined />} aria-label={`Delete ${it.name}`} />
              </Popconfirm>,
            ]}
          >
            <Input variant="borderless" value={it.name} onChange={(e) => renameItem(kind, it.id, e.target.value)} />
          </List.Item>
        )}
      />
      <Space.Compact style={{ width: '100%', marginTop: 12 }}>
        <Input placeholder={placeholder} value={name} onChange={(e) => setName(e.target.value)} onPressEnter={add} />
        <Button type="primary" icon={<PlusOutlined />} onClick={add}>Add</Button>
      </Space.Compact>
    </Card>
  )
}

export default function Settings() {
  const { data, setYear, clearFigures, restoreSample } = useBudget()
  return (
    <div className="page">
      <div className="page-head">
        <Typography.Title level={2}>Settings</Typography.Title>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <Space size="large" wrap>
          <span>
            Budget year{' '}
            <InputNumber min={2000} max={2100} value={data.year} onChange={(v) => v && setYear(v)} />
          </span>
          <Popconfirm
            title="Clear all income and expense figures?"
            description="Category and source names are kept."
            okText="Clear"
            onConfirm={() => { clearFigures(); message.success('All figures cleared') }}
          >
            <Button danger>Clear all figures</Button>
          </Popconfirm>
          <Popconfirm
            title="Replace everything with the sample data?"
            okText="Restore"
            onConfirm={() => { restoreSample(); message.success('Sample data restored') }}
          >
            <Button>Restore sample data</Button>
          </Popconfirm>
        </Space>
      </Card>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}><ItemList kind="incomeSources" title="Income sources" placeholder="e.g. Rental income" /></Col>
        <Col xs={24} md={12}><ItemList kind="categories" title="Expense categories" placeholder="e.g. Insurance" /></Col>
      </Row>
    </div>
  )
}
