import {getMint} from '@solana/spl-token'
import {Connection,PublicKey} from '@solana/web3.js'
import { getEndPoint } from 'client.ts'
const DEV_MINT_ADDR = 'BsGbWPb4bJdYfy2fCJuEZDhnf5wjsxmRPPiHVXgwYZ3c'
async function getTokenMint(){
    const endPoint = getEndPoint('dev')
    const connection = new Connection(endPoint.rpcPoint)
    const mint = await getMint(connection, new PublicKey(DEV_MINT_ADDR))
    console.log("mint info: addr",mint.address,
        "decimals:", mint.decimals,
        "supply:", mint.supply,
        "authority:",mint.mintAuthority)
}


getTokenMint()

