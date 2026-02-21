const isDev = process.env.NODE_ENV !== 'production';

export const debug = {
  log: (...args) => { if (isDev) console.log(...args); },
  info: (...args) => { if (isDev) console.info(...args); },
  warn: (...args) => { if (isDev) console.warn(...args); },
  error: (...args) => { if (isDev) console.error(...args); },
};

export default debug;
