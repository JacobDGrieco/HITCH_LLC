import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TEX_W = 512;
const TEX_H = 320;
const TEX_ASPECT = TEX_W / TEX_H; // ~1.6

function buildCloudTexture() {
	const canvas = document.createElement('canvas');
	canvas.width = TEX_W;
	canvas.height = TEX_H;
	const ctx = canvas.getContext('2d');

	const puff = (x, y, rx, ry) => {
		const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
		g.addColorStop(0,   'rgba(255, 248, 252, 0.97)');
		g.addColorStop(0.35,'rgba(252, 232, 244, 0.82)');
		g.addColorStop(0.65,'rgba(245, 215, 234, 0.48)');
		g.addColorStop(1,   'rgba(235, 198, 222, 0.00)');
		ctx.fillStyle = g;
		ctx.beginPath();
		ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
		ctx.fill();
	};

	const cx = TEX_W / 2;
	const cy = TEX_H * 0.68;
	puff(cx,      cy + 18, 100, 44);
	puff(cx - 60, cy - 2,   62, 52);
	puff(cx + 60, cy - 2,   62, 52);
	puff(cx - 38, cy - 34,  55, 48);
	puff(cx + 38, cy - 34,  55, 48);
	puff(cx,      cy - 50,  58, 48);
	puff(cx - 20, cy - 72,  42, 36);
	puff(cx + 20, cy - 72,  42, 36);

	const hl = ctx.createRadialGradient(cx * 0.7, cy - 62, 0, cx * 0.7, cy - 62, 82);
	hl.addColorStop(0, 'rgba(255,255,255,0.52)');
	hl.addColorStop(1, 'rgba(255,255,255,0.00)');
	ctx.fillStyle = hl;
	ctx.fillRect(0, 0, TEX_W, TEX_H);

	return new THREE.CanvasTexture(canvas);
}

// [bg → near] — more layers = more depth
const LAYERS = [
	{ n: 6, yMin: -0.10, yMax: 0.45, hMin: 0.38, hMax: 0.55, spd: 0.028, px: 0.30, py: 0.12, alpha: 0.46 },
	{ n: 5, yMin:  0.05, yMax: 0.60, hMin: 0.24, hMax: 0.36, spd: 0.046, px: 0.60, py: 0.22, alpha: 0.60 },
	{ n: 4, yMin:  0.22, yMax: 0.76, hMin: 0.14, hMax: 0.24, spd: 0.066, px: 0.80, py: 0.32, alpha: 0.72 },
];

const PLAX_STRENGTH = 0.058;

export default function SkyScene() {
	const mountRef = useRef(null);

	useEffect(() => {
		const mount = mountRef.current;
		if (!mount) return;

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const mobile  = window.innerWidth <= 640;

		let W = window.innerWidth;
		let H = window.innerHeight;
		let asp = W / H;

		// ─── Renderer ────────────────────────────────────────────────
		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		renderer.setSize(W, H);
		renderer.setClearColor(0x000000, 0);
		mount.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(-asp, asp, 1, -1, 0, 10);
		camera.position.z = 5;

		// ─── Cloud texture ─────────────────────────────────────────
		const texture = buildCloudTexture();

		// ─── Cloud layers ──────────────────────────────────────────
		const layerData = LAYERS.map((cfg) => {
			const group = new THREE.Group();
			scene.add(group);

			const count = mobile ? Math.max(2, cfg.n - 2) : cfg.n;

			const meshes = Array.from({ length: count }, () => {
				const h = cfg.hMin + Math.random() * (cfg.hMax - cfg.hMin);
				const w = h * TEX_ASPECT;
				const geo = new THREE.PlaneGeometry(w, h);
				const mat = new THREE.MeshBasicMaterial({
					map: texture,
					transparent: true,
					opacity: cfg.alpha * (0.75 + Math.random() * 0.25),
					depthWrite: false,
				});
				const mesh = new THREE.Mesh(geo, mat);
				const x = (Math.random() * 2 - 1) * asp * 1.4;
				const y = cfg.yMin + Math.random() * (cfg.yMax - cfg.yMin);
				mesh.position.set(x, y, 0);
				mesh.userData.baseX = x;
				mesh.userData.spd   = cfg.spd * (0.7 + Math.random() * 0.6);
				mesh.userData.hw    = w / 2;
				group.add(mesh);
				return mesh;
			});

			return { group, meshes, cfg };
		});

		// ─── Mouse parallax ────────────────────────────────────────
		let mx = 0, my = 0, tx = 0, ty = 0;
		const onMouse = (e) => {
			tx = (e.clientX / W) * 2 - 1;
			ty = (e.clientY / H) * 2 - 1;
		};
		if (!reduced) window.addEventListener('mousemove', onMouse);

		// ─── Resize ────────────────────────────────────────────────
		const onResize = () => {
			W = window.innerWidth;
			H = window.innerHeight;
			asp = W / H;
			renderer.setSize(W, H);
			camera.left  = -asp;
			camera.right =  asp;
			camera.updateProjectionMatrix();
		};
		window.addEventListener('resize', onResize);

		// ─── Animation loop ────────────────────────────────────────
		let raf;
		let last = performance.now();

		const animate = (now) => {
			raf = requestAnimationFrame(animate);
			const dt = Math.min((now - last) / 1000, 0.05);
			last = now;

			if (!reduced) {
				mx += (tx - mx) * 0.04;
				my += (ty - my) * 0.04;
			}

			layerData.forEach(({ group, meshes, cfg }) => {
				if (!reduced) {
					group.position.x =  mx * PLAX_STRENGTH * cfg.px;
					group.position.y = -my * PLAX_STRENGTH * cfg.py;
				}

				meshes.forEach((m) => {
					m.userData.baseX += m.userData.spd * dt;
					// wrap when fully off right edge
					if (m.userData.baseX - m.userData.hw > asp * 1.4) {
						m.userData.baseX = -asp * 1.4 - m.userData.hw;
					}
					m.position.x = m.userData.baseX;
				});
			});

			renderer.render(scene, camera);
		};
		animate(performance.now());

		// ─── Cleanup ───────────────────────────────────────────────
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('mousemove', onMouse);
			window.removeEventListener('resize', onResize);
			texture.dispose();
			layerData.forEach(({ meshes }) => {
				meshes.forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
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
