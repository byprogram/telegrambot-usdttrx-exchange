var mysql = require('mysql');
var TelegramBot = require('node-telegram-bot-api');
var TronWeb = require('tronweb')
var request = require('request-promise');


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





var urlArray,tronWeb,contractaddress_usdt,
minCount_TRX = 35.6448031,
minCount_USDT = 2.189727,
apiURL = [
    {trx:`https://api.trongrid.io/v1/accounts/${address}/transactions`,usdt:`https://api.trongrid.io/v1/accounts/${address}/transactions/trc20?limit=20&contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`},
    {trx:`https://nile.trongrid.io/v1/accounts/${address}/transactions`,usdt:`https://nile.trongrid.io/v1/accounts/${address}/transactions/trc20?limit=20&contract_address=TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj`}
],
keyboard = [
    [{text:"USDT兑换TRX"},{text:"TRX兑换USDT"},{text:"帮助"}]
],
bot = new TelegramBot(token, {polling: true});
if (mode=="main") {
    urlArray =apiURL[0];
    contractaddress_usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
    tronWeb = new TronWeb("https://api.trongrid.io", "https://api.trongrid.io", "https://api.trongrid.io", trxPrivateKey);
}else if(mode=="nile"){
    urlArray =apiURL[1];
    contractaddress_usdt = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";
    tronWeb = new TronWeb("https://api.nileex.io", "https://api.nileex.io", "https://api.nileex.io", trxPrivateKey);
}
getMin()
listenTRX(urlArray['trx']);
listenUSDT(urlArray['usdt']);

setInterval(function() {
    listenTRX(urlArray['trx']);
    listenUSDT(urlArray['usdt']);
},1000)

setInterval(function() {
    getMin()
},600000)

bot.on('text', (msg) => { 
    main(msg);
});

function getMin( ) {
    
    request(`https://vip-api.changenow.io/v1.3/exchange/estimate?fromCurrency=trx&fromNetwork=trx&fromAmount=1&toCurrency=usdt&toNetwork=trx&type=direct&promoCode=`)
    .then((body)=>{
        minCount_TRX = JSON.parse(body).summary.minAmount;
    })

    request(`https://vip-api.changenow.io/v1.3/exchange/estimate?fromCurrency=usdt&fromNetwork=trx&fromAmount=1&toCurrency=trx&toNetwork=trx&type=direct&promoCode=`)
    .then((body)=>{
        minCount_USDT = JSON.parse(body).summary.minAmount;
    })
}

function main(msg) {
    if(msg.text=="/start"){
        bot.sendMessage(msg.chat.id, `请选择业务`,{
            reply_markup: {
                keyboard: keyboard,
                resize_keyboard:true
            }
        });
    }

    if(msg.text=="USDT兑换TRX"){
        bot.sendMessage(msg.chat.id, `起兑数量：<b>${minCount_USDT} USDT</b>\n兑换地址：<code>${address}</code> (TRC-20网络)\n\n提示：兑换的数量请勿小于起兑数量`,{
            parse_mode: 'HTML',
            reply_to_message_id: msg.message_id
        });
    }

    if(msg.text=="TRX兑换USDT"){
        bot.sendMessage(msg.chat.id, `起兑数量：<b>${minCount_TRX} TRX</b>\n兑换地址：<code>${address}</code> (TRC-20网络)\n\n提示：兑换的数量请勿小于起兑数量`,{
            parse_mode: 'HTML',
            reply_to_message_id: msg.message_id
        });
    }

    if(msg.text=="帮助" || msg.text=="/help"){
        bot.sendMessage(msg.chat.id, `汇率实时变动，可使用“兑换金额”+trx或usdt查询\n人工客服：@byprogram`,{
            parse_mode: 'HTML',
            reply_to_message_id: msg.message_id
        });
    }

    if(msg.text.search("trx")!=-1 && !isNaN(Number(msg.text.split("trx")[0],10)) && msg.text.split("trx")[0]){
        if (Number(msg.text.split("trx")[0]<minCount_TRX)) {
            bot.sendMessage(msg.chat.id, `当前最小兑换数量为${minCount_TRX} TRX`,{
                parse_mode: 'HTML',
                reply_to_message_id: msg.message_id
            });
        } else {
            request(`https://vip-api.changenow.io/v1.3/exchange/estimate?fromCurrency=trx&fromNetwork=trx&fromAmount=${msg.text.split("trx")[0]}&toCurrency=usdt&toNetwork=trx&type=direct&promoCode=`)
            .then((body)=>{
                bot.sendMessage(msg.chat.id, `<b>${msg.text.split("trx")[0]} TRX ≈ ${JSON.parse(body).summary.estimatedAmount} USDT</b>`,{
                    parse_mode: 'HTML',
                    reply_to_message_id: msg.message_id
                });
            })
            .catch(e=>{
                bot.sendMessage(msg.chat.id, `trx兑换查询接口请求错误`,{
                    parse_mode: 'HTML',
                    reply_to_message_id: msg.message_id
                });
            })
        }
        
    }
 
    if(msg.text.search("usdt")!=-1 && !isNaN(Number(msg.text.split("usdt")[0],10)) && msg.text.split("usdt")[0]){
        if (Number(msg.text.split("usdt")[0]<minCount_USDT)) {
            bot.sendMessage(msg.chat.id, `当前最小兑换数量为${minCount_USDT} USDT`,{
                parse_mode: 'HTML',
                reply_to_message_id: msg.message_id
            });
        } else {
            request(`https://vip-api.changenow.io/v1.3/exchange/estimate?fromCurrency=usdt&fromNetwork=trx&fromAmount=${msg.text.split("usdt")[0]}&toCurrency=trx&toNetwork=trx&type=direct&promoCode=`)
            .then((body)=>{
                bot.sendMessage(msg.chat.id, `<b>${msg.text.split("usdt")[0]} USDT ≈ ${JSON.parse(body).summary.estimatedAmount} TRX</b>`,{
                    parse_mode: 'HTML',
                    reply_to_message_id: msg.message_id
                });
            })
            .catch(e=>{
                bot.sendMessage(msg.chat.id, `usdt兑换查询接口请求错误`,{
                    parse_mode: 'HTML',
                    reply_to_message_id: msg.message_id
                });
            })
        }
        
    }
    
}


 function listenTRX(trxurl) {
    var tornPayList;
    request(trxurl)
    .then((body)=>{
        tornPayList = JSON.parse(body).data;
        for (let a = 0; a < tornPayList.length; a++) {
            if (tornPayList[a].type=="Transfer" &&  tornPayList[a].raw_data.contract[0].parameter.value.amount/1000000>minCount_TRX && tornPayList[a].raw_data.timestamp+600000>Math.round(new Date())) {
                query(`SELECT * FROM exchange where from_transaction_id = "${tornPayList[a].txID}";`).then(result=>{
                    if (!result[0] && tornPayList[a].raw_data.contract[0].parameter.value.amount && tronWeb.address.fromHex(tornPayList[a].raw_data.contract[0].parameter.value.owner_address)!=address) {
                        query(`INSERT INTO exchange (from_amount,from_coin,from_transaction_id,from_address,to_coin,to_address,timestamp,time) VALUES ("${tornPayList[a].raw_data.contract[0].parameter.value.amount/1000000}","TRX","${tornPayList[a].txID}","${tronWeb.address.fromHex(tornPayList[a].raw_data.contract[0].parameter.value.owner_address)}","USDT","${address}",unix_timestamp(),now() );`)
                        .then(e=>{
                            request(`https://vip-api.changenow.io/v1.3/exchange/estimate?fromCurrency=trx&fromNetwork=trx&fromAmount=${tornPayList[a].raw_data.contract[0].parameter.value.amount/1000000}&toCurrency=usdt&toNetwork=trx&type=direct&promoCode=`)
                            .then((body)=>{
                                transferUSDT(tronWeb.address.fromHex(tornPayList[a].raw_data.contract[0].parameter.value.owner_address),JSON.parse(body).providers[0].estimatedAmount,tornPayList[a].txID) 
                            })
                            .catch(e=>{
                                console.log("listenTRX接口请求错误");
                            })
                        })
                        
                    }
                })
            }
        }
    })
}

