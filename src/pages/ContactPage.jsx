import { useRef, useState } from 'react';
import { Send } from 'lucide-react';
import AboutContactFormStage from '../components/AboutContactFormStage';
import '../styles/shared.css';
import '../styles/contact-page.css';

const FALLBACK_ERROR = 'Something went wrong. Try emailing directly.';

function getContactControlPriority(element) {
	if (element.matches('.contact-page__textarea')) {
		return 0;
	}

	if (element.matches('.contact-page__input')) {
		return 1;
	}

	return 2;
}

function solveLinearSystem(matrix, values) {
	const rowCount = values.length;
	const augmentedMatrix = matrix.map((row, index) => [...row, values[index]]);

	for (let pivotIndex = 0; pivotIndex < rowCount; pivotIndex += 1) {
		let bestRowIndex = pivotIndex;

		for (let rowIndex = pivotIndex + 1; rowIndex < rowCount; rowIndex += 1) {
			if (Math.abs(augmentedMatrix[rowIndex][pivotIndex]) > Math.abs(augmentedMatrix[bestRowIndex][pivotIndex])) {
				bestRowIndex = rowIndex;
			}
		}

		[augmentedMatrix[pivotIndex], augmentedMatrix[bestRowIndex]] = [augmentedMatrix[bestRowIndex], augmentedMatrix[pivotIndex]];

		const pivotValue = augmentedMatrix[pivotIndex][pivotIndex];

		if (Math.abs(pivotValue) < 1e-8) {
			return null;
		}

		for (let columnIndex = pivotIndex; columnIndex <= rowCount; columnIndex += 1) {
			augmentedMatrix[pivotIndex][columnIndex] /= pivotValue;
		}

		for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
			if (rowIndex === pivotIndex) {
				continue;
			}

			const factor = augmentedMatrix[rowIndex][pivotIndex];

			for (let columnIndex = pivotIndex; columnIndex <= rowCount; columnIndex += 1) {
				augmentedMatrix[rowIndex][columnIndex] -= factor * augmentedMatrix[pivotIndex][columnIndex];
			}
		}
	}

	return augmentedMatrix.map((row) => row[rowCount]);
}

function getHomography(fromPoints, toPoints) {
	const matrix = [];
	const values = [];

	fromPoints.forEach((fromPoint, index) => {
		const toPoint = toPoints[index];

		matrix.push([fromPoint.x, fromPoint.y, 1, 0, 0, 0, -fromPoint.x * toPoint.x, -fromPoint.y * toPoint.x]);
		values.push(toPoint.x);
		matrix.push([0, 0, 0, fromPoint.x, fromPoint.y, 1, -fromPoint.x * toPoint.y, -fromPoint.y * toPoint.y]);
		values.push(toPoint.y);
	});

	return solveLinearSystem(matrix, values);
}

function mapHomographyPoint(homography, point) {
	const denominator = (homography[6] * point.x) + (homography[7] * point.y) + 1;

	if (Math.abs(denominator) < 1e-8) {
		return null;
	}

	return {
		x: ((homography[0] * point.x) + (homography[1] * point.y) + homography[2]) / denominator,
		y: ((homography[3] * point.x) + (homography[4] * point.y) + homography[5]) / denominator,
	};
}

function getLocalRect(element, ancestor) {
	let left = 0;
	let top = 0;
	let currentElement = element;

	while (currentElement && currentElement !== ancestor) {
		left += currentElement.offsetLeft;
		top += currentElement.offsetTop;
		currentElement = currentElement.offsetParent;
	}

	return {
		left,
		top,
		width: element.offsetWidth,
		height: element.offsetHeight,
	};
}

function isPointInRect(point, rect) {
	return point.x >= rect.left && point.x <= rect.left + rect.width && point.y >= rect.top && point.y <= rect.top + rect.height;
}

function measurePanelPoint(panelElement, x, y) {
	const probe = document.createElement('span');

	probe.className = 'contact-page__hit-probe';
	probe.style.left = `${x}px`;
	probe.style.top = `${y}px`;
	panelElement.append(probe);

	const rect = probe.getBoundingClientRect();
	probe.remove();

	return {
		x: rect.left,
		y: rect.top,
	};
}

function getPanelLocalPoint(panelElement, pointX, pointY) {
	const localCorners = [
		{ x: 0, y: 0 },
		{ x: panelElement.offsetWidth, y: 0 },
		{ x: panelElement.offsetWidth, y: panelElement.offsetHeight },
		{ x: 0, y: panelElement.offsetHeight },
	];
	const screenCorners = localCorners.map((point) => measurePanelPoint(panelElement, point.x, point.y));
	const screenToLocal = getHomography(screenCorners, localCorners);

	return screenToLocal ? mapHomographyPoint(screenToLocal, { x: pointX, y: pointY }) : null;
}

function findProjectedContactControl(formElement, pointX, pointY) {
	const panelElement = formElement.closest('.contact-page__message-paper');

	if (!panelElement) {
		return null;
	}

	const localPoint = getPanelLocalPoint(panelElement, pointX, pointY);

	if (!localPoint || !isPointInRect(localPoint, { left: 0, top: 0, width: panelElement.offsetWidth, height: panelElement.offsetHeight })) {
		return null;
	}

	const controls = [...formElement.querySelectorAll('[data-contact-hit-target]')]
		.filter((control) => !control.disabled)
		.filter((control) => isPointInRect(localPoint, getLocalRect(control, panelElement)));

	return controls
		.sort((firstControl, secondControl) => getContactControlPriority(firstControl) - getContactControlPriority(secondControl))[0] || null;
}

