export const config: {
  DEVELOPMENT: boolean;
  PORT: number;
  SESSION_KEYS: string[];
  BCRYPT_KEY: string;
  BCRYPT_SALT_ROUNDS: number;
  FILE_PATH: string;
  DATABASE_URL: string;
  ADMIN_EMAIL: string;
  ADMIN_USER: string;
  ADMIN_PASS: string;
} = {
  DEVELOPMENT: !!process.env.DEVELOPMENT ?? true,
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3306,
  SESSION_KEYS: process.env.SESSION_KEYS
    ? JSON.parse(process.env.SESSION_KEYS)
    : ['super-duper-secret', 'even-more-secret'],
  BCRYPT_KEY: process.env.BCRYPT_KEY ?? 'super-duper-secret',
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 0,
  FILE_PATH: process.env.FILE_PATH ?? '/tmp/pndome',
  DATABASE_URL:
    process.env.DATABASE_URL ?? 'mysql://username:password@mysql.database:3306/pndome_dev',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? 'user@example.com',
  ADMIN_USER: process.env.ADMIN_USER ?? 'admin',
  ADMIN_PASS: process.env.ADMIN_PASS ?? 'password',
};

export default config;
