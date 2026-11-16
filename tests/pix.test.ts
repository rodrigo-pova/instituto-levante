import { describe, it, expect } from 'vitest';
import {
  crc16ccitt,
  tlv,
  cleanAscii,
  normalizePixKey,
  buildPixPayload,
} from '@/lib/pix';

describe('PIX static payload builder & BACEN compliance', () => {
  it('correctly calculates CRC16-CCITT checksum for known vectors', () => {
    // "123456789" with CCITT-FALSE (init 0xFFFF, poly 0x1021) = 0x29B1
    expect(crc16ccitt('123456789')).toBe('29B1');
  });

  it('correctly formats TLV (Tag-Length-Value) strings with zero-padding', () => {
    expect(tlv('00', '01')).toBe('000201');
    expect(tlv('58', 'BR')).toBe('5802BR');
    expect(tlv('53', '986')).toBe('5303986');
  });

  it('cleans ASCII, strips diacritics, and enforces strict length boundaries', () => {
    // Merchant Name max 25 chars, uppercase, no accents
    expect(cleanAscii('Instituto Levante', 25)).toBe('INSTITUTO LEVANTE');
    expect(cleanAscii('São Paulo & Açúcar', 25)).toBe('SAO PAULO  ACUCAR');
    expect(cleanAscii('A very long name that exceeds twenty-five characters', 25)).toBe(
      'A VERY LONG NAME THAT EXC',
    );

    // City max 15 chars
    expect(cleanAscii('Rio de Janeiro', 15)).toBe('RIO DE JANEIRO');
    expect(cleanAscii('São Gonçalo do Sapucaí', 15)).toBe('SAO GONCALO DO');
  });

  it('normalizes PIX keys by format', () => {
    expect(normalizePixKey('12.345.678/0001-90', 'cnpj')).toBe('12345678000190');
    expect(normalizePixKey('Contato@InstitutoLevante.org.br', 'email')).toBe(
      'contato@institutolevante.org.br',
    );
    expect(normalizePixKey('(21) 98765-4321', 'phone')).toBe('+5521987654321');
    expect(normalizePixKey('5521987654321', 'phone')).toBe('+5521987654321');
  });

  it('assembles a full BACEN-compliant static BR Code payload', () => {
    const payload = buildPixPayload({
      key: 'contato@institutolevante.org.br',
      name: 'Instituto Levante',
      city: 'Rio de Janeiro',
      txid: '***',
    });

    expect(payload.startsWith('000201')).toBe(true);
    expect(payload).toContain('br.gov.bcb.pix');
    expect(payload).toContain('contato@institutolevante.org.br');
    expect(payload).toContain('5802BR');
    expect(payload).toContain('5917INSTITUTO LEVANTE');
    expect(payload).toContain('6014RIO DE JANEIRO');
    expect(payload).toContain('62070503***');
    expect(payload).toContain('6304');

    // The last 4 characters are the CRC16 calculated over everything prior
    const bodyWithoutCrc = payload.slice(0, -4);
    const expectedCrc = crc16ccitt(bodyWithoutCrc);
    expect(payload.endsWith(expectedCrc)).toBe(true);
  });
});
