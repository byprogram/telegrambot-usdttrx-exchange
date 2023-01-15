# telegrambot-usdttrx-exchange
自动兑换trx-usdt的电报机器人

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
var rate_TRX = 0.12; //trx兑换比例 1个trx可兑换0.2个usdt
var sxf_TRX = 0.05; //兑换手续费

var rate_USDT = 18; 
/*配置区域 */
```
