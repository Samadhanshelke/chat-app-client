import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/AuthContext.tsx'
import { FeedProvider } from './context/FeedContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <UserProvider>
    <FeedProvider>
      <App />
    </FeedProvider>
    </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
