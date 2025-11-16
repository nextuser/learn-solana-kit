// import type {
//     SolanaRpcApi,
//     SolanaRpcSubscriptionsApi
// } from '@solana/kit'
import * as dotenv from 'dotenv'
import type{
    //RpcSubscriptions,
    Rpc,
    RpcSubscriptions} from '@solana/kit'
import {
    SolanaRpcApi,
    createSolanaRpc,
    SolanaRpcSubscriptionsApi,
    createSolanaRpcSubscriptions,
    Address,
    appendTransactionMessageInstruction,
    sendAndConfirmTransactionFactory,
    Transaction,SendableTransaction,
    TransactionMessage,
    TransactionMessageWithFeePayer,
    Instruction,
    BaseTransactionMessage,
    pipe,
    createTransactionMessage,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    
} from '@solana/kit'



import {
    estimateComputeUnitLimitFactory,getSetComputeUnitLimitInstruction
} from '@solana-program/compute-budget'

import path from 'path'
import { Keypair } from "@solana/web3.js";
import { KeyPairSigner} from '@solana/signers'
import { createKeyPairSignerFromPrivateKeyBytes ,createKeyPairSignerFromBytes} from '@solana/kit';
import fs from 'fs'
dotenv.config()
if(!process.env.HELIUS_API_KEY){
    console.error("export HELIUS_API_KEY first")
}

export const token2022Addr = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
export const tokenAddr     = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'

type FactoryReturnType = ReturnType<typeof sendAndConfirmTransactionFactory>;
type SendAndConfirmTransactionParamType  = Parameters<FactoryReturnType >

export class Client {
      rpc:Rpc<SolanaRpcApi>;
      rpcSubscriptions:RpcSubscriptions<SolanaRpcSubscriptionsApi>;
      

      private airdropFunction : ReturnType<typeof airdropFactory>;
     constructor(rpc:Rpc<SolanaRpcApi>, rpcSubscriptions:RpcSubscriptions<SolanaRpcSubscriptionsApi>){
        this.rpc = rpc
        this.rpcSubscriptions = rpcSubscriptions
        this.airdropFunction = airdropFactory({
            rpc: this.rpc,
            rpcSubscriptions: this.rpcSubscriptions
        })
        
     };


    // getAppendGasComputeInstructions(){

    //         const estimate = estimateComputeUnitLimitFactory({rpc:this.rpc})
            
    //         return async <T extends BaseTransactionMessage & TransactionMessageWithFeePayer > (transactionMessage:T)=>{
    //             const cu = await  estimate(transactionMessage)
    //             return appendTransactionMessageInstruction(
    //                                     getSetComputeUnitLimitInstruction({ units: cu}),
    //                                     transactionMessage);
    //         }
    // }
    async appendGasComputeInstructions(transactionMessage:BaseTransactionMessage & TransactionMessageWithFeePayer){

            const estimate = estimateComputeUnitLimitFactory({rpc:this.rpc})
            const cu = await  estimate(transactionMessage);
            return appendTransactionMessageInstruction(
                                        getSetComputeUnitLimitInstruction({ units: cu}),
                                        transactionMessage);

    }



    /**
     *  client.sendAndConfirmTranaction(transaction, { commitment: 'confirmed' })
     * @param params 
     */
    sendAndConfirmTransaction(... params:SendAndConfirmTransactionParamType  ){
        const sendAndConfirm = sendAndConfirmTransactionFactory({ rpc: this.rpc, rpcSubscriptions: this.rpcSubscriptions });
        return sendAndConfirm(...params)
    }


    async createDefaultTransaction (
        feePayer: TransactionSigner
        )
    {
        const { value: latestBlockhash } = await this.rpc
            .getLatestBlockhash()
            .send();
        return pipe(
            createTransactionMessage({ version: 0 }),
            (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
            (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx)
        );
    };  

     async  airdrop(addr:Address,lamports_number:bigint){

        await this.airdropFunction({
                recipientAddress:addr, 
                lamports:lamports(lamports_number),
                commitment:'confirmed'})
     }

}

let client:Client | undefined;

//const endPoint = 'https://api.mainnet-beta.solana.com';
//const wssPoint = 'wss://api.mainnet-beta.solana.com'
//https://devnet.helius-rpc.com/?api-key=8df9cdc2-6352-4f14-8d24-cd6b24ae7ae1
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

export type EndPoints = {
    rpcPoint:string;
    wssPoint:string;
}

const devPoint : EndPoints = {
    rpcPoint: `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
    wssPoint: `wss://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
}

const mainPoint : EndPoints = {
    rpcPoint: `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
    wssPoint: `wss://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
}

const localPoint : EndPoints = {
    rpcPoint: `http://localhost:8899`,
    wssPoint: `ws://localhost:8900/`
}

const pintMapping = {
    dev: devPoint,
    main: mainPoint,
    local: localPoint
}

type ClientMapping ={
    dev:Client | undefined,
    main:Client | undefined,
    local:Client | undefined,
}

type EnvType = 'dev'|'local'|'main'

export function getEndPoint(env : EnvType) : EndPoints{
    return pintMapping[env]
}
const clientMappling:ClientMapping = {
    dev: undefined,
    main: undefined,
    local: undefined
}

const points = mainPoint;

//const devePoint = 'https://api.devnet.solana.com'
export function createClient():Client {
    return getClient("dev")
}


export  function getClient(env : EnvType) : Client{
    if(!clientMappling[env]){
        let point = pintMapping[env]
        const rpc = createSolanaRpc(point.rpcPoint);
        const rpcSubscriptions = createSolanaRpcSubscriptions(point.wssPoint);
        clientMappling[env] = new Client( rpc, rpcSubscriptions);
    } 
    

    return clientMappling[env];
}
import { TransactionSigner,
        MessageSigner,
        airdropFactory,
        generateKeyPairSigner,
        lamports } from '@solana/kit';
export type Playground = {
    client:Client,
    wallet:TransactionSigner & MessageSigner,
    
}
export async function getPlayground(env : 'dev'|'local'|'main') :Promise<Playground>{
    let client = getClient(env)
    let airdrop = airdropFactory({
        rpc: client.rpc,
        rpcSubscriptions: client.rpcSubscriptions
    })
    let wallet = await generateKeyPairSigner();
    await airdrop({
        recipientAddress:wallet.address, 
        lamports:lamports(1000_000_000n),
        commitment:'confirmed'})
    return {
        client,
        wallet
    }
}

export  function getKeyFilePath(user:string){
    return path.resolve(process.env.HOME??"~/" ,`.config/solana/${user}.json`)
}
export async function readKeypair(user:string = "id"):Promise<Keypair>{
    const keyContent = fs.readFileSync(getKeyFilePath(user));
    const keyBytes = new Uint8Array(JSON.parse(keyContent.toString()));
    const keypair = Keypair.fromSecretKey(keyBytes);
    console.log("red address:",keypair.publicKey.toBase58(),'for user:',user);
    return keypair;
}

export async function readSigner(user:string = "id"):Promise<KeyPairSigner>{
    const keypair = await readKeypair(user);
    //console.log("skey length",keypair.secretKey.length)
    ////console.log(keypair)
    return await createKeyPairSignerFromPrivateKeyBytes(keypair.secretKey.slice(0,32), true);
}


export async function oldReadSigner(keyContent : string){
        const keyBytes = new Uint8Array(JSON.parse(keyContent));
        const signer = await createKeyPairSignerFromBytes(keyBytes);
        const keypair = Keypair.fromSecretKey(keyBytes);
        console.log("address:",keypair.publicKey.toBase58());
}



//const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });