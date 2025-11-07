import { useEffect, useMemo, useRef, useState } from 'react'
import './TicketDisplay.css'

const COLOR_SEQUENCE = ['red', 'blue', 'green', 'yellow']
const COLOR_TO_HEX = {
  red: '#e53935',
  blue: '#1e88e5',
  green: '#43a047',
  yellow: '#f4b400'
}

function TicketDisplay({ ticket }) {
  const [displayedNumber, setDisplayedNumber] = useState(null)
  const [displayedVariant, setDisplayedVariant] = useState(null)
  const [isCycling, setIsCycling] = useState(false)
  const [cyclingColor, setCyclingColor] = useState(null)
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
    // cyclingColor will fade out via CSS opacity when isCycling becomes false
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
      setCyclingColor(null)
      return
    }

    setIsCycling(true)
    variantCycleRef.current = 'A'

    // Number + variant fast cycling
    const numberInterval = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * 100) + 1
      variantCycleRef.current = variantCycleRef.current === 'A' ? 'B' : 'A'
      setDisplayedNumber(randomNumber)
      setDisplayedVariant(variantCycleRef.current)
    }, 70)
    intervalRef.current = numberInterval

    // Color smooth cycling: 4 colors over ~2s => ~500ms per color
    const colors = COLOR_SEQUENCE
    let colorIndex = 0
    setCyclingColor(colors[colorIndex])
    const colorInterval = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length
      setCyclingColor(colors[colorIndex])
    }, 500)

    timeoutRef.current = setTimeout(() => {
      // stop both intervals
      clearInterval(numberInterval)
      clearInterval(colorInterval)
      intervalRef.current = null
      stopCycling(ticket.number, ticket.variant)
      // After stopping, overlay fades out to reveal final color
    }, 2000)

    return () => {
      clearInterval(numberInterval)
      clearInterval(colorInterval)
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
  const displayClassName = `ticket-display color-${ticket.color}${isCycling ? ' cycling' : ''}`

  return (
    <div className={displayClassName}>
      {/* Smooth color overlay that fades/changes during cycling */}
      <div
        className={`color-fader${isCycling ? ' visible' : ''}`}
        style={{ backgroundColor: cyclingColor ? COLOR_TO_HEX[cyclingColor] : 'transparent' }}
        aria-hidden
      />
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

