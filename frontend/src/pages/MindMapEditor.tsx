import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GiBrain } from 'react-icons/gi'
import { mindMapService, MindMapNode, MindMap } from '../services/mindMapService'



const MindMapEditor: React.FC = () => {
  const { mindMapId } = useParams<{ mindMapId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [mindMap, setMindMap] = useState<MindMap | null>(null)
  const [title, setTitle] = useState('Untitled mind map')
  const [nodes, setNodes] = useState<MindMapNode[]>([])
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    if (mindMapId && mindMapId !== 'new') {
      // Load existing mind map
      loadMindMap(mindMapId)
    }
  }, [mindMapId])

  const loadMindMap = async (id: string) => {
    try {
      const data = await mindMapService.getMindMap(id)
      if (data) {
        setMindMap(data)
        setTitle(data.title)
        setNodes(data.nodes)
      }
    } catch (error) {
      console.error('Error loading mind map:', error)
    }
  }

  const saveMindMap = async () => {
    if (!user) return

    try {
      if (mindMapId === 'new') {
        // Create new mind map
        console.log('Creating new mind map with title:', title, 'and nodes:', nodes)
        const newMindMap = await mindMapService.createMindMap(title, nodes)
        console.log('Created mind map:', newMindMap)
        // Navigate to the new mind map
        navigate(`/mindmap/${newMindMap.id}`)
      } else {
        // Update existing mind map
        await mindMapService.updateMindMap(mindMapId!, title, nodes)
      }
    } catch (error) {
      console.error('Error saving mind map:', error)
    }
  }



  return (
    <div className="mind-map-editor">
      {/* Header */}
      <header className="editor-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
            </svg>
          </button>
          <div className="logo">
            <GiBrain size={20} />
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              // Auto-save when title changes
              if (mindMapId !== 'new') {
                setTimeout(() => saveMindMap(), 1000)
              }
            }}
            className="title-input"
          />
          <button className="star-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
            </svg>
          </button>
          <span className="node-count">{nodes.length} nodes</span>

        </div>
        <div className="header-right">
          <button className="share-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" fill="currentColor"/>
            </svg>
            Share
          </button>
          <button className="menu-button" onClick={saveMindMap}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </header>



      {/* Canvas */}
      <div className="canvas-container">
        <div 
          className="canvas"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`mind-map-node ${node.type}`}
              style={{
                left: node.x,
                top: node.y,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {node.text}
            </div>
          ))}
          
          {nodes.length === 0 && (
            <div className="instruction-overlay">
              <GiBrain size={48} />
              <h3>Start building your mind map</h3>
              <p>Voice commands coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="right-controls">
        <div className="zoom-controls">
          <button className="control-button" onClick={() => setZoom(Math.max(50, zoom - 10))}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13H5v-2h14v2z" fill="currentColor"/>
            </svg>
          </button>
          <span className="zoom-level">{zoom}%</span>
          <button className="control-button" onClick={() => setZoom(Math.min(200, zoom + 10))}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Help Button */}
      <div className="help-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" fill="currentColor"/>
        </svg>
      </div>
    </div>
  )
}

export default MindMapEditor 