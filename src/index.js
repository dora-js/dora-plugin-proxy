import { proxyServer as ProxyServer, isRootCAFileExists, generateRootCA } from 'anyproxy';

!isRootCAFileExists() && generateRootCA();

export default {
  'server.after': (args) => {
    const { port, localIP, query } = args;
    new ProxyServer({
      type: 'http',
      port: 8989,
      hostname: 'localhost',
      rule: require('./rule')({
        rootDir: typeof query.proxy === 'string' ? args.proxy : '/',
        port,
        hostname: localIP,
      }),
    });
  },
};
