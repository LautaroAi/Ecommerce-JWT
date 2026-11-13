import pino from 'pino';

export const logger = pino({
  level: 'info',
  redact: {
    paths: ['req.headers.authorization', 'req.body.password', 'req.body.refreshToken'],
    censor: '[CENSURADO_POR_SEGURIDAD]',
  },
});