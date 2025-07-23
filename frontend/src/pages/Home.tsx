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
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-text">Aurora</span>
          </div>
        </div>
        <div className="header-right">
          {user ? (
            <button onClick={handleLogout} className="auth-button">
              Log Out
            </button>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)} 
              className="auth-button"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="main-content">
        <div className="hero-section">
          <h1 className="aurora-title">Aurora</h1>
          <div className="hero-description">
            <p>From voice to vision, instantly.</p>
          </div>
          <div className="hero-buttons">
            <button className="btn-primary">
              Get Started
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="help-icon">?</div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  )
}

export default Home 