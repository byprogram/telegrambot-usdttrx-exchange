# telegrambot-usdttrx-exchange
自动兑换trx-usdt的电报机器人
## 实时预览
兑币机1.0版本 [@duibiji_bot](https://t.me/duibiji_bot)<br>
兑币机2.0版本 [@shandui2bot](https://t.me/shandui2bot)
## 使用方法
- 安装node.js和mysql
- 找到文件 `tgexchange.sql`，导入数据库
``` javascript
/*配置区域 */
var pool = mysql.createPool({
    port:3306, //mysql端口
    user     : 'tgexchange', //mysql用户名
    password : 'tgexchange', //mysql密码
    database : 'tgexchange', //mysql数据库
});
var token = "5904481333:AAFYFJovtPYrMpuqLo2VzPk-mAvRWuD03mc" //机器人token
var address = "TMSv56vAtZgFRjPAWQvPSEu2eEoviKALH3" //转账地址
var trxPrivateKey = "fed5b06fafe7ae951928ca5e5a7e8fbbacfe4eff334e687452e997106a3a46c7"; //私钥
var mode = "main"//网络选择 main:主网 nile:nile网
/*配置区域 */
```
- 配置上方参数
- 在文件夹根目录下的终端输入命令 `node app` 启动项目
## 私人定制
Telegram：[@byprogram](https://t.me/byprogram)<br>
主页：[点击查看](https://www.byprogram.xyz/)
