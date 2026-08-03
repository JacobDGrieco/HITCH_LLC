import { useState } from 'react';
import '../styles/shared.css';
import '../styles/contact-page.css';
import '../styles/contact-crystal.css';
import ContactCrystal from '../components/ContactCrystal';

const CONTACTS = [
	{
		title: 'Email',
		subtitle: 'contact@headinthecloudshaven.com',
		href: 'mailto:contact@headinthecloudshaven.com',
		icon: '✉',
		hue: 'rgba(245,175,210,0.94)',
		size: 218,
		delay: 0,
		position: 'top-left',
	},
	{
		title: 'LinkedIn',
		subtitle: 'Professional profile',
		href: 'https://linkedin.com/in/jacob-grieco',
		iconImage: '/linkedin.png',
		hue: 'rgba(175,220,255,0.94)',
		size: 174,
		delay: -1.6,
		position: 'top-right',
	},
	{
		title: 'GitHub',
		subtitle: 'Projects and code',
		href: 'https://github.com/JacobDGrieco',
		iconImage: '/github.png',
		hue: 'rgba(212,193,255,0.94)',
		size: 170,
		delay: -0.7,
		position: 'bottom-left',
	},
	{
		title: 'Resume',
		subtitle: 'Download PDF',
		href: '/resume.pdf',
		iconImage: '/resume.png',
		hue: 'rgba(255,217,170,0.94)',
		size: 172,
		delay: -2.2,
		position: 'bottom-right',
	},
];

const FALLBACK_ERROR = 'Something went wrong. Try emailing directly.';

export default function ContactPage() {
	const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', company: '' });
	const [status, setStatus] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');

	function handleChange(e) {
		setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
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

	return (
		<div className="page-section">
			<div className="page-header">
				<div className="page-title">Contact</div>
				<div className="page-subtitle">let&apos;s connect</div>
			</div>

			<div className="contact-page__cluster-shell">
				<div className="contact-page__cluster">
					{CONTACTS.map((item) => (
						<div key={item.title} className={`contact-page__orbit contact-page__orbit--${item.position}`}>
							<ContactCrystal {...item} />
						</div>
					))}

					<div className="contact-page__message-core glass-card">
						<div className="contact-page__message-shell">
							<div className="contact-page__message-glow" />
							<div className="contact-page__message-facets" />
							<div className="contact-page__message-shine" />
							<div className="contact-page__message-content">
								<div className="contact-page__eyebrow">Send a Message</div>
								{status === 'sent' ? (
									<div className="contact-page__success" role="status" aria-live="polite">Message sent — I&apos;ll be in touch soon</div>
								) : (
									<form onSubmit={handleSubmit} className="contact-page__form">
										<label className="contact-page__field">
											<span className="contact-page__label">Name</span>
											<input name="name" autoComplete="name" value={form.name} onChange={handleChange} placeholder="Jane Grieco" required className="contact-page__input" />
										</label>
										<label className="contact-page__field">
											<span className="contact-page__label">Email</span>
											<input name="email" type="email" autoComplete="email" spellCheck={false} value={form.email} onChange={handleChange} placeholder="jane@example.com" required className="contact-page__input" />
										</label>
										<label className="contact-page__field">
											<span className="contact-page__label">Subject</span>
											<input name="subject" autoComplete="off" value={form.subject} onChange={handleChange} placeholder="Project inquiry" className="contact-page__input" />
										</label>
										<label className="contact-page__field">
											<span className="contact-page__label">Message</span>
											<textarea name="message" autoComplete="off" value={form.message} onChange={handleChange} placeholder="Tell me about your project…" required rows={5} className="contact-page__textarea" />
										</label>
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
										<button type="submit" disabled={status === 'sending'} className="contact-page__button">
											{status === 'sending' ? 'Sending…' : 'Send Message'}
										</button>
									</form>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
