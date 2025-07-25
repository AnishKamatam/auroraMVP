import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signUp(email, password, { firstName, lastName })
      setError('Check your email for confirmation link!')
      // Note: For email confirmation, we don't redirect immediately
      // User needs to confirm email first
    } catch (err: any) {
      // Handle specific Supabase error for existing user
      if (err.message && err.message.includes('already registered')) {
        setError('An account with this email already exists. Please try logging in instead.')
      } else if (err.message && err.message.includes('User already registered')) {
        setError('An account with this email already exists. Please try logging in instead.')
      } else if (err.message && err.message.includes('already been registered')) {
        setError('An account with this email already exists. Please try logging in instead.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Sign Up</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="toggle-auth">
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={() => {
              onClose()
              onSwitchToLogin()
            }}
            className="link-button"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignupModal 