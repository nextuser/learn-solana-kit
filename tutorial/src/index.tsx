import {address} from '@solana/kit';
import {createClient} from './client.ts';
const token2022Addr = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
const tokenAddr = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
const LAMPORTS_PER_SOL = 1_000_000_000;
async function tutorial(){
    const client = createClient();
    const account = address(token2022Addr)
    const {value:balance} = await client.rpc.getBalance(account).send();
    const val = balance.valueOf();
    const v = Number(val) /LAMPORTS_PER_SOL
    console.log(`balance : ${v} lamports`)
    const slotNotifications = await client.rpcSubscriptions
        .slotNotifications()
        .subscribe({ abortSignal: AbortSignal.timeout(10_000) });
    for await (const slotNotification of slotNotifications) {
        console.log('The network has advanced to slot', slotNotification.slot);
    }
    
}

tutorial();