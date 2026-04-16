import { SignJWT, jwtVerify } from 'jose';

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_fallback_key_for_dev');
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_fallback_key');

export async function signAccessToken(payload: { userId: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(jwtSecret);
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, jwtSecret);
    return payload as { userId: string; role: string; exp: number };
  } catch (error) {
    return null;
  }
}

export async function signRefreshToken(payload: { userId: string }) {
  return new SignJWT({ ...payload, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(refreshSecret);
}

export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, refreshSecret);
    if (payload.type !== 'refresh') return null;
    return payload as { userId: string; exp: number };
  } catch (error) {
    return null;
  }
}
