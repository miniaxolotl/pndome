export const config: {
  DEVELOPMENT: boolean;
  PORT: number;
  MAX_BYTES: number;
  FILE_PATH: string;
  BUNNYCDN_API: string;
  BUNNYCDN_API_KEY: string;
  BUNNYCDN_API_MEDIA: string;
  BUNNYCDN_API_MEDIA_KEY: string;
  SESSION_KEYS: string[];
  ENCRYPTION_KEY: string;
  JWT_SECRET: string;
  BCRYPT_KEY: string;
  BCRYPT_SALT_ROUNDS: number;
  DATABASE_URL: string;
  ADMIN_EMAIL: string;
  ADMIN_USER: string;
  ADMIN_PASS: string;
} = {
  DEVELOPMENT: !!process.env.DEVELOPMENT ?? true,
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3306,
  MAX_BYTES: process.env.MAX_BYTES ? eval(process.env.MAX_BYTES) : 1 ** 20 * 500,
  FILE_PATH: process.env.FILE_PATH ?? '/tmp/pndome',
  BUNNYCDN_API: process.env.BUNNYCDN_API ?? 'storage.bunnycdn.com',
  BUNNYCDN_API_KEY: process.env.BUNNYCDN_API_KEY ?? 'super-duper-secret',
  BUNNYCDN_API_MEDIA: process.env.BUNNYCDN_API_MEDIA ?? 'la.storage.bunnycdn.com',
  BUNNYCDN_API_MEDIA_KEY: process.env.BUNNYCDN_API_MEDIA_KEY ?? 'super-duper-secret',
  SESSION_KEYS: process.env.SESSION_KEYS
    ? JSON.parse(process.env.SESSION_KEYS)
    : ['super-duper-secret', 'even-more-secret'],
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ?? 'super-duper-secret',
  JWT_SECRET: process.env.JWT_SECRET ?? 'super-duper-secret',
  BCRYPT_KEY: process.env.BCRYPT_KEY ?? 'super-duper-secret',
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 0,
  DATABASE_URL:
    process.env.DATABASE_URL ?? 'mysql://username:password@mysql.database:3306/pndome_dev',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? 'user@example.com',
  ADMIN_USER: process.env.ADMIN_USER ?? 'admin',
  ADMIN_PASS: process.env.ADMIN_PASS ?? 'password',
};

export default config;
