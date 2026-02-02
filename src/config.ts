const protocol = import.meta.env.VITE_API_PROTOCOL ?? 'http';
const host = import.meta.env.VITE_API_HOST ?? '127.0.0.1';
const port = import.meta.env.VITE_API_PORT ?? '8080';

const isDev = import.meta.env.MODE === 'development';

export const config = {
  API_BASE: isDev ? `${protocol}://${host}${port ? `:${port}` : ''}` : '/api',
};
