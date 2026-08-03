import SvgCloud from './SvgCloud';

export default function Cloud({ label, onClick, uid, floatIndex }) {
	return (
		<button
			type="button"
			className="page-cloud"
			style={{ '--float-index': floatIndex }}
			onClick={onClick}
			aria-label={`Open ${label}`}
		>
			<span className="page-cloud__body">
				<SvgCloud uid={uid} width={220} height={130} />
				<span className="page-cloud__label">{label}</span>
				<span className="page-cloud__shadow" />
			</span>
		</button>
	);
}
