import {
  proxyServer as ProxyServer,
  isRootCAFileExists,
  isRootCATrusted,
  generateRootCA,
  trustRootCA
} from 'dora-anyproxy';
import getRule from './getRule';

if (!isRootCAFileExists()) {
  generateRootCA(trust);
} else {
  trust();
}

function trust() {
  isRootCATrusted(trusted => {
    if (!trusted) {
      trustRootCA();
    }
  });
}

export default {
  'name': 'proxy',
  'server.after': (args) => {
    const { log } = args;
    const port = args.query.port || 8989;
    const proxyServer = new ProxyServer({
      type: 'http',
      port: port,
      hostname: 'localhost',
      rule: getRule(args),
      disableWebInterface: true,
    });

    proxyServer.on('finish', (err) => {
      if (err) {
        log.error(err);
      } else {
        log.info(`listened on ${port}`);
      }
    });
  },
};
