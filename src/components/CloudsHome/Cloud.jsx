export default function Cloud({ label, style, onClick }) {
  return (
    <div
      className="page-cloud"
      style={{
        '--cloud-top': style.top,
        '--cloud-left': style.left,
        '--cloud-right': style.right,
        '--cloud-animation': style.animation,
      }}
      onClick={onClick}
    >
      <div className="page-cloud__body">
        <Puff style={{ '--puff-w': '165px', '--puff-h': '40px', '--puff-bottom': '2px', '--puff-left': '8px' }} under />
        <Puff style={{ '--puff-w': '158px', '--puff-h': '66px', '--puff-bottom': '0', '--puff-left': '11px' }} />
        <Puff style={{ '--puff-w': '112px', '--puff-h': '76px', '--puff-bottom': '30px', '--puff-left': '30px' }} />
        <Puff style={{ '--puff-w': '82px', '--puff-h': '62px', '--puff-bottom': '52px', '--puff-left': '50px' }} />
        <Puff style={{ '--puff-w': '72px', '--puff-h': '54px', '--puff-bottom': '32px', '--puff-right': '12px' }} />
        <Puff style={{ '--puff-w': '48px', '--puff-h': '40px', '--puff-bottom': '68px', '--puff-left': '72px' }} />
        <div className="page-cloud__shadow" />
      </div>
      <div className="page-cloud__label">{label}</div>
    </div>
  )
}

function Puff({ style, under }) {
  return <div className={`page-cloud__puff${under ? ' page-cloud__puff--under' : ''}`} style={style} />
}
