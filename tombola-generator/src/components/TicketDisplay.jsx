import './TicketDisplay.css'

function TicketDisplay({ ticket }) {
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

  return (
    <div className={`ticket-display color-${ticket.color}`}>
      <div className="ticket-content">
        <div className="ticket-number">{ticket.number}</div>
        <div className="ticket-variant">{ticket.variant}</div>
      </div>
    </div>
  )
}

export default TicketDisplay

