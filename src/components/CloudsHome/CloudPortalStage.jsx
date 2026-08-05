import { Text, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const GLASS_SHELL_CANVAS = { width: 1024, height: 660 };
const GLASS_SHELL_VIEWPORT = { x: 68, y: 82, width: 888, height: 504, radius: 28 };
const DEFAULT_PREVIEW_TRANSFORM = { position: [0, 0], scale: 1 };

// Transform arrays are [x, y, z]. Rotation values are radians.
const PORTAL_LAYOUT = [
	{
		id: 'asd',
		title: 'A.S.D.',
		liveUrl: 'https://www.asdrecords.net/',
		previewImage: '/home/windows/asd.png',
		cloudImage: '/home/3d/v2/portal-asd-back-v2.png',
		position: [1.8, 1.40, -1.34],
		window: {
			position: [0, -0.12, 0],
			rotation: [0.03, -0.16, 0.018],
			scale: [1, 1.05, 1],
			size: [2.36, 1.52],
			preview: {
				position: [0, 0],
				scale: 1,
			},
		},
		backCloud: {
			position: [0.06691, 0.01244, -0.41445],
			rotation: [0.03, -0.16, 0.018],
			scale: [3.32, 2.26, 1],
		},
		foregroundCloud: {
			position: [0.06691, 0.01244, -0.41445],
			rotation: [0.03, -0.16, 0.018],
			scale: [3.32, 2.26, 1],
		},
		floatPhase: 0.1,
	},
	{
		id: 'halomed',
		title: 'HaloMed',
		liveUrl: 'https://www.halomed.org/',
		previewImage: '/home/windows/halomed.png',
		cloudImage: '/home/3d/v2/portal-halomed-back-v2.png',
		position: [-0.10, -1.24, 0.20],
		window: {
			position: [-0.03, -0.01, 0],
			rotation: [-0.2, 0.3, 0.01],
			scale: [1, 1.05, 1],
			size: [1.90, 1.16],
			preview: {
				position: [0, 0],
				scale: 1,
			},
		},
		backCloud: {
			position: [-0.12412, -0.07971, -0.39324],
			rotation: [-0.2, 0.3, 0.01],
			scale: [2.78, 1.80, 1],
		},
		foregroundCloud: {
			position: [-0.12412, -0.07971, -0.39324],
			rotation: [-0.2, 0.3, 0.01],
			scale: [2.78, 1.80, 1],
		},
		floatPhase: 2.9,
	},
	{
		id: 'relatime',
		title: 'RelaTime',
		liveUrl: 'https://www.relatime.org/',
		previewImage: '/home/windows/relatime.png',
		cloudImage: '/home/3d/v2/portal-relatime-back-v2.png',
		position: [3.3, -1.25, -0.36],
		window: {
			position: [0.02, 0.09, 0.02],
			rotation: [-0.25, -0.70, -0.088],
			scale: [1, 1, 1],
			size: [1.94, 1.68],
			preview: {
				position: [0, 0],
				scale: 1,
			},
		},
		backCloud: {
			position: [0.26735, -0.08014, -0.31385],
			rotation: [-0.25, -0.58, -0.084],
			scale: [2.80, 1.83, 1],
		},
		foregroundCloud: {
			position: [0.26735, -0.08014, -0.31385],
			rotation: [-0.25, -0.58, -0.084],
			scale: [2.80, 1.83, 1],
		},
		floatPhase: 4.1,
	},
];

function getGlassViewportSize(width, height) {
	return [
		width * (GLASS_SHELL_VIEWPORT.width / GLASS_SHELL_CANVAS.width),
		height * (GLASS_SHELL_VIEWPORT.height / GLASS_SHELL_CANVAS.height),
	];
}

function getGlassViewportCenterY(height) {
	const canvasCenterY = GLASS_SHELL_CANVAS.height / 2;
	const viewportCenterY = GLASS_SHELL_VIEWPORT.y + GLASS_SHELL_VIEWPORT.height / 2;

	return ((canvasCenterY - viewportCenterY) / GLASS_SHELL_CANVAS.height) * height;
}

function getGlassViewportCenterX(width) {
	const canvasCenterX = GLASS_SHELL_CANVAS.width / 2;
	const viewportCenterX = GLASS_SHELL_VIEWPORT.x + GLASS_SHELL_VIEWPORT.width / 2;

	return ((viewportCenterX - canvasCenterX) / GLASS_SHELL_CANVAS.width) * width;
}

function getContainedSize(sourceWidth, sourceHeight, maxWidth, maxHeight) {
	const sourceAspect = sourceWidth / sourceHeight;
	const boundsAspect = maxWidth / maxHeight;

	if (sourceAspect > boundsAspect) {
		return [maxWidth, maxWidth / sourceAspect];
	}

	return [maxHeight * sourceAspect, maxHeight];
}

function traceRoundedRect(context, x, y, width, height, radius) {
	const boundedRadius = Math.min(radius, width / 2, height / 2);

	context.beginPath();
	context.moveTo(x + boundedRadius, y);
	context.lineTo(x + width - boundedRadius, y);
	context.quadraticCurveTo(x + width, y, x + width, y + boundedRadius);
	context.lineTo(x + width, y + height - boundedRadius);
	context.quadraticCurveTo(x + width, y + height, x + width - boundedRadius, y + height);
	context.lineTo(x + boundedRadius, y + height);
	context.quadraticCurveTo(x, y + height, x, y + height - boundedRadius);
	context.lineTo(x, y + boundedRadius);
	context.quadraticCurveTo(x, y, x + boundedRadius, y);
	context.closePath();
}

function createContainedPreviewTexture(sourceImage, viewportSize, previewTransform) {
	const canvas = document.createElement('canvas');
	canvas.width = GLASS_SHELL_VIEWPORT.width;
	canvas.height = GLASS_SHELL_VIEWPORT.height;

	const context = canvas.getContext('2d');
	const [viewportWidth, viewportHeight] = viewportSize;
	const [previewX, previewY] = previewTransform.position;
	const previewScale = previewTransform.scale;
	const imageWidth = sourceImage.naturalWidth || sourceImage.width || 1;
	const imageHeight = sourceImage.naturalHeight || sourceImage.height || 1;
	const [containedWidth, containedHeight] = getContainedSize(imageWidth, imageHeight, canvas.width, canvas.height);
	const drawWidth = containedWidth * previewScale;
	const drawHeight = containedHeight * previewScale;
	const drawX = (canvas.width - drawWidth) / 2 + (previewX / viewportWidth) * canvas.width;
	const drawY = (canvas.height - drawHeight) / 2 - (previewY / viewportHeight) * canvas.height;

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.save();
	traceRoundedRect(context, 0, 0, canvas.width, canvas.height, GLASS_SHELL_VIEWPORT.radius);
	context.clip();
	context.drawImage(sourceImage, drawX, drawY, drawWidth, drawHeight);
	context.restore();

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 4;
	texture.needsUpdate = true;

	return texture;
}

/** Builds one integrated browser shell so its body, chrome, viewport, and reflections read as a single material. */
function createGlassShellTexture() {
	const canvas = document.createElement('canvas');
	canvas.width = 1024;
	canvas.height = 660;

	const context = canvas.getContext('2d');
	const outer = { x: 28, y: 24, width: 968, height: 612, radius: 64 };
	const viewport = { x: 68, y: 82, width: 888, height: 504, radius: 28 };

	context.clearRect(0, 0, canvas.width, canvas.height);

	traceRoundedRect(context, outer.x, outer.y, outer.width, outer.height, outer.radius);
	const shellGradient = context.createLinearGradient(outer.x, outer.y, outer.x + outer.width, outer.y + outer.height);
	shellGradient.addColorStop(0, 'rgba(245, 190, 211, 0.97)');
	shellGradient.addColorStop(0.2, 'rgba(181, 139, 174, 0.96)');
	shellGradient.addColorStop(0.55, 'rgba(91, 82, 122, 0.97)');
	shellGradient.addColorStop(1, 'rgba(38, 46, 80, 0.99)');
	context.fillStyle = shellGradient;
	context.fill();

	context.save();
	traceRoundedRect(context, outer.x, outer.y, outer.width, outer.height, outer.radius);
	context.clip();

	const chromeGradient = context.createLinearGradient(0, outer.y, 0, viewport.y + 18);
	chromeGradient.addColorStop(0, 'rgba(255, 221, 228, 0.88)');
	chromeGradient.addColorStop(0.48, 'rgba(204, 161, 190, 0.84)');
	chromeGradient.addColorStop(1, 'rgba(116, 99, 142, 0.94)');
	context.fillStyle = chromeGradient;
	context.fillRect(outer.x, outer.y, outer.width, viewport.y - outer.y + 24);

	const reflectionGradient = context.createLinearGradient(100, 20, 780, 360);
	reflectionGradient.addColorStop(0, 'rgba(255, 247, 242, 0.48)');
	reflectionGradient.addColorStop(0.28, 'rgba(255, 225, 232, 0.17)');
	reflectionGradient.addColorStop(0.5, 'rgba(255, 225, 232, 0)');
	context.fillStyle = reflectionGradient;
	context.fillRect(outer.x, outer.y, outer.width, outer.height);
	context.restore();

	traceRoundedRect(context, viewport.x, viewport.y, viewport.width, viewport.height, viewport.radius);
	const viewportGradient = context.createLinearGradient(viewport.x, viewport.y, viewport.x, viewport.y + viewport.height);
	viewportGradient.addColorStop(0, 'rgba(18, 21, 39, 0.99)');
	viewportGradient.addColorStop(1, 'rgba(8, 13, 28, 0.995)');
	context.fillStyle = viewportGradient;
	context.fill();
	context.strokeStyle = 'rgba(255, 214, 222, 0.50)';
	context.lineWidth = 3;
	context.stroke();

	traceRoundedRect(context, outer.x + 6, outer.y + 6, outer.width - 12, outer.height - 12, outer.radius - 6);
	context.strokeStyle = 'rgba(255, 242, 237, 0.76)';
	context.lineWidth = 5;
	context.stroke();

	context.beginPath();
	context.moveTo(outer.x + outer.radius, outer.y + 10);
	context.lineTo(outer.x + outer.width - outer.radius, outer.y + 10);
	context.strokeStyle = 'rgba(255, 228, 207, 0.98)';
	context.lineWidth = 6;
	context.shadowColor = 'rgba(255, 184, 181, 0.78)';
	context.shadowBlur = 18;
	context.stroke();
	context.shadowBlur = 0;

	context.beginPath();
	context.moveTo(outer.x + 13, outer.y + outer.radius);
	context.lineTo(outer.x + 13, outer.y + outer.height * 0.72);
	context.strokeStyle = 'rgba(255, 235, 232, 0.52)';
	context.lineWidth = 4;
	context.stroke();

	context.beginPath();
	context.moveTo(outer.x + outer.width - 13, outer.y + outer.height * 0.34);
	context.lineTo(outer.x + outer.width - 13, outer.y + outer.height - outer.radius);
	context.strokeStyle = 'rgba(255, 180, 181, 0.66)';
	context.lineWidth = 4;
	context.stroke();

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 4;
	texture.needsUpdate = true;

	return texture;
}

function createGlassFrameOverlayTexture() {
	const canvas = document.createElement('canvas');
	canvas.width = GLASS_SHELL_CANVAS.width;
	canvas.height = GLASS_SHELL_CANVAS.height;

	const context = canvas.getContext('2d');
	const outer = { x: 28, y: 24, width: 968, height: 612, radius: 64 };
	const viewport = GLASS_SHELL_VIEWPORT;

	context.clearRect(0, 0, canvas.width, canvas.height);

	context.save();
	traceRoundedRect(context, outer.x, outer.y, outer.width, outer.height, outer.radius);
	context.clip();

	const reflectionGradient = context.createLinearGradient(100, 20, 780, 360);
	reflectionGradient.addColorStop(0, 'rgba(255, 247, 242, 0.44)');
	reflectionGradient.addColorStop(0.25, 'rgba(255, 225, 232, 0.14)');
	reflectionGradient.addColorStop(0.52, 'rgba(255, 225, 232, 0)');
	context.fillStyle = reflectionGradient;
	context.fillRect(outer.x, outer.y, outer.width, outer.height);
	context.restore();

	traceRoundedRect(context, viewport.x, viewport.y, viewport.width, viewport.height, viewport.radius);
	context.strokeStyle = 'rgba(255, 214, 222, 0.62)';
	context.lineWidth = 5;
	context.stroke();

	traceRoundedRect(context, outer.x + 6, outer.y + 6, outer.width - 12, outer.height - 12, outer.radius - 6);
	context.strokeStyle = 'rgba(255, 242, 237, 0.80)';
	context.lineWidth = 5;
	context.stroke();

	context.beginPath();
	context.moveTo(outer.x + outer.radius, outer.y + 10);
	context.lineTo(outer.x + outer.width - outer.radius, outer.y + 10);
	context.strokeStyle = 'rgba(255, 228, 207, 0.98)';
	context.lineWidth = 6;
	context.shadowColor = 'rgba(255, 184, 181, 0.78)';
	context.shadowBlur = 18;
	context.stroke();
	context.shadowBlur = 0;

	context.beginPath();
	context.moveTo(outer.x + 13, outer.y + outer.radius);
	context.lineTo(outer.x + 13, outer.y + outer.height * 0.72);
	context.strokeStyle = 'rgba(255, 235, 232, 0.52)';
	context.lineWidth = 4;
	context.stroke();

	context.beginPath();
	context.moveTo(outer.x + outer.width - 13, outer.y + outer.height * 0.34);
	context.lineTo(outer.x + outer.width - 13, outer.y + outer.height - outer.radius);
	context.strokeStyle = 'rgba(255, 180, 181, 0.66)';
	context.lineWidth = 4;
	context.stroke();

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 4;
	texture.needsUpdate = true;

	return texture;
}

function GlassShell({ width, height }) {
	const texture = useMemo(() => createGlassShellTexture(), []);

	useEffect(() => () => texture.dispose(), [texture]);

	return (
		<mesh position={[0, 0, 0.05]} renderOrder={6}>
			<planeGeometry args={[width, height]} />
			<meshBasicMaterial
				map={texture}
				transparent
				toneMapped={false}
				depthWrite={false}
			/>
		</mesh>
	);
}

function GlassFrameOverlay({ width, height }) {
	const texture = useMemo(() => createGlassFrameOverlayTexture(), []);

	useEffect(() => () => texture.dispose(), [texture]);

	return (
		<mesh position={[0, 0, 0.16]} renderOrder={10}>
			<planeGeometry args={[width, height]} />
			<meshBasicMaterial
				map={texture}
				transparent
				toneMapped={false}
				depthWrite={false}
				depthTest={false}
			/>
		</mesh>
	);
}

function createCloudForegroundMaskTexture() {
	const canvas = document.createElement('canvas');
	canvas.width = 512;
	canvas.height = 512;

	const context = canvas.getContext('2d');
	const image = context.createImageData(canvas.width, canvas.height);

	for (let y = 0; y < canvas.height; y += 1) {
		for (let x = 0; x < canvas.width; x += 1) {
			const normalizedX = x / (canvas.width - 1);
			const normalizedY = y / (canvas.height - 1);
			const bottom = THREE.MathUtils.smoothstep(normalizedY, 0.46, 0.72);
			const sideHeight = THREE.MathUtils.smoothstep(normalizedY, 0.32, 0.70);
			const left = 1 - THREE.MathUtils.smoothstep(normalizedX, 0.12, 0.30);
			const right = THREE.MathUtils.smoothstep(normalizedX, 0.70, 0.88);
			const mask = Math.max(bottom, Math.max(left, right) * sideHeight);
			const channel = Math.round(mask * 255);
			const pixel = (y * canvas.width + x) * 4;

			image.data[pixel] = channel;
			image.data[pixel + 1] = channel;
			image.data[pixel + 2] = channel;
			image.data[pixel + 3] = 255;
		}
	}

	context.putImageData(image, 0, 0);

	const texture = new THREE.CanvasTexture(canvas);
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.generateMipmaps = false;
	texture.needsUpdate = true;

	return texture;
}

function CloudImage({ url, scale, position = [0, 0, 0], rotation = [0, 0, 0], opacity = 1, renderOrder = 1 }) {
	const texture = useTexture(url);

	return (
		<mesh position={position} rotation={rotation} scale={scale} renderOrder={renderOrder}>
			<planeGeometry args={[1, 1]} />
			<meshBasicMaterial
				map={texture}
				transparent
				opacity={opacity}
				toneMapped={false}
				depthWrite={false}
				alphaTest={0.015}
			/>
		</mesh>
	);
}

/** Reuses the back throne texture so every foreground curl lands on the exact same pixels. */
function CloudForeground({ url, position, rotation, scale }) {
	const texture = useTexture(url);
	const maskTexture = useMemo(() => createCloudForegroundMaskTexture(), []);

	useEffect(() => () => maskTexture.dispose(), [maskTexture]);

	return (
		<mesh position={position} rotation={rotation} scale={scale} renderOrder={12}>
			<planeGeometry args={[1, 1]} />
			<meshBasicMaterial
				map={texture}
				alphaMap={maskTexture}
				transparent
				opacity={0.99}
				toneMapped={false}
				depthWrite={false}
				depthTest={false}
				alphaTest={0.02}
			/>
		</mesh>
	);
}

function ProjectPreview({ portal, imagePosition }) {
	const texture = useTexture(portal.previewImage);
	const [width, height] = portal.window.size;
	const previewSize = useMemo(() => getGlassViewportSize(width, height), [height, width]);
	const previewTransform = portal.window.preview ?? DEFAULT_PREVIEW_TRANSFORM;
	const previewTexture = useMemo(
		() => createContainedPreviewTexture(texture.image, previewSize, {
			position: previewTransform.position ?? DEFAULT_PREVIEW_TRANSFORM.position,
			scale: previewTransform.scale ?? DEFAULT_PREVIEW_TRANSFORM.scale,
		}),
		[previewSize, previewTransform.position, previewTransform.scale, texture],
	);

	useEffect(() => () => previewTexture.dispose(), [previewTexture]);

	return (
		<mesh position={[imagePosition[0], imagePosition[1], 0.12]} renderOrder={8}>
			<planeGeometry args={previewSize} />
			<meshBasicMaterial
				map={previewTexture}
				transparent
				toneMapped={false}
				depthWrite={false}
			/>
		</mesh>
	);
}

function ProjectTitle({ portal, viewportCenter, viewportSize }) {
	const [viewportWidth, viewportHeight] = viewportSize;
	const titlePosition = [
		viewportCenter[0] - viewportWidth / 2 + 0.20,
		viewportCenter[1] + viewportHeight / 2 - 0.22,
		0.14,
	];

	return (
		<Text
			position={titlePosition}
			fontSize={0.12}
			anchorX="left"
			anchorY="middle"
			color="#fff2f5"
			outlineColor="#050507"
			outlineWidth={0.012}
			renderOrder={9}
		>
			{portal.title}
		</Text>
	);
}

function GlassPanel({ portal, onOpen }) {
	const [width, height] = portal.window.size;
	const viewportSize = getGlassViewportSize(width, height);
	const contentPosition = [
		getGlassViewportCenterX(width),
		getGlassViewportCenterY(height),
	];

	return (
		<group onClick={onOpen} onPointerOver={(event) => event.stopPropagation()}>
			<GlassShell width={width} height={height} />

			<ProjectPreview portal={portal} imagePosition={contentPosition} />
			<ProjectTitle portal={portal} viewportCenter={contentPosition} viewportSize={viewportSize} />
			<GlassFrameOverlay width={width} height={height} />
		</group>
	);
}

function PortalGroup({ portal, onOpen, reducedMotion }) {
	const groupRef = useRef(null);

	useFrame(({ clock }) => {
		if (!groupRef.current || reducedMotion) return;

		const time = clock.elapsedTime + portal.floatPhase;
		groupRef.current.position.y = portal.position[1] + Math.sin(time * 0.7) * 0.045;
		groupRef.current.rotation.z = Math.sin(time * 0.48) * 0.012;
	});

	return (
		<group
			ref={groupRef}
			position={portal.position}
			userData={{ id: portal.id }}
		>
			<CloudImage
				url={portal.cloudImage}
				position={portal.backCloud.position}
				rotation={portal.backCloud.rotation}
				scale={portal.backCloud.scale}
				opacity={0.98}
				renderOrder={1}
			/>
			<group
				position={portal.window.position}
				rotation={portal.window.rotation}
				scale={portal.window.scale}
			>
				<GlassPanel portal={portal} onOpen={onOpen} />
			</group>
			<CloudForeground
				url={portal.cloudImage}
				position={portal.foregroundCloud.position}
				rotation={portal.foregroundCloud.rotation}
				scale={portal.foregroundCloud.scale}
			/>
		</group>
	);
}

function PortalScene({ onOpenProject, reducedMotion }) {
	return (
		<>
			<ambientLight intensity={1.15} />
			<pointLight position={[1.6, -2.2, 4.6]} intensity={4.4} color="#ffd29d" />
			<pointLight position={[5, 2.2, 3]} intensity={1.8} color="#ffc1d7" />
			<group position={[0.02, 0, 0]}>
				{PORTAL_LAYOUT.map((portal) => (
					<PortalGroup
						key={portal.id}
						portal={portal}
						reducedMotion={reducedMotion}
						onOpen={(event) => {
							event.stopPropagation();
							onOpenProject(portal.liveUrl);
						}}
					/>
				))}
			</group>
		</>
	);
}

export default function CloudPortalStage({ onOpenProject, reducedMotion }) {
	return (
		<div className="cloud-portal-stage" aria-hidden="true">
			<Canvas
				dpr={[1, 1.75]}
				camera={{ fov: 34, position: [0, 0, 8.2], near: 0.1, far: 40 }}
				gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
			>
				<Suspense fallback={null}>
					<PortalScene onOpenProject={onOpenProject} reducedMotion={reducedMotion} />
				</Suspense>
			</Canvas>
		</div>
	);
}
