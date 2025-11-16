import { createSignableMessage,address,
     createTransactionMessage, generateKeyPairSigner, setTransactionMessageFeePayerSigner,pipe, signTransactionMessageWithSigners, MessageModifyingSigner, 
     SignableMessage,
     getUtf8Encoder} from "@solana/kit";
import { createSign } from "crypto";

const mySigner = await generateKeyPairSigner();
console.log(mySigner.address);

const myMessage = createSignableMessage("a message to sign");
const [msgSignature] = await mySigner.signMessages([myMessage]);

const myTxMessage = pipe(
    createTransactionMessage({version:0}),
    (m) =>setTransactionMessageFeePayerSigner(mySigner, m),
)

const tx = await signTransactionMessageWithSigners(myTxMessage);
console.log(tx);

import { createSignerFromKeyPair,generateKeyPair,KeyPairSigner,
    createKeyPairSignerFromBytes

 } from '@solana/kit'
import fs from 'fs'
async function testKey(){
    const myKeypair :CryptoKeyPair = await generateKeyPair();
    const myKeySigner = await createSignerFromKeyPair(myKeypair);


}

import dotenv from 'dotenv'
import path from 'path'
import { Keypair } from "@solana/web3.js";
dotenv.config()
async function readKey(){
    const keyContent =fs.readFileSync(path.resolve(process.env.HOME??"~/" ,".config/solana/id.json"));
    const keyBytes = new Uint8Array(JSON.parse(keyContent.toString()));
    const signer = await createKeyPairSignerFromBytes(keyBytes);
    const keypair = Keypair.fromSecretKey(keyBytes);
    console.log("address:",keypair.publicKey.toBase58());
}


   import { createKeyPairSignerFromPrivateKeyBytes } from '@solana/kit';
async function createSingerFromBytes(){
    const message = getUtf8Encoder().encode("this is a bad password");
    const seed = new Uint8Array(await crypto.subtle.digest("SHA-256",new Uint8Array(message)))
    const deriveSigner = await createKeyPairSignerFromPrivateKeyBytes(seed);
}



async function old(){
    const message = getUtf8Encoder().encode('Hello, World!');
    //const seed = new Uint8Array(await crypto.subtle.digest('SHA-256', message));
    const seed = new Uint8Array(await crypto.subtle.digest('SHA-256', new Uint8Array(message)));

    const derivedSigner = await createKeyPairSignerFromPrivateKeyBytes(seed);

    const s = await derivedSigner.signMessages([ createSignableMessage("dodo")]);
    console.log("old sign",s);
}
readKey();
old()

async function test_generate(){
    const keypair = await crypto.subtle.generateKey({name:'ED25519'},false,['sign','verify'])
    console.log("keypair",keypair)
    //console.log(keypair.publicKey.toBase58())
}

test_generate()


