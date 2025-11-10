import {getClient} from './client.ts'
import {address} from '@solana/kit'

const Alice='3vxVdCH5n78RRqy65rmaxxtKvk5KdwkuY2eZK4cXCijU'
const token2022Addr = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
const tokenAddr     = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
const addr = Alice
async function test_get_account(){ 

    const client = getClient('local')
    const rsp = await client.rpc.getAccountInfo(address(addr)).send()

    console.log("account", addr, "info  ",rsp.value )
}


async function test_get_accounts(){ 

    const client = getClient('dev')
    const rsp = await client.rpc.getMultipleAccounts([address(Alice),address(token2022Addr),address(tokenAddr)]).send()
    for(let acc of rsp.value){
        if(!acc){
            console.log("null account")
            continue;
        }
        console.log("account info  ",acc.space,acc.lamports, acc.owner, acc.executable )
    }
}


test_get_accounts()