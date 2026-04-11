export default function JacobBalloon() {
	return (
		<div className="jacob-balloon" aria-hidden="true">
			<img src="/headshot.png" alt="" className="jacob-balloon__headshot" />
			<div className="jacob-balloon__balloon-wrap" style={{ rotate: "12deg" }}>
				<div className="jacob-balloon__balloon" />
				<svg width="24" height="120" viewBox="0 0 24 120" className="jacob-balloon__string" aria-hidden="true">
					<path d="M12 0 C16 18, 8 30, 12 48 C16 64, 7 78, 12 96 C15 106, 10 113, 12 120" fill="none" stroke="rgba(170,100,135,0.75)" strokeWidth="2" strokeLinecap="round" />
				</svg>
			</div>
			<div className="jacob-balloon__balloon-wrap">
				<div className="jacob-balloon__balloon" />
				<svg width="24" height="120" viewBox="0 0 24 120" className="jacob-balloon__string" aria-hidden="true">
					<path d="M12 0 C16 18, 8 30, 12 48 C16 64, 7 78, 12 96 C15 106, 10 113, 12 120" fill="none" stroke="rgba(170,100,135,0.75)" strokeWidth="2" strokeLinecap="round" />
				</svg>
			</div>
			<div className="jacob-balloon__balloon-wrap" style={{ rotate: "-14deg" }}>
				<div className="jacob-balloon__balloon" />
				<svg width="24" height="120" viewBox="0 0 24 120" className="jacob-balloon__string" aria-hidden="true">
					<path d="M12 0 C16 18, 8 30, 12 48 C16 64, 7 78, 12 96 C15 106, 10 113, 12 120" fill="none" stroke="rgba(170,100,135,0.75)" strokeWidth="2" strokeLinecap="round" />
				</svg>
			</div>
		</div>
	);
}
