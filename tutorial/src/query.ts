
import { getClient  } from 'client.ts'
async function test_query_trans(){
    const tx_digest = '5FdQH1uM3KHZJGyxip3q2o6aJTTC5h1kHEMsWGuwKkNXNvUuyHryKnyxunuzWVEPdRVYaJoXbKLtetHvzPmkTKYv';
    const client = getClient("dev");
    const tx = await client.rpc.getTransaction(tx_digest,{encoding:"json",maxSupportedTransactionVersion:0,commitment:"finalized"}).send();
    console.log("transaction info",tx)

    const hash = client.rpc.getLatestBlockhash().send().then(res=>console.log(res));
}


test_query_trans();