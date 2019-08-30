## Quick Start
#### Down
~~~
git clone ?
~~~

#### Install
~~~
npm install
~~~

#### Dll
第一次运行需要打包vendor，仅运行一次。当依赖改变时需重新打包。
~~~
npm run dll
~~~

#### Run
~~~
npm start
~~~

#### Build
~~~
npm run build
~~~

#### 发布CDN(推荐)

将project.config.js内publicPath改为服务器绝对路径。

#### 发布静态资源

若没有CDN，只能发布静态资源，需修改webpack配置，将所有文件放置在同一目录下。



