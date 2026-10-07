import React from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import { AuthProvider, useAuth } from './auth.jsx'
import { BudgetProvider } from './store.jsx'

function Root() {
  const { user } = useAuth()
  if (!user) return <Login />
  return (
    <BudgetProvider key={user.id} userId={user.id}>
      <App />
    </BudgetProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </React.StrictMode>
)
