import { Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

const CLOUD_FRAME_TEXTURE = '/about/contact-cloud-frame.png';

// Transform arrays are [x, y, z]. Rotation values are radians.
const CONTACT_FORM_SCENE = {
	group: {
		position: [-0.46, -0.18, 0],
		rotation: [0.0, -0.4, 0],
		scale: 0.28,
	},
	// Pixel-space controls inside the shared Three object.
	frame: {
		position: [-14, -2, 0],
		rotation: [0, 0, 0],
		scale: [1.18, 0.99],
		size: [760, 850],
	},
	panel: {
		position: [0, 0, 0],
		rotation: [0, 0, 0],
		scale: 1,
		size: [450, 570],
	},
};

function ContactPanelHtml({ children }) {
	const [frameWidth, frameHeight] = CONTACT_FORM_SCENE.frame.size;
	const [frameX, frameY, frameZ] = CONTACT_FORM_SCENE.frame.position;
	const [frameRotationX, frameRotationY, frameRotationZ] = CONTACT_FORM_SCENE.frame.rotation;
	const [frameScaleX, frameScaleY] = CONTACT_FORM_SCENE.frame.scale;
	const [panelWidth, panelHeight] = CONTACT_FORM_SCENE.panel.size;
	const [panelX, panelY, panelZ] = CONTACT_FORM_SCENE.panel.position;
	const [panelRotationX, panelRotationY, panelRotationZ] = CONTACT_FORM_SCENE.panel.rotation;

	return (
		<Html
			transform
			center
			position={CONTACT_FORM_SCENE.group.position}
			rotation={CONTACT_FORM_SCENE.group.rotation}
			scale={CONTACT_FORM_SCENE.group.scale}
			zIndexRange={[20, 10]}
		>
			<div
				className="contact-page__message-shell"
				style={{
					'--contact-cloud-frame-width': `${frameWidth}px`,
					'--contact-cloud-frame-height': `${frameHeight}px`,
					'--contact-cloud-frame-x': `${frameX}px`,
					'--contact-cloud-frame-y': `${frameY}px`,
					'--contact-cloud-frame-z': `${frameZ}px`,
					'--contact-cloud-frame-rotation-x': `${frameRotationX}rad`,
					'--contact-cloud-frame-rotation-y': `${frameRotationY}rad`,
					'--contact-cloud-frame-rotation-z': `${frameRotationZ}rad`,
					'--contact-cloud-frame-scale-x': frameScaleX,
					'--contact-cloud-frame-scale-y': frameScaleY,
					'--contact-panel-width': `${panelWidth}px`,
					'--contact-panel-height': `${panelHeight}px`,
					'--contact-panel-x': `${panelX}px`,
					'--contact-panel-y': `${panelY}px`,
					'--contact-panel-z': `${panelZ}px`,
					'--contact-panel-rotation-x': `${panelRotationX}rad`,
					'--contact-panel-rotation-y': `${panelRotationY}rad`,
					'--contact-panel-rotation-z': `${panelRotationZ}rad`,
					'--contact-panel-scale': CONTACT_FORM_SCENE.panel.scale,
				}}
			>
				<img src={CLOUD_FRAME_TEXTURE} alt="" width="1218" height="1292" className="contact-page__message-cloud-frame" />
				<div className="contact-page__message-paper">
					{children}
				</div>
			</div>
		</Html>
	);
}

function ContactFormScene({ children }) {
	return (
		<>
			<ambientLight intensity={1.15} />
			<pointLight position={[1.6, 2.4, 5]} intensity={3.8} color="#ffd2a2" />
			<pointLight position={[-2.2, -1.8, 4]} intensity={1.6} color="#ff9a9f" />
			<ContactPanelHtml>{children}</ContactPanelHtml>
		</>
	);
}

export default function AboutContactFormStage({ children }) {
	return (
		<div className="contact-page__three-stage">
			<Canvas
				dpr={[1, 1.75]}
				camera={{ fov: 32, position: [0, 0, 8.2], near: 0.1, far: 30 }}
				gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
			>
				<Suspense fallback={null}>
					<ContactFormScene>{children}</ContactFormScene>
				</Suspense>
			</Canvas>
		</div>
	);
}
