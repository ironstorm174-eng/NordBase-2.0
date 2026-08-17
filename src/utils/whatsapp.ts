/**
 * Utility functions for WhatsApp Integration across NordBase platform
 */

/**
 * Cleans and formats a phone number for WhatsApp links (wa.me)
 * Accepts formats like: "+351 912 345 678", "912345678", "00351912345678", etc.
 */
export function cleanPhoneForWhatsApp(phone?: string): string {
  if (!phone) return '';
  // Remove all non-digits
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (!cleaned) return '';

  // Remove leading '00' if present
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.slice(2);
  }

  // If standard Portuguese 9-digit mobile or landline without country code
  if (cleaned.length === 9 && (cleaned.startsWith('9') || cleaned.startsWith('2') || cleaned.startsWith('3'))) {
    cleaned = '351' + cleaned;
  }

  return cleaned;
}

/**
 * Returns a wa.me URL for 1-click opening in WhatsApp App or WhatsApp Web
 */
export function getWhatsAppUrl(phone?: string, message?: string): string {
  const cleanNum = cleanPhoneForWhatsApp(phone);
  if (!cleanNum) return '#';
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleanNum}${query}`;
}

/**
 * Opens WhatsApp in a new tab with optional prefilled message
 */
export function openWhatsApp(phone?: string, message?: string): void {
  const url = getWhatsAppUrl(phone, message);
  if (url !== '#') {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    alert('Invalid or missing WhatsApp phone number.');
  }
}
