import{
    airdropFactory,
    createSolanaRpc,
    createSolanaRpcSubscriptions,
    generateKeyPairSigner,
    lamports,
} from '@solana/kit'

import { getClient} from './client.ts'

async function requestAirdrop(){
    let client = getClient("local")
    const airdrop = airdropFactory({
        rpc: client.rpc,
        rpcSubscriptions: client.rpcSubscriptions
    })
    const wallet = await generateKeyPairSigner();
    await airdrop({
        recipientAddress:wallet.address, 
        lamports:lamports(1000_000_000n),
        commitment:'confirmed'})
    const balance = await client.rpc.getBalance(wallet.address).send()
    console.log(wallet.address,balance)

}


requestAirdrop()