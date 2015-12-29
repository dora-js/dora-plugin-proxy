import cdeps from './cdeps';
import { existsSync } from 'fs';
import { join } from 'path';

export default function getProxyConfig(configPath, args) {
  const { cwd, log } = args;
  const proxyFile = join(cwd, configPath);
  const defaultProxy = {};
  const clearCacheDelay = args.query.watchDelay || 300;
  let cache;
  let timer;

  let watchDirs = args.query.watchDirs || [];
  if (typeof watchDirs === 'string') watchDirs = [watchDirs];
  watchDirs = watchDirs.map(watchDir => join(cwd, watchDir));

  if (existsSync(proxyFile)) {
    log.info(`load rule from ${configPath}`);
  }

  function loadFile() {
    if (!cache && existsSync(proxyFile) ) {
      log.debug(`reload ${configPath}`);
      const depList = cdeps(proxyFile);
      depList.forEach(dep => delete require.cache[require.resolve(dep)]);

      Object.keys(require.cache).forEach(key => {
        watchDirs.forEach(watchDir => {
          if (key.indexOf(watchDir) === 0) {
            log.debug(`DELETE CACHE REQUIRE: ${key}`);
            delete require.cache[key];
          }
        });
      });

      cache = require(proxyFile);
    }
    return cache;
  }

  function clearCache() {
    cache = null;
  }

  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(clearCache, clearCacheDelay);
    return loadFile() || defaultProxy;
  }
}
