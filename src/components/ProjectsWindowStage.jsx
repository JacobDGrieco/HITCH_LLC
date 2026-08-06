import { Html, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { getProjectLane } from '../lib/projectWindowLanes';

const GLASS_SHELL_CANVAS = { width: 1024, height: 660 };
const GLASS_SHELL_VIEWPORT = { x: 68, y: 82, width: 888, height: 504, radius: 28 };
const LANE_CLOUDS = {
	left: '/assets/throne2.webp',
	middle: '/assets/throne1.webp',
	right: '/assets/throne3.webp',
};

// Lane templates are the single source of truth for every repeated row.
// Edit each lane's window, backCloud, and foregroundCloud independently here.
const LANE_LAYOUT_CONTROLS = {
	left: {
		window: {
			position: [0.24, -0.07, 0.02],
			rotation: [0.02, 0.15, -0.03],
			scale: [1.08, 1.08, 1.08],
			size: [2.18, 1.41],
		},
		backCloud: {
			position: [0.18, -0.06, -0.36],
			rotation: [0.02, 0.15, -0.03],
			scale: [3.52, 2.36, 1],
		},
		foregroundCloud: {
			position: [0.18, -0.06, -0.36],
			rotation: [0.02, 0.15, -0.03],
			scale: [3.52, 2.36, 1],
		},
	},
	middle: {
		window: {
			position: [0.07, -0.07, 0.02],
			rotation: [0, 0, 0],
			scale: [1.1, 1.1, 1.1],
			size: [2.18, 1.41],
		},
		backCloud: {
			position: [0.02, -0.04, -0.38],
			rotation: [0, 0, 0],
			scale: [3.56, 2.38, 1],
		},
		foregroundCloud: {
			position: [0.02, -0.04, -0.38],
			rotation: [0, 0, 0],
			scale: [3.56, 2.38, 1],
		},
	},
	right: {
		window: {
			position: [-0.24, -0.06, 0.02],
			rotation: [0.02, -0.15, 0.03],
			scale: [1.08, 1.08, 1.08],
			size: [2.18, 1.41],
		},
		backCloud: {
			position: [-0.16, -0.05, -0.36],
			rotation: [0.02, -0.15, 0.03],
			scale: [3.52, 2.36, 1],
		},
		foregroundCloud: {
			position: [-0.16, -0.05, -0.36],
			rotation: [0.02, -0.15, 0.03],
			scale: [3.52, 2.36, 1],
		},
	},
};

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

function getGlassViewportSize(width, height) {
	return [
		width * (GLASS_SHELL_VIEWPORT.width / GLASS_SHELL_CANVAS.width),
		height * (GLASS_SHELL_VIEWPORT.height / GLASS_SHELL_CANVAS.height),
	];
}

function getGlassViewportCenterX(width) {
	const canvasCenterX = GLASS_SHELL_CANVAS.width / 2;
	const viewportCenterX = GLASS_SHELL_VIEWPORT.x + GLASS_SHELL_VIEWPORT.width / 2;

	return ((viewportCenterX - canvasCenterX) / GLASS_SHELL_CANVAS.width) * width;
}

function getGlassViewportCenterY(height) {
	const canvasCenterY = GLASS_SHELL_CANVAS.height / 2;
	const viewportCenterY = GLASS_SHELL_VIEWPORT.y + GLASS_SHELL_VIEWPORT.height / 2;

	return ((canvasCenterY - viewportCenterY) / GLASS_SHELL_CANVAS.height) * height;
}

function createGlassShellTexture() {
	const canvas = document.createElement('canvas');
	canvas.width = GLASS_SHELL_CANVAS.width;
	canvas.height = GLASS_SHELL_CANVAS.height;

	const context = canvas.getContext('2d');
	const outer = { x: 28, y: 24, width: 968, height: 612, radius: 64 };
	const viewport = GLASS_SHELL_VIEWPORT;

	context.clearRect(0, 0, canvas.width, canvas.height);
	traceRoundedRect(context, outer.x, outer.y, outer.width, outer.height, outer.radius);

	const shellGradient = context.createLinearGradient(outer.x, outer.y, outer.x + outer.width, outer.y + outer.height);
	shellGradient.addColorStop(0, 'rgba(255, 209, 217, 0.97)');
	shellGradient.addColorStop(0.2, 'rgba(197, 143, 179, 0.95)');
	shellGradient.addColorStop(0.58, 'rgba(83, 72, 120, 0.97)');
	shellGradient.addColorStop(1, 'rgba(27, 38, 75, 0.99)');
	context.fillStyle = shellGradient;
	context.fill();

	context.save();
	traceRoundedRect(context, outer.x, outer.y, outer.width, outer.height, outer.radius);
	context.clip();

	const chromeGradient = context.createLinearGradient(0, outer.y, 0, viewport.y + 24);
	chromeGradient.addColorStop(0, 'rgba(255, 229, 226, 0.9)');
	chromeGradient.addColorStop(0.5, 'rgba(219, 159, 190, 0.84)');
	chromeGradient.addColorStop(1, 'rgba(105, 88, 140, 0.94)');
	context.fillStyle = chromeGradient;
	context.fillRect(outer.x, outer.y, outer.width, viewport.y - outer.y + 28);

	const reflectionGradient = context.createLinearGradient(90, 14, 830, 365);
	reflectionGradient.addColorStop(0, 'rgba(255, 248, 236, 0.50)');
	reflectionGradient.addColorStop(0.26, 'rgba(255, 220, 221, 0.18)');
	reflectionGradient.addColorStop(0.52, 'rgba(255, 220, 221, 0)');
	context.fillStyle = reflectionGradient;
	context.fillRect(outer.x, outer.y, outer.width, outer.height);
	context.restore();

	traceRoundedRect(context, viewport.x, viewport.y, viewport.width, viewport.height, viewport.radius);
	const viewportGradient = context.createLinearGradient(viewport.x, viewport.y, viewport.x, viewport.y + viewport.height);
	viewportGradient.addColorStop(0, 'rgba(17, 21, 44, 0.99)');
	viewportGradient.addColorStop(1, 'rgba(8, 12, 29, 0.995)');
	context.fillStyle = viewportGradient;
	context.fill();
	context.strokeStyle = 'rgba(255, 214, 222, 0.52)';
	context.lineWidth = 3;
	context.stroke();

	[
		['rgba(255, 111, 100, 0.92)', 82],
		['rgba(255, 181, 83, 0.92)', 112],
		['rgba(255, 225, 181, 0.92)', 142],
	].forEach(([color, x]) => {
		context.beginPath();
		context.arc(x, 54, 13, 0, Math.PI * 2);
		context.fillStyle = color;
		context.shadowColor = color;
		context.shadowBlur = 18;
		context.fill();
	});
	context.shadowBlur = 0;

	traceRoundedRect(context, outer.x + 6, outer.y + 6, outer.width - 12, outer.height - 12, outer.radius - 6);
	context.strokeStyle = 'rgba(255, 242, 237, 0.78)';
	context.lineWidth = 5;
	context.stroke();

	context.beginPath();
	context.moveTo(outer.x + outer.radius, outer.y + 10);
	context.lineTo(outer.x + outer.width - outer.radius, outer.y + 10);
	context.strokeStyle = 'rgba(255, 226, 202, 0.98)';
	context.lineWidth = 6;
	context.shadowColor = 'rgba(255, 184, 181, 0.78)';
	context.shadowBlur = 18;
	context.stroke();
	context.shadowBlur = 0;

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
	context.strokeStyle = 'rgba(255, 214, 222, 0.64)';
	context.lineWidth = 5;
	context.stroke();

	traceRoundedRect(context, outer.x + 6, outer.y + 6, outer.width - 12, outer.height - 12, outer.radius - 6);
	context.strokeStyle = 'rgba(255, 242, 237, 0.82)';
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

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 4;
	texture.needsUpdate = true;

	return texture;
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
			const bottom = THREE.MathUtils.smoothstep(normalizedY, 0.47, 0.72);
			const sideHeight = THREE.MathUtils.smoothstep(normalizedY, 0.30, 0.70);
			const left = 1 - THREE.MathUtils.smoothstep(normalizedX, 0.09, 0.29);
			const right = THREE.MathUtils.smoothstep(normalizedX, 0.71, 0.91);
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

function loadCanvasImage(src) {
	return new Promise((resolve, reject) => {
		if (!src) {
			resolve(null);
			return;
		}

		const image = new Image();
		image.crossOrigin = 'anonymous';
		image.onload = () => resolve(image);
		image.onerror = reject;
		image.src = src;
	});
}

function wrapCanvasText(context, text, maxWidth) {
	const normalizedText = String(text ?? '').replace(/\s*\|\s*/g, '\n').trim();
	const sourceLines = normalizedText ? normalizedText.split(/\n+/) : [];
	const wrappedLines = [];

	sourceLines.forEach((sourceLine) => {
		const words = sourceLine.split(/\s+/).filter(Boolean);
		let line = '';

		words.forEach((word) => {
			const testLine = line ? `${line} ${word}` : word;

			if (context.measureText(testLine).width > maxWidth && line) {
				wrappedLines.push(line);
				line = word;
				return;
			}

			line = testLine;
		});

		if (line) wrappedLines.push(line);
	});

	return wrappedLines;
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines) {
	const lines = wrapCanvasText(context, text, maxWidth).slice(0, maxLines);

	lines.forEach((line, index) => {
		context.fillText(index === maxLines - 1 && wrapCanvasText(context, text, maxWidth).length > maxLines ? `${line.replace(/[,. ]+$/, '')}...` : line, x, y + index * lineHeight);
	});

	return y + lines.length * lineHeight;
}

function drawProjectIcon(context, project, iconImage) {
	const box = { x: 74, y: 126, size: 158 };

	context.save();
	context.shadowColor = 'rgba(255, 207, 166, 0.34)';
	context.shadowBlur = 24;

	if (iconImage) {
		const imageSize = Math.min(iconImage.naturalWidth || iconImage.width, iconImage.naturalHeight || iconImage.height);
		const sourceX = ((iconImage.naturalWidth || iconImage.width) - imageSize) / 2;
		const sourceY = ((iconImage.naturalHeight || iconImage.height) - imageSize) / 2;

		context.drawImage(iconImage, sourceX, sourceY, imageSize, imageSize, box.x, box.y, box.size, box.size);
	} else {
		context.fillStyle = 'rgba(255, 210, 181, 0.94)';
		context.font = '700 82px Georgia, serif';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText(String(project.title ?? '?').trim().slice(0, 2).toUpperCase(), box.x + box.size / 2, box.y + box.size / 2);
	}

	context.restore();
}

function drawPill(context, text, x, y, paddingX = 18) {
	context.font = '700 20px Segoe UI, sans-serif';
	const width = Math.ceil(context.measureText(text).width + paddingX * 2);
	const height = 42;

	traceRoundedRect(context, x, y, width, height, 21);
	context.fillStyle = 'rgba(45, 39, 91, 0.66)';
	context.fill();
	context.strokeStyle = 'rgba(255, 188, 143, 0.42)';
	context.lineWidth = 2;
	context.stroke();
	context.fillStyle = 'rgba(255, 226, 205, 0.92)';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillText(text, x + width / 2, y + height / 2 + 1);

	return width;
}

function drawTopTags(context, tags) {
	const visibleTags = Array.isArray(tags) ? tags.slice(0, 4) : [];
	const maxRight = GLASS_SHELL_VIEWPORT.width - 126;
	let tagX = 54;
	let tagY = 36;

	visibleTags.forEach((tag) => {
		context.font = '700 20px Segoe UI, sans-serif';
		const tagText = String(tag);
		const pillWidth = Math.ceil(context.measureText(tagText).width + 32);

		if (tagX + pillWidth > maxRight && tagX > 54) {
			tagX = 54;
			tagY += 48;
		}

		if (tagY > 84) return;
		tagX += drawPill(context, tagText, tagX, tagY, 16) + 14;
	});
}

function drawOpenProjectIcon(context, hasLink) {
	const icon = { x: GLASS_SHELL_VIEWPORT.width - 108, y: 34, size: 52 };

	traceRoundedRect(context, icon.x, icon.y, icon.size, icon.size, 18);
	context.fillStyle = hasLink ? 'rgba(255, 158, 104, 0.13)' : 'rgba(45, 39, 91, 0.44)';
	context.fill();
	context.strokeStyle = hasLink ? 'rgba(255, 190, 152, 0.62)' : 'rgba(255, 214, 222, 0.34)';
	context.lineWidth = 2;
	context.stroke();

	context.strokeStyle = hasLink ? 'rgba(255, 219, 190, 0.94)' : 'rgba(255, 219, 190, 0.42)';
	context.lineWidth = 4;
	context.lineCap = 'round';
	context.lineJoin = 'round';
	context.beginPath();
	context.moveTo(icon.x + 19, icon.y + 33);
	context.lineTo(icon.x + 34, icon.y + 18);
	context.moveTo(icon.x + 24, icon.y + 18);
	context.lineTo(icon.x + 34, icon.y + 18);
	context.lineTo(icon.x + 34, icon.y + 28);
	context.stroke();
}

function createProjectContentTexture(project, iconImage = null) {
	const canvas = document.createElement('canvas');
	canvas.width = GLASS_SHELL_VIEWPORT.width;
	canvas.height = GLASS_SHELL_VIEWPORT.height;

	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);

	const bgGradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
	bgGradient.addColorStop(0, 'rgba(12, 20, 48, 0.99)');
	bgGradient.addColorStop(0.54, 'rgba(17, 21, 47, 0.99)');
	bgGradient.addColorStop(1, 'rgba(46, 33, 78, 0.98)');
	context.fillStyle = bgGradient;
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = 'rgba(255, 179, 128, 0.13)';
	context.beginPath();
	context.arc(760, 76, 190, 0, Math.PI * 2);
	context.fill();

	context.textAlign = 'left';
	context.textBaseline = 'middle';
	drawTopTags(context, project.tags);
	drawOpenProjectIcon(context, Boolean(project.link));

	drawProjectIcon(context, project, iconImage);

	context.fillStyle = 'rgba(255, 218, 203, 0.98)';
	context.font = '700 48px Georgia, serif';
	context.textAlign = 'left';
	context.textBaseline = 'top';
	context.shadowColor = 'rgba(255, 170, 128, 0.28)';
	context.shadowBlur = 18;
	const titleEndY = drawWrappedText(context, project.title, 292, 120, 480, 52, 3);
	context.shadowBlur = 0;

	context.fillStyle = 'rgba(255, 210, 190, 0.9)';
	context.font = '650 29px Segoe UI, sans-serif';
	const descStartY = Math.max(236, titleEndY + 20);
	drawWrappedText(context, project.desc, 292, descStartY, 488, 39, 5);

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 4;
	texture.needsUpdate = true;

	return texture;
}

function useProjectContentTexture(project) {
	const [loadedIcon, setLoadedIcon] = useState(null);
	const iconImage = loadedIcon?.src === project.iconImage ? loadedIcon.image : null;
	const texture = useMemo(() => createProjectContentTexture(project, iconImage), [iconImage, project]);

	useEffect(() => {
		let isActive = true;

		loadCanvasImage(project.iconImage)
			.then((iconImage) => {
				if (!isActive) return;
				setLoadedIcon({ src: project.iconImage, image: iconImage });
			})
			.catch(() => {
				if (!isActive) return;
				setLoadedIcon({ src: project.iconImage, image: null });
			});

		return () => {
			isActive = false;
		};
	}, [project.iconImage]);

	useEffect(() => () => texture?.dispose(), [texture]);

	return texture;
}

function GlassShell({ width, height }) {
	const texture = useMemo(() => createGlassShellTexture(), []);

	useEffect(() => () => texture.dispose(), [texture]);

	return (
		<mesh position={[0, 0, 0.05]} renderOrder={6}>
			<planeGeometry args={[width, height]} />
			<meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
		</mesh>
	);
}

function GlassFrameOverlay({ width, height }) {
	const texture = useMemo(() => createGlassFrameOverlayTexture(), []);

	useEffect(() => () => texture.dispose(), [texture]);

	return (
		<mesh position={[0, 0, 0.16]} renderOrder={10}>
			<planeGeometry args={[width, height]} />
			<meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} depthTest={false} />
		</mesh>
	);
}

