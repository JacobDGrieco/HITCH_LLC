// Legacy Three.js sky background retained until dead-code cleanup removes the old home-scene path.
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CLOUD_TEXTURES = [
	{ src: '/cloud1.png', aspect: 537 / 187 },
	{ src: '/cloud2.png', aspect: 537 / 187 },
	{ src: '/cloud3.png', aspect: 537 / 187 },
	{ src: '/cloud4.png', aspect: 537 / 187 },
	{ src: '/cloud5.png', aspect: 537 / 187 },
	{ src: '/cloud6.png', aspect: 537 / 187 },
	{ src: '/cloud7.png', aspect: 537 / 187 },
	{ src: '/cloud8.png', aspect: 537 / 187 },
	{ src: '/cloud9.png', aspect: 1536 / 1024 },
];

const LAYERS = [
	{ n: 5, yMin: -0.22, yMax: 0.30, hMin: 0.18, hMax: 0.28, spd: 0.018, px: 0.22, py: 0.10, alpha: 0.18, tint: 0x8faecf },
	{ n: 5, yMin: -0.02, yMax: 0.58, hMin: 0.22, hMax: 0.36, spd: 0.032, px: 0.50, py: 0.20, alpha: 0.28, tint: 0xc8d9ec },
	{ n: 4, yMin: 0.18, yMax: 0.78, hMin: 0.16, hMax: 0.30, spd: 0.052, px: 0.74, py: 0.30, alpha: 0.38, tint: 0xf1eef6 },
];

const PLAX_STRENGTH = 0.058;

export default function SkyScene() {
	const mountRef = useRef(null);

	useEffect(() => {
		const mount = mountRef.current;
		if (!mount) return undefined;

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const mobile = window.innerWidth <= 640;

		let width = window.innerWidth;
		let height = window.innerHeight;
		let aspect = width / height;

		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		renderer.setSize(width, height);
		renderer.setClearColor(0x000000, 0);
		mount.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0, 10);
		camera.position.z = 5;

		const loader = new THREE.TextureLoader();
		const textures = CLOUD_TEXTURES.map((cloud) => {
			const texture = loader.load(cloud.src);
			texture.colorSpace = THREE.SRGBColorSpace;
			return { ...cloud, texture };
		});

		const layerData = LAYERS.map((cfg, layerIndex) => {
			const group = new THREE.Group();
			scene.add(group);

			const count = mobile ? Math.max(2, cfg.n - 2) : cfg.n;
			const meshes = Array.from({ length: count }, (_, cloudIndex) => {
				const textureIndex = (layerIndex * 3 + cloudIndex * 2 + Math.floor(Math.random() * textures.length)) % textures.length;
				const cloud = textures[textureIndex];
				const cloudHeight = cfg.hMin + Math.random() * (cfg.hMax - cfg.hMin);
				const cloudWidth = cloudHeight * cloud.aspect;
				const geometry = new THREE.PlaneGeometry(cloudWidth, cloudHeight);
				const material = new THREE.MeshBasicMaterial({
					map: cloud.texture,
					color: cfg.tint,
					transparent: true,
					opacity: cfg.alpha * (0.75 + Math.random() * 0.25),
					depthWrite: false,
					depthTest: false,
				});
				const mesh = new THREE.Mesh(geometry, material);
				const x = (Math.random() * 2 - 1) * aspect * 1.45;
				const y = cfg.yMin + Math.random() * (cfg.yMax - cfg.yMin);
				mesh.position.set(x, y, 0);
				mesh.userData.baseX = x;
				mesh.userData.speed = cfg.spd * (0.7 + Math.random() * 0.6);
				mesh.userData.halfWidth = cloudWidth / 2;
				group.add(mesh);
				return mesh;
			});

			return { group, meshes, cfg };
		});

		let mouseX = 0;
		let mouseY = 0;
		let targetX = 0;
		let targetY = 0;
		const onMouse = (event) => {
			targetX = (event.clientX / width) * 2 - 1;
			targetY = (event.clientY / height) * 2 - 1;
		};
		if (!reduced) window.addEventListener('mousemove', onMouse);

		const onResize = () => {
			width = window.innerWidth;
			height = window.innerHeight;
			aspect = width / height;
			renderer.setSize(width, height);
			camera.left = -aspect;
			camera.right = aspect;
			camera.updateProjectionMatrix();
		};
		window.addEventListener('resize', onResize);

		let raf;
		let last = performance.now();
		const animate = (now) => {
			raf = requestAnimationFrame(animate);
			const deltaSeconds = Math.min((now - last) / 1000, 0.05);
			last = now;

			if (!reduced) {
				mouseX += (targetX - mouseX) * 0.04;
				mouseY += (targetY - mouseY) * 0.04;
			}

			layerData.forEach(({ group, meshes, cfg }) => {
				if (!reduced) {
					group.position.x = mouseX * PLAX_STRENGTH * cfg.px;
					group.position.y = -mouseY * PLAX_STRENGTH * cfg.py;
				}

				meshes.forEach((mesh) => {
					mesh.userData.baseX += mesh.userData.speed * deltaSeconds;
					if (mesh.userData.baseX - mesh.userData.halfWidth > aspect * 1.45) {
						mesh.userData.baseX = -aspect * 1.45 - mesh.userData.halfWidth;
					}
					mesh.position.x = mesh.userData.baseX;
				});
			});

			renderer.render(scene, camera);
		};
		animate(performance.now());

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('mousemove', onMouse);
			window.removeEventListener('resize', onResize);
			textures.forEach(({ texture }) => texture.dispose());
			layerData.forEach(({ meshes }) => {
				meshes.forEach((mesh) => {
					mesh.geometry.dispose();
					mesh.material.dispose();
				});
			});
			renderer.dispose();
			if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
		};
	}, []);

	return (
		<div
			ref={mountRef}
			style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}
		/>
	);
}
