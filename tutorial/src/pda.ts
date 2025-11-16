import {
    Address,getAddressEncoder,getProgramDerivedAddress,address,
    padNullCharacters,
} from '@solana/kit'
import {
    getAssociatedTokenAddressSync
} from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js';

import {
    readKeypair,
    token2022Addr,tokenAddr
} from 'client.ts'

import * as nacl from 'tweetnacl'

function isOnCurve(publicKey:PublicKey) : boolean{
    try{
        
        return true;
    } catch(e  ){
        return false;
    }
}
/**
 * token account : pda  
```shell 
$ spl-token create-account FRKR4VKVZgHFpHwZDAnByetEknk4NJXqGrUAbJDkhYVZ
Creating account 69RbiuQCcXuURHYSQYU2KSSSS6VE6ZRXT6xKj9h2GRmt
```
 */
async function test_pda(){
    const programAddress = tokenAddr;
    const keypair = await readKeypair("first");
    const owner = keypair.publicKey.toBase58();
    const encoder = getAddressEncoder();
    //createToken.md  spl-token create-token
    const mint_addr = "FRKR4VKVZgHFpHwZDAnByetEknk4NJXqGrUAbJDkhYVZ"
    const seeds = [
        encoder.encode(address(owner)),
        encoder.encode(address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')),
        encoder.encode(address(mint_addr))
    ];
    const [pda,bump] = await getProgramDerivedAddress({
        programAddress:address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
        seeds,
    });
    console.log('pda' ,pda)
    console.log('bump' ,bump)




}

/**
 * 这个例子演示尝试创建PDA 地址， 因为PDA 地址不能在ed25519 curve上，因此seed要拼接一个bump，算出来一个地址，
 * 并且地址不能再Curve上，（避免和用户的地址冲突）
 * @param programId
 * @param seeds 
 * @returns 
 */
function try_find(programId:PublicKey, seeds:Array<Buffer|Uint8Array>) :[PublicKey|undefined, number]
{
    for(let bump = 255 ; bump >= 0; bump--){
        try{
            const pda = PublicKey.createProgramAddressSync(
                [...seeds
                ,Buffer.from([bump])
                ],
                programId);
            
            console.log("pda",pda.toBase58, "bump:" ,bump)
            return [pda,bump]
                
        } catch(err){
            console.log("error bump ",bump ,":",err)
        }
    }
    return [undefined ,0]
}

const ATA_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")

async function test_find(){
    const owner = '3vxVdCH5n78RRqy65rmaxxtKvk5KdwkuY2eZK4cXCijU';
    const mint_addr = "FRKR4VKVZgHFpHwZDAnByetEknk4NJXqGrUAbJDkhYVZ";
    const encoder = getAddressEncoder();
    const seeds = [
        new Uint8Array(encoder.encode(address(owner))),
        new Uint8Array(encoder.encode(address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'))),
        new Uint8Array(encoder.encode(address(mint_addr)))
    ];

    const [pda,bump] =  try_find(
        new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
        seeds,
    );
    console.log("try find result ",pda?.toBase58())

    const account = getAssociatedTokenAddressSync(new PublicKey(mint_addr), new PublicKey(owner))
    console.log("expected token account", account);
}

test_find();
