import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Layout } from './layout/Layout.jsx'
import { LayoutProvider } from './layout'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LayoutProvider>
      <Layout />
    </LayoutProvider>
  </React.StrictMode>,
)
