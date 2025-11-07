import { useState, useMemo } from 'react'
import './App.css'
import SideMenu from './components/SideMenu'
import TicketDisplay from './components/TicketDisplay'
import WinningList from './components/WinningList'

const COLORS = ['red', 'blue', 'green', 'yellow']
const VARIANTS = ['A', 'B']

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [soldRanges, setSoldRanges] = useState({
    red: { A: '', B: '' },
    blue: { A: '', B: '' },
    green: { A: '', B: '' },
    yellow: { A: '', B: '' }
  })
  const [wonTickets, setWonTickets] = useState([])
  const [currentTicket, setCurrentTicket] = useState(null)

  // Parse range string (e.g., "1-50, 60-80") into array of numbers
  const parseRanges = (rangeString) => {
    if (!rangeString.trim()) return []
    
    const numbers = new Set()
    const parts = rangeString.split(',').map(part => part.trim())
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10))
        if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && end <= 100) {
          for (let i = start; i <= end; i++) {
            numbers.add(i)
          }
        }
      } else {
        const num = parseInt(part.trim(), 10)
        if (!isNaN(num) && num >= 1 && num <= 100) {
          numbers.add(num)
        }
      }
    }
    
    return Array.from(numbers).sort((a, b) => a - b)
  }

  // Get all available tickets (sold tickets that haven't won yet)
  const availableTickets = useMemo(() => {
    const available = []
    const wonSet = new Set(wonTickets.map(t => `${t.color}-${t.variant}-${t.number}`))
    
    COLORS.forEach(color => {
      VARIANTS.forEach(variant => {
        const ranges = soldRanges[color][variant]
        const numbers = parseRanges(ranges)
        
        numbers.forEach(number => {
          const key = `${color}-${variant}-${number}`
          if (!wonSet.has(key)) {
            available.push({ color, variant, number })
          }
        })
      })
    })
    
    return available
  }, [soldRanges, wonTickets])

  const handleGenerate = () => {
    if (availableTickets.length === 0) {
      alert('No available tickets to generate! Please configure sold ticket ranges.')
      return
    }
    
    const randomIndex = Math.floor(Math.random() * availableTickets.length)
    const ticket = availableTickets[randomIndex]
    
    setCurrentTicket(ticket)
    setWonTickets(prev => [...prev, ticket])
  }

  const handleClearWinners = () => {
    if (window.confirm('Are you sure you want to clear all winning tickets?')) {
      setWonTickets([])
      setCurrentTicket(null)
    }
  }

  return (
    <div className="app">
      <button 
        className="hamburger-menu"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <SideMenu 
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        soldRanges={soldRanges}
        onRangesChange={setSoldRanges}
        availableCount={availableTickets.length}
      />

      <div className="main-content">
        <h1>Tombola Ticket Generator</h1>
        
        <TicketDisplay ticket={currentTicket} />
        
        <div className="controls">
          <button 
            className="generate-button"
            onClick={handleGenerate}
            disabled={availableTickets.length === 0}
          >
            Generate Ticket
          </button>
          {wonTickets.length > 0 && (
            <button 
              className="clear-button"
              onClick={handleClearWinners}
            >
              Clear Winners
            </button>
          )}
        </div>

        <WinningList tickets={wonTickets} />
      </div>
    </div>
  )
}

export default App
