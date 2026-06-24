import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(nodeScrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  const [algorithm, salt, storedHash] = passwordHash.split(':');

  if (algorithm !== 'scrypt' || !salt || !storedHash) {
    return false;
  }

  const storedBuffer = Buffer.from(storedHash, 'hex');
  const suppliedBuffer = (await scrypt(password, salt, storedBuffer.length)) as Buffer;

  return storedBuffer.length === suppliedBuffer.length && timingSafeEqual(storedBuffer, suppliedBuffer);
}
