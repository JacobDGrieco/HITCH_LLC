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

			if (res.ok) {
				setStatus('sent');
				return;
			}

			setErrorMessage(payload?.error || 'Something went wrong — try emailing directly.');
			setStatus('error');
		} catch (error) {
			setErrorMessage(error?.message || 'Something went wrong — try emailing directly.');
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
									<div className="contact-page__success">Message sent — I&apos;ll be in touch soon ☁</div>
								) : (
									<form onSubmit={handleSubmit} className="contact-page__form">
										<input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className="contact-page__input" />
										<input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your email" required className="contact-page__input" />
										<input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="contact-page__input" />
										<textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message" required rows={5} className="contact-page__textarea" />
										<input
											name="company"
											value={form.company}
											onChange={handleChange}
											tabIndex={-1}
											autoComplete="off"
											className="contact-page__honeypot"
											aria-hidden="true"
										/>
										{status === 'error' && <div className="contact-page__error">{errorMessage || 'Something went wrong — try emailing directly.'}</div>}
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
