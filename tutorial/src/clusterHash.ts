import web3 from '@solana/web3.js'
// 链接RPC
const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
// 获取租金豁免的最小余额；也就是账户中最少存在多少sol，可以免除账户租金
let minRent = await connection.getMinimumBalanceForRentExemption(0);
// 获取最新的区块hash
let blockhash = await connection
  .getLatestBlockhash()
console.log(blockhash)