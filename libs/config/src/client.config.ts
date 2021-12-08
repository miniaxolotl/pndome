export const config: {
  DEVELOPMENT: boolean;
  PORT: number;
} = {
  DEVELOPMENT: !!process.env.DEVELOPMENT ?? true,
  PORT: process.env.CLIENT_PORT ? parseInt(process.env.CLIENT_PORT) : 3306,
};

export default config;
