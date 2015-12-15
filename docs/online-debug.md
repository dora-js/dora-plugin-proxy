
# 在线调试

以调试 https://a.alipayobjects.com/* 下的文件为例，介绍在线调试的使用方法。

## 安装

安装 [SwitchyOmega](https://chrome.google.com/webstore/detail/padekgcemlokbadohgkifijomclgjgif)。(不能正常安装的可以到[这里](https://github.com/FelisCatus/SwitchyOmega/releases)下 `.crx` 文件，然后手动安装)

## 配置

安装完成之后，先新建 `Profile`，类型选 `Proxy Profile`

![](https://os.alipayobjects.com/rmsportal/vcAiLyOYODBzvhW.png)

配置前面建的 Profile，关联到 `127.0.0.1:8989`

![](https://os.alipayobjects.com/rmsportal/CzZynZITUhrTLjI.png)

配置 `Auto Switch`，关联 `*://a.alipayobjects.com/*` 到前面建的 `Profile`

![](https://os.alipayobjects.com/rmsportal/SuCtIkmLJdRtMms.png)

## 调试

先在命令行启动 dora 以及 dora-plugin-proxy 插件，比如：

```bash
> dora -p 8001 --plugins proxy
  
         dora: listened on 8001
        proxy: load rule from proxy.config.js
        proxy: listened on 8989
```

然后点击插件 ICON ，选 `Auto Switch`

![](https://os.alipayobjects.com/rmsportal/LDwEDjuBDbSrTIp.png)

浏览器访问：https://a.alipayobjects.com/ 应该能看到和 http://127.0.0.1:8989/ 一致的效果，比如：

![](https://os.alipayobjects.com/rmsportal/WDtwzwSGHdokxXU.png)

> 调试完记得把 `SwitchyOmega` 的模式切回 `[System Proxy]`，否则可能会影响网页的正常访问。

