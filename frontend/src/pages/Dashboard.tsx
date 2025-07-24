import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { GiBrain } from 'react-icons/gi'
import { mindMapService, MindMap } from '../services/mindMapService'
import DeleteConfirmModal from '../components/DeleteConfirmModal'

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const [mindMaps, setMindMaps] = useState<MindMap[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    mindMapId: string | null
    mindMapTitle: string
  }>({
    isOpen: false,
    mindMapId: null,
    mindMapTitle: ''
  })

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleCreateNewMindMap = async () => {
    try {
      // Create a new mind map immediately
      const newMindMap = await mindMapService.createMindMap('Untitled mind map', [])
      console.log('Created new mind map:', newMindMap)
      // Navigate to the new mind map
      navigate(`/mindmap/${newMindMap.id}`)
    } catch (error) {
      console.error('Error creating new mind map:', error)
    }
  }

  const handleDeleteMindMap = async (mindMapId: string, mindMapTitle: string) => {
    setDeleteModal({
      isOpen: true,
      mindMapId,
      mindMapTitle
    })
  }

  const confirmDelete = async () => {
    if (!deleteModal.mindMapId) return

    try {
      await mindMapService.deleteMindMap(deleteModal.mindMapId)
      // Remove the mind map from the local state
      setMindMaps(mindMaps.filter(mindMap => mindMap.id !== deleteModal.mindMapId))
      console.log('Mind map deleted successfully')
    } catch (error) {
      console.error('Error deleting mind map:', error)
      alert('Failed to delete mind map. Please try again.')
    }
  }

  // Load user's mind maps
  useEffect(() => {
    const loadMindMaps = async () => {
      try {
        console.log('Loading mind maps for user:', user?.id)
        const data = await mindMapService.getUserMindMaps()
        console.log('Loaded mind maps:', data)
        setMindMaps(data)
      } catch (error) {
        console.error('Error loading mind maps:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadMindMaps()
    }
  }, [user])

  // Reload mind maps when returning to dashboard
  useEffect(() => {
    if (user && location.pathname === '/dashboard') {
      const loadMindMaps = async () => {
        try {
          console.log('Reloading mind maps on dashboard return')
          const data = await mindMapService.getUserMindMaps()
          console.log('Reloaded mind maps:', data)
          setMindMaps(data)
        } catch (error) {
          console.error('Error loading mind maps:', error)
        }
      }
      loadMindMaps()
    }
  }, [user, location.pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">
              <GiBrain size={24} />
            </div>
            <span className="logo-text">Aurora Mind</span>
          </div>
        </div>
        <div className="header-right">
          <div className="search-container">
            <div className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search mind maps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="filter-button" title="Filter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill="currentColor"/>
            </svg>
          </button>
          <div className="view-toggle">
            <button 
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3v7h7V3H3zm9 0v7h7V3h-7zm-9 9v7h7v-7H3zm9 0v7h7v-7h-7z" fill="currentColor"/>
              </svg>
            </button>
            <button 
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div className="user-profile-container" ref={profileDropdownRef}>
            <div 
              className="user-avatar"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              {user?.user_metadata?.first_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            {isProfileDropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item user-info">
                  <div className="user-name">{user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}</div>
                  <div className="user-email">{user?.email}</div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-button" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
                  </svg>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
                <div className="content-section">
          <h2 className="section-title">
            Welcome, {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}.
          </h2>
          <div className="mind-map-grid">
            <div className="mind-map-card new-mind-map-card" onClick={handleCreateNewMindMap}>
              <div className="card-content">
                <div className="plus-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="card-title">Add new</div>
              </div>
            </div>
            
            {mindMaps.map((mindMap) => (
              <div 
                key={mindMap.id} 
                className="mind-map-card" 
              >
                <div className="card-header">
                  <div className="card-icon">
                    <GiBrain size={24} />
                  </div>
                  <button 
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteMindMap(mindMap.id, mindMap.title)
                    }}
                    title="Delete mind map"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                <div 
                  className="card-content"
                  onClick={() => navigate(`/mindmap/${mindMap.id}`)}
                >
                  <div className="card-title">{mindMap.title}</div>
                  <div className="card-meta">
                    <span className="node-count">{mindMap.nodes.length} nodes</span>
                    <span className="last-modified">
                      {new Date(mindMap.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="help-icon">?</div>
      </footer>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, mindMapId: null, mindMapTitle: '' })}
        onConfirm={confirmDelete}
        title="Delete Mind Map"
        message={`Are you sure you want to delete "${deleteModal.mindMapTitle}"? This action cannot be undone.`}
      />
    </>
  )
}

export default Dashboard 