import { useEffect, useMemo, useRef, useState } from 'react'
import './TicketDisplay.css'

function TicketDisplay({ ticket }) {
  const [displayedNumber, setDisplayedNumber] = useState(null)
  const [isCycling, setIsCycling] = useState(false)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  const ticketKey = useMemo(() => {
    if (!ticket) return null
    return `${ticket.color}-${ticket.variant}-${ticket.number}`
  }, [ticket])

  const stopCycling = (finalNumber) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setDisplayedNumber(finalNumber)
    setIsCycling(false)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!ticketKey) {
      stopCycling(null)
      return
    }

    setIsCycling(true)

    intervalRef.current = setInterval(() => {
      const random = Math.floor(Math.random() * 100) + 1
      setDisplayedNumber(random)
    }, 70)

    timeoutRef.current = setTimeout(() => {
      stopCycling(ticket.number)
    }, 2000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [ticketKey, ticket?.number])

  if (!ticket) {
    return (
      <div className="ticket-display empty">
        <div className="ticket-content">
          <p>No ticket generated yet</p>
          <p className="subtitle">Click "Generate Ticket" to start</p>
        </div>
      </div>
    )
  }

  const finalNumber = displayedNumber ?? ticket.number

  return (
    <div className={`ticket-display color-${ticket.color}`}>
      <div className="ticket-content">
        <div className="ticket-number" aria-live="polite">
          {String(finalNumber).padStart(2, '0')}
        </div>
        <div className="ticket-variant">{ticket.variant}</div>
      </div>
    </div>
  )
}

export default TicketDisplay

