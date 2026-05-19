import SvgCloud from './SvgCloud';

export default function Cloud({ label, onClick, uid, floatIndex }) {
  return (
    <div
      className="page-cloud"
      style={{ '--float-index': floatIndex }}
      onClick={onClick}
    >
      <div className="page-cloud__body">
        <SvgCloud uid={uid} width={220} height={130} />
        <div className="page-cloud__label">{label}</div>
        <div className="page-cloud__shadow" />
      </div>
    </div>
  );
}
