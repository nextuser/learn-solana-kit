import {getTransferSolInstruction,} from '@solana-program/system'
import { getAddMemoInstruction } from '@solana-program/memo'
import { createTransactionMessage,
        pipe,
        generateKeyPairSigner, 
        setTransactionMessageFeePayerSigner, 
        setTransactionMessageLifetimeUsingBlockhash,
        appendTransactionMessageInstruction,
        signTransactionMessageWithSigners,
        getSignatureFromTransaction,
        getBase64EncodedWireTransaction,
        BaseSignerConfig
    } from '@solana/kit'
import { getClient, readSigner } from 'client.ts';

import { readKeypair } from 'client.ts';
import { lamports } from '@solana/kit';
async function testTrans(){
    const signer = await readSigner("first");
    const dest = await readSigner("second");
    const client = getClient("dev")
    // await client.airdrop(dest.address,1000_000_000n);
    // await client.airdrop(signer.address,1000_000_000n);
    const result = await client.rpc.getLatestBlockhash().send();

    const transactionMessage = await pipe(
        createTransactionMessage({version:0}),
        (m) => setTransactionMessageFeePayerSigner(signer, m),
        (m) =>setTransactionMessageLifetimeUsingBlockhash(result.value, m),
        (m) => appendTransactionMessageInstruction(
            getAddMemoInstruction({ memo:"this is some memo from charles"}),
            m
        ),
        (m) => appendTransactionMessageInstruction(
            getTransferSolInstruction({
                destination:dest.address,
                amount:lamports(1n),
                source:signer,
            }),
            m
        ),
        (m) => client.getAppendGasComputeInstructions()(m)
    )

    const signedTransction = await signTransactionMessageWithSigners(transactionMessage);
    const txSignature = getSignatureFromTransaction(signedTransction);
    console.log("signature: txSignature")

    const encodeTx = getBase64EncodedWireTransaction(signedTransction);
    let digest = await client.rpc.sendTransaction(encodeTx,{preflightCommitment:'confirmed', encoding:'base64'}).send()
    console.log('tx.digest:',digest)

}


testTrans()