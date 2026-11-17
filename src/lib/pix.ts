/**
 * Pure TypeScript builder for static PIX BR Code payloads (EMV-QRCPS-MPM).
 * Conforms to Central Bank of Brazil (BACEN) standards.
 */

export interface PixInput {
  key: string;
  name: string;
  city: string;
  txid?: string;
  amount?: number;
}

/**
 * Calculates CCITT-FALSE CRC16 checksum (poly 0x1021, init 0xFFFF).
 */
export function crc16ccitt(str: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    crc ^= (c & 0xff) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Formats Tag-Length-Value (TLV) string.
 */
export function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Cleans string: strips accents, removes invalid characters, forces uppercase, truncates.
 */
export function cleanAscii(str: string, maxLength: number): string {
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^A-Za-z0-9 ]/g, '') // alphanumeric + space only
    .trim()
    .toUpperCase();

  return cleaned.slice(0, maxLength).trim();
}

/**
 * Cleans transaction identifier (txid) according to BACEN specs (alphanumeric or ***).
 */
export function cleanTxid(txid?: string, maxLength: number = 25): string {
  if (!txid || txid === '***') return '***';
  const cleaned = txid
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, maxLength);
  return cleaned || '***';
}

/**
 * Normalizes PIX key based on key type or auto-detection.
 */
export function normalizePixKey(
  key: string,
  type?: 'cnpj' | 'email' | 'phone' | 'random',
): string {
  const trimmed = key.trim();
  if (type === 'cnpj') {
    return trimmed.replace(/\D/g, '');
  }
  if (type === 'email') {
    return trimmed.toLowerCase();
  }
  if (type === 'phone') {
    const digits = trimmed.replace(/\D/g, '');
    return digits.startsWith('55') ? `+${digits}` : `+55${digits}`;
  }
  return trimmed;
}

/**
 * Builds the complete static PIX BR Code payload string.
 */
export function buildPixPayload({
  key,
  name,
  city,
  txid = '***',
  amount,
}: PixInput): string {
  const merchantName = cleanAscii(name, 25);
  const merchantCity = cleanAscii(city, 15);
  const transactionId = cleanTxid(txid, 25);

  // Field 26: Merchant Account Information
  const merchantAccount = tlv('00', 'br.gov.bcb.pix') + tlv('01', key);

  let payload =
    tlv('00', '01') + // Payload Format Indicator
    tlv('26', merchantAccount) +
    tlv('52', '0000') + // Merchant Category Code
    tlv('53', '986') + // Transaction Currency (986 = BRL)
    (amount && amount > 0 ? tlv('54', amount.toFixed(2)) : '') +
    tlv('58', 'BR') + // Country Code
    tlv('59', merchantName) + // Merchant Name (max 25)
    tlv('60', merchantCity) + // Merchant City (max 15)
    tlv('62', tlv('05', transactionId)) + // Additional Data Field (txid)
    '6304'; // CRC16 indicator

  const checksum = crc16ccitt(payload);
  return payload + checksum;
}
