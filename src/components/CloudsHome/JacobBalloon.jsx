export default function JacobBalloon() {
  return (
    <div className="jacob-balloon">
      <div className="jacob-balloon__person">
        <div className="jacob-balloon__head" />
        <div className="jacob-balloon__body" />
        <div className="jacob-balloon__arm jacob-balloon__arm--left" />
        <div className="jacob-balloon__arm jacob-balloon__arm--right" />
        <div className="jacob-balloon__leg jacob-balloon__leg--left" />
        <div className="jacob-balloon__leg jacob-balloon__leg--right" />
      </div>

      <div className="jacob-balloon__balloon-wrap">
        <div className="jacob-balloon__balloon" />
        <svg width="24" height="70" viewBox="0 0 24 70" className="jacob-balloon__string" aria-hidden="true">
          <path d="M12 0 C16 18, 8 28, 12 44 C16 56, 8 62, 12 70" fill="none" stroke="rgba(170,100,135,0.75)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
