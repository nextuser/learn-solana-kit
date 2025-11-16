import { getAddMemoInstruction } from "@solana-program/memo";
import { getTransferSolInstruction } from "@solana-program/system";
import { PublicKey } from "@solana/web3.js";
import { readKeypair,getClient, getKeyFilePath } from "client.ts";
import {
    address, 
    createTransaction,
    getSignatureFromTransaction,
    signTransactionMessageWithSigners,
    sendAndConfirmTransactionFactory,
    createSolanaClient,
    

} from 'gill' 
import { loadKeypairFromFile,loadKeypairSignerFromFile } from "gill/node";    
async function test_trans_memo(){
    const client = getClient("dev");
    const signer = await loadKeypairSignerFromFile(getKeyFilePath('first'))
    const {value : blockHash} = await client.rpc.getLatestBlockhash().send();
    const tx = createTransaction({
        version:"legacy",
        feePayer:signer,
        instructions:[
            getAddMemoInstruction({
                memo:"gm world"
            }),
        ],
        latestBlockhash:blockHash,
    })
    const signedTx = await signTransactionMessageWithSigners(tx);

    const signature = getSignatureFromTransaction(signedTx)

    const { rpc, sendAndConfirmTransaction } = createSolanaClient({
        urlOrMoniker: `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
    });

    console.log("send transaction",signature);
    sendAndConfirmTransaction(signedTx);
}



async function test_trans_sol(){
    const client = getClient("dev");
    const sender = await loadKeypairSignerFromFile(getKeyFilePath('first'))
    const target = await readKeypair('second');
    const {value : blockHash} = await client.rpc.getLatestBlockhash().send();
    const transferInstruction = getTransferSolInstruction(
        {
            source: sender,
            destination: address(target.publicKey.toBase58()),
            amount : 1000_000_000,
        
        }
    )

    const tx = createTransaction({
        version:"legacy",
        feePayer:sender,
        instructions:[
            getAddMemoInstruction({
                memo:"transfer sol"
            }),
            transferInstruction
        ],
        latestBlockhash:blockHash,
    })
    const signedTx = await signTransactionMessageWithSigners(tx);

    const signature = getSignatureFromTransaction(signedTx)
    
    const { rpc, sendAndConfirmTransaction } = createSolanaClient({
        urlOrMoniker: `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
    });

    console.log("before trans balance of ", sender.address, await rpc.getBalance(sender.address).send());
    await sendAndConfirmTransaction(signedTx,{commitment:"confirmed"});

    console.log("after trans balance of ", sender.address, await rpc.getBalance(sender.address).send());


    console.log("send transaction",signature);
    
}


test_trans_sol();