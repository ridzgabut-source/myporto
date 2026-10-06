import { profile } from '../../data/profile';
import { track } from '../../lib/analytics';
import { getWhatsAppLink } from '../../lib/whatsapp';
import { External, Arrow } from './ui';
export function Contact() {
  return (
    <section id="contact" className="section contact">
      <p className="eyebrow">
        <span>05 /</span> THE NEXT GOOD IDEA
      </p>
      <div className="contact-layout">
        <div>
          <p className="availability">
            <span className="status-dot" /> OPEN TO OPPORTUNITIES
          </p>
          <h2>
            Anything in mind?
            <br />
            <em>Let's make it real.</em>
          </h2>
          <p>
            Punya project, peluang kerja, atau ide menarik?
            <br />
            Obrolan kecil bisa jadi awal sesuatu yang besar.
          </p>
          <a
            className="button primary"
            href={getWhatsAppLink('conversation')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track('contact_click', {
                channel: 'whatsapp',
                source: 'conversation',
              })
            }
          >
            Start a conversation <Arrow />
          </a>
        </div>
        <div className="contact-links">
          <span className="mono">A NOTE IS ALL IT TAKES</span>
          <External href={`mailto:${profile.email}`}>
            Email <small>{profile.email}</small>
          </External>
          {profile.whatsapp && (
            <External href={getWhatsAppLink('conversation')}>WhatsApp</External>
          )}
          {profile.github && (
            <External href={profile.github} event="github_click">
              GitHub
            </External>
          )}
          <div className="contact-time">
            <span className="status-dot" /> Indonesia · UTC +7
          </div>
        </div>
      </div>
      <a
        href={getWhatsAppLink('banner')}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-banner"
        onClick={() =>
          track('contact_click', { channel: 'whatsapp', source: 'banner' })
        }
      >
        <span className="contact-orb" aria-hidden="true" />
        <span>LET'S TALK</span>
        <Arrow />
      </a>
    </section>
  );
}
