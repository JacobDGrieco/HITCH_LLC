export default function Cloud({ label, style, onClick, imageSrc }) {
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
        <img src={imageSrc} alt="" className="page-cloud__image" />
        <div className="page-cloud__shadow" />
      </div>
      <div className="page-cloud__label">{label}</div>
    </div>
  )
}
