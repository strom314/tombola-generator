import { useEffect, useMemo, useRef, useState } from 'react'
import './TicketDisplay.css'

function TicketDisplay({ ticket }) {
  const [displayedNumber, setDisplayedNumber] = useState(null)
  const [displayedVariant, setDisplayedVariant] = useState(null)
  const [isCycling, setIsCycling] = useState(false)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const variantCycleRef = useRef('A')

  const ticketKey = useMemo(() => {
    if (!ticket) return null
    return `${ticket.color}-${ticket.variant}-${ticket.number}`
  }, [ticket])

  const stopCycling = (finalNumber, finalVariant) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setDisplayedNumber(finalNumber)
    setDisplayedVariant(finalVariant)
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
      stopCycling(null, null)
      return
    }

    setIsCycling(true)
    variantCycleRef.current = 'A'

    intervalRef.current = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * 100) + 1
      variantCycleRef.current = variantCycleRef.current === 'A' ? 'B' : 'A'
      setDisplayedNumber(randomNumber)
      setDisplayedVariant(variantCycleRef.current)
    }, 70)

    timeoutRef.current = setTimeout(() => {
      stopCycling(ticket.number, ticket.variant)
    }, 2000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [ticketKey, ticket?.number, ticket?.variant])

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
  const finalVariant = displayedVariant ?? ticket.variant

  return (
    <div className={`ticket-display color-${ticket.color}`}>
      <div className="ticket-content">
        <div className="ticket-number" aria-live="polite">
          {String(finalNumber).padStart(2, '0')}
        </div>
        <div className="ticket-variant" aria-live="polite">{finalVariant}</div>
      </div>
    </div>
  )
}

export default TicketDisplay

