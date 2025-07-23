import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LoginModal from '../components/LoginModal'

const Home: React.FC = () => {
  const { user, signOut } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="home">
      {/* Header with login/logout button */}
      <header className="header">
        {user ? (
          <button onClick={handleLogout} className="auth-button">
            Log Out
          </button>
        ) : (
          <button 
            onClick={() => setIsLoginModalOpen(true)} 
            className="auth-button"
          >
            Log In
          </button>
        )}
      </header>

      {/* Main content */}
      <main className="main-content">
        <h1 className="aurora-title">Aurora</h1>
      </main>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  )
}

export default Home 