export default function ContactPage() {
	const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', company: '' });
	const [status, setStatus] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');
	const formRef = useRef(null);
	const shouldSuppressClickRef = useRef(false);
	const shouldSubmitProjectedButtonRef = useRef(false);

	function handleChange(e) {
		setForm((currentForm) => ({ ...currentForm, [e.target.name]: e.target.value }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setStatus('sending');
		setErrorMessage('');

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			let payload = null;
			try {
				payload = await res.json();
			} catch {
				payload = null;
			}

			if (res.ok && payload?.ok !== false) {
				setStatus('sent');
				return;
			}

			setErrorMessage(payload?.detail || payload?.error || FALLBACK_ERROR);
			setStatus('error');
		} catch (error) {
			setErrorMessage(error?.message || FALLBACK_ERROR);
			setStatus('error');
		}
	}

	function updateContactCursor(pointX, pointY) {
		if (!formRef.current) {
			return;
		}

		const projectedControl = findProjectedContactControl(formRef.current, pointX, pointY);
		const hitKind = projectedControl?.matches('.contact-page__button') ? 'button' : projectedControl ? 'field' : 'none';

		formRef.current.dataset.contactHitKind = hitKind;
	}

	function handleFormPointerMoveCapture(e) {
		updateContactCursor(e.clientX, e.clientY);
	}

	function handleFormPointerLeave() {
		if (formRef.current) {
			formRef.current.dataset.contactHitKind = 'none';
		}
	}

	function handleFormPointerDownCapture(e) {
		if (e.button !== 0 || !formRef.current || !(e.target instanceof Element)) {
			return;
		}

		updateContactCursor(e.clientX, e.clientY);

		const nativeControl = e.target.closest('[data-contact-hit-target]');
		const projectedControl = findProjectedContactControl(formRef.current, e.clientX, e.clientY);

		if (nativeControl === projectedControl) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();
		shouldSuppressClickRef.current = true;
		shouldSubmitProjectedButtonRef.current = Boolean(projectedControl?.matches('.contact-page__button'));

		if (projectedControl && !projectedControl.matches('.contact-page__button')) {
			projectedControl.focus({ preventScroll: true });
		}
	}

	function handleFormClickCapture(e) {
		if (!shouldSuppressClickRef.current) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		if (shouldSubmitProjectedButtonRef.current) {
			formRef.current?.requestSubmit();
		}

		shouldSuppressClickRef.current = false;
		shouldSubmitProjectedButtonRef.current = false;
	}

	return (
		<section className="contact-page" aria-label="Contact Jacob Grieco">
			<AboutContactFormStage>
				<div className="contact-page__form-card">
					<div className="contact-page__heading">
						<h2 className="contact-page__title">Send a Message</h2>
						<div className="contact-page__rule" aria-hidden="true" />
					</div>

					{status === 'sent' ? (
						<div className="contact-page__success" role="status" aria-live="polite">Message sent. I&apos;ll be in touch soon.</div>
					) : (
						<form
							ref={formRef}
							onSubmit={handleSubmit}
							onPointerMoveCapture={handleFormPointerMoveCapture}
							onPointerLeave={handleFormPointerLeave}
							onPointerDownCapture={handleFormPointerDownCapture}
							onClickCapture={handleFormClickCapture}
							className="contact-page__form"
							data-contact-hit-kind="none"
						>
							<div className="contact-page__field">
								<label htmlFor="contact-name" className="contact-page__label">Name</label>
								<input id="contact-name" name="name" autoComplete="name" value={form.name} onChange={handleChange} placeholder="Your name" required className="contact-page__input" data-contact-hit-target />
							</div>
							<div className="contact-page__field">
								<label htmlFor="contact-email" className="contact-page__label">Email</label>
								<input id="contact-email" name="email" type="email" autoComplete="email" spellCheck={false} value={form.email} onChange={handleChange} placeholder="you@example.com" required className="contact-page__input" data-contact-hit-target />
							</div>
							<div className="contact-page__field">
								<label htmlFor="contact-subject" className="contact-page__label">Subject</label>
								<input id="contact-subject" name="subject" autoComplete="off" value={form.subject} onChange={handleChange} placeholder="Get in touch" className="contact-page__input" data-contact-hit-target />
							</div>
							<div className="contact-page__field">
								<label htmlFor="contact-message" className="contact-page__label">Message</label>
								<textarea id="contact-message" name="message" autoComplete="off" value={form.message} onChange={handleChange} placeholder="What do you need me to know..." required rows={13} className="contact-page__textarea" data-contact-hit-target />
							</div>
							<input
								name="company"
								value={form.company}
								onChange={handleChange}
								tabIndex={-1}
								autoComplete="off"
								className="contact-page__honeypot"
								aria-hidden="true"
							/>
							{status === 'error' && <div className="contact-page__error" role="alert">{errorMessage || FALLBACK_ERROR}</div>}
							<button type="submit" disabled={status === 'sending'} className="contact-page__button" data-contact-hit-target>
								<Send className="contact-page__button-icon" strokeWidth={1.7} aria-hidden="true" />
								<span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
							</button>
						</form>
					)}
				</div>
			</AboutContactFormStage>
		</section>
	);
}
