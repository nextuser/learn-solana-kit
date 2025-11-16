import { getClient ,getEndPoint,readKeypair} from "client.ts";
import { Connection,AddressLookupTableProgram,PublicKey } from "@solana/web3.js";
const client = getClient("dev")
const endPoint = getEndPoint("dev")
const connection = new Connection(endPoint.rpcPoint)

async function lookupTableTest(){


    const first = await readKeypair("first");
    const second = await readKeypair("second");
    const slot = await connection.getSlot();
    console.log("slot:",slot)

    const [lookupTableInst,lookupTableAddress] = 
    AddressLookupTableProgram.createLookupTable({
    authority: first.publicKey,
    payer: first.publicKey,
    recentSlot: slot,
    });

    console.log("lookup table address:",lookupTableAddress.toBase58())

    // const extendInstruction = AddressLookupTableProgram.extendLookupTable({
    // payer:first.publicKey,
    // authority : first.publicKey,
    // lookupTable: lookupTableAddress,
    // addresses: [
    //     second.publicKey
    // ]
    // });

    return lookupTableAddress.toBase58()
}

async function queryTable(tableAddr : string){
    console.log("query table",tableAddr)
    const lookupTableAddress = new PublicKey(tableAddr)

    const lookupTableAccount = (await connection.getAddressLookupTable(lookupTableAddress)).value;
    console.log("table address from cluster:", lookupTableAccount)

}

const addr = lookupTableTest().then((addr)=>{
    queryTable(addr)
})