function CloudImage({ url, scale, position, rotation, opacity = 1, renderOrder = 1, foreground = false }) {
	const texture = useTexture(url);
	const maskTexture = useMemo(() => (foreground ? createCloudForegroundMaskTexture() : null), [foreground]);

	useEffect(() => () => maskTexture?.dispose(), [maskTexture]);

	return (
		<mesh position={position} rotation={rotation} scale={scale} renderOrder={renderOrder}>
			<planeGeometry args={[1, 1]} />
			<meshBasicMaterial
				map={texture}
				alphaMap={maskTexture}
				transparent
				opacity={opacity}
				toneMapped={false}
				depthWrite={false}
				depthTest={!foreground}
				alphaTest={0.018}
			/>
		</mesh>
	);
}

function ProjectContent({ project, windowSize }) {
	const texture = useProjectContentTexture(project);
	const [width, height] = windowSize;
	const viewportSize = getGlassViewportSize(width, height);
	const contentPosition = [
		getGlassViewportCenterX(width),
		getGlassViewportCenterY(height),
		0.12,
	];

	return (
		<mesh position={contentPosition} renderOrder={8}>
			<planeGeometry args={viewportSize} />
			<meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
		</mesh>
	);
}

function ProjectWindow({ project, layout, onOpenProject }) {
	const [width, height] = layout.window.size;

	return (
		<group
			position={layout.window.position}
			rotation={layout.window.rotation}
			scale={layout.window.scale}
			onClick={(event) => {
				event.stopPropagation();
				if (project.link) onOpenProject(project.link);
			}}
		>
			<GlassShell width={width} height={height} />
			<ProjectContent project={project} windowSize={layout.window.size} />
			<GlassFrameOverlay width={width} height={height} />
			{project.link ? (
				<Html transform center position={[0, 0, 0.28]} zIndexRange={[20, 10]}>
					<a className="projects-window-stage__hit-link" href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`} />
				</Html>
			) : null}
		</group>
	);
}

function ProjectGroup({ project, layout, onOpenProject, reducedMotion, sceneScale }) {
	const groupRef = useRef(null);
	const baseY = 0;

	useFrame(({ clock }) => {
		if (!groupRef.current || reducedMotion) return;

		const time = clock.elapsedTime + layout.floatPhase;
		groupRef.current.position.y = baseY + Math.sin(time * 0.68) * 0.055;
		groupRef.current.rotation.z = Math.sin(time * 0.44) * 0.014;
	});

	return (
		<group ref={groupRef} position={[0, baseY, 0]} userData={{ id: project.id, lane: layout.lane }}>
			<group scale={[sceneScale, sceneScale, sceneScale]}>
				<CloudImage
					url={layout.cloudImage}
					position={layout.backCloud.position}
					rotation={layout.backCloud.rotation}
					scale={layout.backCloud.scale}
					opacity={0.98}
					renderOrder={1}
				/>
				<ProjectWindow project={project} layout={layout} onOpenProject={onOpenProject} />
				<CloudImage
					url={layout.cloudImage}
					position={layout.foregroundCloud.position}
					rotation={layout.foregroundCloud.rotation}
					scale={layout.foregroundCloud.scale}
					opacity={0.995}
					renderOrder={12}
					foreground
				/>
			</group>
		</group>
	);
}

function getProjectLayout(project, index, totalProjects) {
	const lane = getProjectLane(index, totalProjects);
	const laneControls = LANE_LAYOUT_CONTROLS[lane];

	return {
		id: project.id,
		lane,
		cloudImage: LANE_CLOUDS[lane],
		window: {
			position: laneControls.window.position,
			rotation: laneControls.window.rotation,
			scale: laneControls.window.scale,
			size: laneControls.window.size,
		},
		backCloud: {
			position: laneControls.backCloud.position,
			rotation: laneControls.backCloud.rotation,
			scale: laneControls.backCloud.scale,
		},
		foregroundCloud: {
			position: laneControls.foregroundCloud.position,
			rotation: laneControls.foregroundCloud.rotation,
			scale: laneControls.foregroundCloud.scale,
		},
		floatPhase: index * 1.37 + (lane === 'middle' ? 0.4 : 0),
	};
}

function ProjectCardScene({ project, layout, reducedMotion, sceneScale, onOpenProject }) {
	return (
		<>
			<ambientLight intensity={1.2} />
			<pointLight position={[0, -2.6, 4.6]} intensity={4.4} color="#ffd09c" />
			<pointLight position={[3.2, 2.2, 4]} intensity={1.9} color="#ffc0d4" />
			<pointLight position={[-3.2, 1.4, 3.6]} intensity={1.2} color="#b8c8ff" />
			<ProjectGroup
				project={project}
				layout={layout}
				reducedMotion={reducedMotion}
				sceneScale={sceneScale}
				onOpenProject={onOpenProject}
			/>
		</>
	);
}

function chunkProjects(projects) {
	const rows = [];

	for (let index = 0; index < projects.length; index += 3) {
		rows.push(projects.slice(index, index + 3));
	}

	return rows;
}

function ProjectWindowCard({ project, index, totalProjects, reducedMotion, sceneScale, onOpenProject }) {
	const layout = useMemo(() => getProjectLayout(project, index, totalProjects), [index, project, totalProjects]);

	return (
		<div className={`projects-window-stage__card projects-window-stage__card--${layout.lane}`}>
			<Canvas
				dpr={[1, 1.75]}
				camera={{ fov: 34, position: [0, 0, 4.5], near: 0.1, far: 30 }}
				gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
			>
				<Suspense fallback={null}>
					<ProjectCardScene project={project} layout={layout} reducedMotion={reducedMotion} sceneScale={sceneScale} onOpenProject={onOpenProject} />
				</Suspense>
			</Canvas>
		</div>
	);
}

export default function ProjectsWindowStage({ projects, reducedMotion = false, sceneScale = 1, onOpenProject }) {
	const rows = useMemo(() => chunkProjects(projects), [projects]);

	return (
		<div className="projects-window-stage">
			{rows.map((rowProjects, rowIndex) => (
				<div key={`projects-row-${rowIndex}`} className="projects-window-stage__row">
					{rowProjects.map((project, itemIndex) => {
						const projectIndex = rowIndex * 3 + itemIndex;

						return (
							<ProjectWindowCard
								key={project.id}
								project={project}
								index={projectIndex}
								totalProjects={projects.length}
								reducedMotion={reducedMotion}
								sceneScale={sceneScale}
								onOpenProject={onOpenProject}
							/>
						);
					})}
				</div>
			))}
		</div>
	);
}
