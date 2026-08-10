/**
 * 环境变量配置加载：
 * - 若直接提供 DATABASE_URL 则优先使用
 * - 否则由 DATABASE_HOST/PORT/NAME/USERNAME/PASSWORD 拼接（密码自动 URL 编码）
 */
export default () => {
  const host = process.env.DATABASE_HOST;
  const port = process.env.DATABASE_PORT || '5432';
  const name = process.env.DATABASE_NAME;
  const username = process.env.DATABASE_USERNAME;
  const password = process.env.DATABASE_PASSWORD || '';

  const url =
    process.env.DATABASE_URL ||
    `postgresql://${username}:${encodeURIComponent(password)}@${host}:${port}/${name}?schema=public`;

  // 运行时确保 Prisma 可读取 DATABASE_URL
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = url;
  }

  return {
    database: {
      host,
      port: Number(port),
      name,
      username,
      password,
      url,
    },
    app: {
      port: Number(process.env.APP_PORT) || 3000,
      env: process.env.NODE_ENV || 'development',
      apiPrefix: process.env.API_PREFIX || 'api/v1',
      swaggerPath: process.env.SWAGGER_PATH || 'docs',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },
    auth: {
      password: process.env.BABY_RECORD_PASSWORD,
      secret: process.env.BABY_RECORD_AUTH_SECRET || process.env.BABY_RECORD_PASSWORD,
      sessionDays: Number(process.env.BABY_RECORD_SESSION_DAYS) || 30,
      cookieSecure:
        process.env.BABY_RECORD_COOKIE_SECURE === 'true' ||
        (process.env.BABY_RECORD_COOKIE_SECURE !== 'false' && process.env.NODE_ENV === 'production'),
    },
  };
};
