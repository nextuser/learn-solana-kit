// import type {
//     SolanaRpcApi,
//     SolanaRpcSubscriptionsApi
// } from '@solana/kit'

import type{
    //RpcSubscriptions,
    Rpc,
    RpcSubscriptions
} from '@solana/kit'

import  {
    SolanaRpcApi,
    createSolanaRpc,
    SolanaRpcSubscriptionsApi,
    createSolanaRpcSubscriptions
    
} from '@solana/kit'
import * as dotenv from 'dotenv'

export type Client = {
     rpc:Rpc<SolanaRpcApi>;
     rpcSubscriptions:RpcSubscriptions<SolanaRpcSubscriptionsApi>;

}

let client:Client | undefined;

//const endPoint = 'https://api.mainnet-beta.solana.com';
//const wssPoint = 'wss://api.mainnet-beta.solana.com'
//https://devnet.helius-rpc.com/?api-key=8df9cdc2-6352-4f14-8d24-cd6b24ae7ae1
dotenv.config();
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
        clientMappling[env] = {
            rpc: createSolanaRpc(point.rpcPoint),
            rpcSubscriptions: createSolanaRpcSubscriptions(point.wssPoint)
        }
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

import {
    appendTransactionMessageInstruction,
    
} from '@solana/kit'
import { BaseTransactionMessage, TransactionMessageWithFeePayer } from '@solana/kit';

import {
    estimateComputeUnitLimitFactory,getSetComputeUnitLimitInstruction
} from '@solana-program/compute-budget'

type TransMessage =  BaseTransactionMessage & TransactionMessageWithFeePayer;
export function  estimateAndSetGas(...params: Parameters<typeof estimateComputeUnitLimitFactory> ){

        const estimate =  estimateComputeUnitLimitFactory(...params)
        
        return async <T extends TransMessage> (transactionMessage:T)=>{
            const cu = await  estimate(transactionMessage)
            return appendTransactionMessageInstruction(
                                    getSetComputeUnitLimitInstruction({ units: cu}),
                                    transactionMessage);
        }
}


//const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });