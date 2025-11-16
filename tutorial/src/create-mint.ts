import {getCreateAccountInstruction} from '@solana-program/system'
import { getMintSize } from '@solana-program/token'

import type {Client} from './client.ts'
import { TOKEN_PROGRAM_ADDRESS ,getInitializeMintInstruction} from '@solana-program/token';
import { KeyPairSigner, SendableTransaction, assertIsSendableTransaction, generateKeyPairSigner, getBase64EncodedWireTransaction, signAndSendTransactionMessageWithSigners, signTransactionMessageWithSigners } from '@solana/kit'

import {  getPlayground } from "client.ts";
import {
    appendTransactionMessageInstructions,
    appendTransactionMessageInstruction,
    createTransactionMessage,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    getSignatureFromTransaction
    
} from '@solana/kit';

import { estimateComputeUnitLimitFactory,getSetComputeUnitLimitInstruction } from '@solana-program/compute-budget';
export async function createMint( options:{decimals?:number} = {}){
    let pg = await getPlayground('local')
    let client = pg.client;
    let wallet = pg.wallet;
    let mintSize =  getMintSize();
    const mint  = await generateKeyPairSigner();
    console.log("token mint address:",mint.address)
    console.log("mintSize:",mintSize);
    const mintRent = await client.rpc.getMinimumBalanceForRentExemption(BigInt(mintSize)).send()
    const createAccountInstrction = getCreateAccountInstruction({
        payer : wallet,
        newAccount:mint,
        lamports:mintRent,
        space:mintSize,
        programAddress:TOKEN_PROGRAM_ADDRESS
    })

    const initialzeMintTx = getInitializeMintInstruction({
        mint:mint.address,
        decimals:options.decimals || 2,
        mintAuthority:wallet.address,
        freezeAuthority:wallet.address,
    })

    const balance = await client.rpc.getBalance(wallet.address).send()
    console.log(wallet.address,balance)

    const setComputeLimitIx = getSetComputeUnitLimitInstruction({
        units:500000
    })


    
    const { value:latestBlockhash} = await pg.client.rpc.getLatestBlockhash().send()
    const txMessage = await pipe(
        // createTransactionMessage({
        //     version:0
        // }),
        // (tx)=>setTransactionMessageFeePayerSigner(pg.wallet,tx),
        
        // (tx)=>setTransactionMessageLifetimeUsingBlockhash(latestBlockhash,tx),
        await client.createDefaultTransaction(pg.wallet),
        (tx) =>appendTransactionMessageInstructions([createAccountInstrction,initialzeMintTx],tx),
        (tx) => client.appendGasComputeInstructions(tx),
    );//end pipe

    const tx = await signTransactionMessageWithSigners(txMessage);
    // const signature = getSignatureFromTransaction(tx)
    // console.log('signature',signature);

    // const encodeTx = getBase64EncodedWireTransaction(tx);
    // let digest = await client.rpc.sendTransaction(encodeTx,{preflightCommitment:'confirmed', encoding:'base64'}).send()
    // console.log('digest',digest)
    const digest = await client.sendSignedTransaction(tx,'confirmed');
    console.log("tx digest:",digest);


}

createMint();