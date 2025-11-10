import {
    getPlayground
} from './client.ts'

async function test(){
    let pg = await getPlayground('local')
    let balance = await pg.client.rpc.getBalance(pg.wallet.address).send()
    console.log(balance)
}

test();