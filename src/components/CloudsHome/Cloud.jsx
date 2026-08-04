export default function Cloud({ label, onClick, imageSrc, imageWidth, imageHeight, scale, floatIndex, buttonRef }) {
	return (
		<button
			ref={buttonRef}
			type="button"
			className="page-cloud"
			style={{
				'--float-index': floatIndex,
				'--page-cloud-scale': scale,
				'--page-cloud-hover-scale': scale * 1.07,
				width: `${imageWidth * scale}px`,
				height: `${imageHeight * scale}px`,
			}}
			onClick={onClick}
			aria-label={`Open ${label}`}
		>
			<span className="page-cloud__body">
				<img src={imageSrc} alt="" className="page-cloud__image" />
				<span className="page-cloud__label">{label}</span>
				<span className="page-cloud__shadow" />
			</span>
		</button>
	);
}
