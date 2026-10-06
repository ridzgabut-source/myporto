import { profile, whatsappMessages } from '../data/profile';
export function getWhatsAppLink(context: keyof typeof whatsappMessages) {
  const configured = profile.whatsapp.trim();
  const destination = configured.startsWith('https://')
    ? new URL(configured)
    : null;
  const number = (
    destination
      ? destination.searchParams.get('phone') || destination.pathname
      : configured
  ).replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessages[context])}`;
}
