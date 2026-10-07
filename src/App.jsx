import { useState } from 'react'
import { Avatar, ConfigProvider, Dropdown, Layout, Menu, Tag } from 'antd'
import { BarChartOutlined, CalendarOutlined, EditOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useBudget } from './store.jsx'
import { useAuth } from './auth.jsx'
import MonthlyDashboard from './pages/MonthlyDashboard.jsx'
import AnnualDashboard from './pages/AnnualDashboard.jsx'
import MonthlyInput from './pages/MonthlyInput.jsx'
import Settings from './pages/Settings.jsx'

const PAGES = {
  monthly: MonthlyDashboard,
  annual: AnnualDashboard,
  input: MonthlyInput,
  settings: Settings,
}

const items = [
  { key: 'monthly', icon: <CalendarOutlined />, label: 'Monthly dashboard' },
  { key: 'annual', icon: <BarChartOutlined />, label: 'Annual dashboard' },
  { key: 'input', icon: <EditOutlined />, label: 'Monthly input' },
  { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
]

export default function App() {
  const [page, setPage] = useState('monthly')
  const { data } = useBudget()
  const { user, signOut } = useAuth()
  const Page = PAGES[page]
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#2F5D8C', borderRadius: 8 } }}>
      <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <Layout.Header style={{ display: 'flex', alignItems: 'center', gap: 24, background: '#fff', borderBottom: '1px solid #eee', padding: '0 24px' }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#2F5D8C', whiteSpace: 'nowrap' }}>
            Budget Tracker <Tag color="#E8A598">{data.year}</Tag>
          </div>
          <Menu mode="horizontal" selectedKeys={[page]} items={items} onClick={(e) => setPage(e.key)} style={{ flex: 1, minWidth: 0, borderBottom: 'none' }} />
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'who', disabled: true, label: <div><b>{user.name}</b><div style={{ fontSize: 12 }}>{user.email}</div></div> },
                { type: 'divider' },
                { key: 'out', icon: <LogoutOutlined />, label: 'Sign out', onClick: signOut },
              ],
            }}
          >
            <button type="button" aria-label="Account menu" style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0 }}>
              <Avatar style={{ background: '#E8A598', color: '#17324f', fontWeight: 600 }}>{user.name.trim()[0]?.toUpperCase()}</Avatar>
            </button>
          </Dropdown>
        </Layout.Header>
        <Layout.Content>
          <Page />
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  )
}