function listenUSDT(usdturl) {
    var tornPayList;
    request(usdturl)
    .then((body)=>{
        tornPayList = JSON.parse(body).data;
        for (let a = 0; a < tornPayList.length; a++) {
            if (tornPayList[a].raw_data.contract[0].parameter.value.type=="TransferContract" && tornPayList[a].value/1000000>minCount_USDT && tornPayList[a].block_timestamp+600000>Math.round(new Date())) {
                query(`SELECT * FROM exchange where from_transaction_id = "${tornPayList[a].transaction_id}";`).then(result=>{
                    if (!result[0] && tornPayList[a].value && tornPayList[a].to==address && tornPayList[a].to!=tornPayList[a].from) {
                        query(`INSERT INTO exchange (from_amount,from_coin,from_transaction_id,from_address,to_coin,to_address,timestamp,time) VALUES ("${tornPayList[a].value/1000000}","USDT","${tornPayList[a].transaction_id}","${tornPayList[a].from}","TRX","${address}",unix_timestamp(),now() );`)
                        .then(e=>{
                            request(`https://vip-api.changenow.io/v1.3/exchange/estimate?fromCurrency=usdt&fromNetwork=trx&fromAmount=${tornPayList[a].value/1000000}&toCurrency=trx&toNetwork=trx&type=direct&promoCode=`)
                            .then((body)=>{
                                transferTRX(tornPayList[a].from,JSON.parse(body).providers[0].estimatedAmount,tornPayList[a].transaction_id) 
                            })
                            .catch(e=>{
                                console.log("listenUSDT接口请求错误");
                            })
                        })
                    }
                })
            }
        }
    })
    
}

function transferTRX(trx_address,amount,txID) {
    tronWeb.trx.sendTransaction(trx_address, parseInt(amount*1000000))
    .then(res=>{
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(`update exchange set to_transaction_id = "${res.txid}",to_amount = "${amount}" where from_transaction_id = "${txID}";`,(error, result)=> {
                if (error) throw error;
                connection.destroy();    
            });
        })
    })
    .catch(e=>{
        console.log(trx_address,e);
    })
}

async function transferUSDT(trx_address,amount,txID) {
    
    var {abi} = await tronWeb.trx.getContract(contractaddress_usdt);
    const contract = tronWeb.contract(abi.entrys, contractaddress_usdt);
    var hashid = await contract.methods.transfer(trx_address, amount*1000000).send();
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(`update exchange set to_transaction_id = "${hashid}",to_amount = "${amount}" where from_transaction_id = "${txID}";`,(error, result)=> {
            if (error) throw error;
            connection.destroy();    
        });
    })
}


function query( sql, values ) {
    return new Promise(( resolve, reject ) => {
      pool.getConnection(function(err, connection) {
        if (err) {
          reject( err )
        } else {
          connection.query(sql, values, ( err, rows) => {
  
            if ( err ) {
              reject( err )
            } else {
              resolve( rows )
            }
            connection.release()
          })
        }
      })
    })
  }
