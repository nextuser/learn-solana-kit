import {getMint,getAccount} from '@solana/spl-token'
import {Connection,PublicKey} from '@solana/web3.js'
import { getEndPoint } from 'client.ts'
const DEV_MINT_ADDR = 'FRKR4VKVZgHFpHwZDAnByetEknk4NJXqGrUAbJDkhYVZ'
async function getTokenMint(){
    const endPoint = getEndPoint('dev')
    const connection = new Connection(endPoint.rpcPoint)
    const mint = await getMint(connection, new PublicKey(DEV_MINT_ADDR))
    console.log("mint info: addr",mint.address,
        "decimals:", mint.decimals,
        "supply:", mint.supply,
        "authority:",mint.mintAuthority)

    //const token_account = getAccount(connection,)
}


getTokenMint()

