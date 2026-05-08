'use client'
import { useState, useCallback } from 'react'

export type PopupType = 'success' | 'error' | 'warning' | 'info'

interface PopupState {
  type: PopupType
  content: string
  visible: boolean
}

const usePopup = () => {
  const [popup, setPopup] = useState<PopupState>({ type: 'info', content: '', visible: false })

  const messagePopup = useCallback((type: PopupType, content: string, duration = 2) => {
    setPopup({ type, content, visible: true })
    setTimeout(() => setPopup(prev => ({ ...prev, visible: false })), duration * 1000)
  }, [])

  const contextHolder = popup.visible ? (
    <div
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        padding: '8px 16px',
        borderRadius: 6,
        fontSize: 13,
        fontFamily: 'var(--sans)',
        background: popup.type === 'error' ? 'var(--accent-soft)' : popup.type === 'success' ? 'var(--green-soft)' : 'var(--paper-2)',
        border: `1px solid ${popup.type === 'error' ? 'var(--accent-line)' : popup.type === 'success' ? 'var(--green-line)' : 'var(--rule)'}`,
        color: popup.type === 'error' ? 'var(--accent)' : popup.type === 'success' ? 'var(--green)' : 'var(--ink)',
        boxShadow: '0 4px 12px -4px oklch(20% 0.01 60 / 0.2)',
      }}
    >
      {popup.content}
    </div>
  ) : null

  return { messagePopup, contextHolder }
}

export default usePopup
