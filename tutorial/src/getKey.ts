import { generateKeyPair } from "@solana/kit";
import { generateKeyPairSigner } from "@solana/kit";
import { sign } from "crypto";
import { useWalletAccountTransactionSendingSigner } from "@solana/react";
async function genKey(){
    const wallet :CryptoKeyPair = await generateKeyPair();
    console.log(wallet.publicKey);
    console.log(wallet.privateKey);

    let signer = generateKeyPairSigner();
    console.log((await signer).address)

    //const wallet2 = useWalletAccountTransactionSendingSigner()

}

genKey();
