import {
  proxyServer as ProxyServer,
  isRootCAFileExists,
  isRootCATrusted,
  generateRootCA,
  trustRootCA,
} from 'dora-anyproxy';
import getRule from './getRule';

export default {
  'name': 'proxy',
  *'middleware.before'(args) {
    yield new Promise((resolve, reject) => {
      const trust = () => {
        isRootCATrusted(trusted => {
          if (!trusted) {
            trustRootCA(resolve, reject);
          } else {
            resolve();
          }
        });
      };

      if (!isRootCAFileExists()) {
        generateRootCA(trust);
      } else {
        trust();
      }
    });

    const { log } = args;
    const port = args.query.port || 8989;
    const proxyServer = new ProxyServer({
      type: 'http',
      port,
      hostname: 'localhost',
      rule: getRule(args),
      disableWebInterface: true,
    });

    yield new Promise((resolve, reject) => {
      proxyServer.on('finish', (err) => {
        if (err) {
          reject(err);
        } else {
          log.info(`listened on ${port}`);
          resolve();
        }
      });
    });
  },
};
