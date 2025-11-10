import { Address ,address,pipe
    ,createTransactionMessage
    ,setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    
} from "@solana/kit";
import { create } from "node:domain";

const setAget = <T extends object>(age:number,p:T) =>({...p, age})

const setWallet = <T extends object>(wallet:Address,p:T) =>({...p, wallet})

let person = {name :'Alice'}
const person2 = setAget(20,person)
const person3 = setWallet(address('3vxVdCH5n78RRqy65rmaxxtKvk5KdwkuY2eZK4cXCijU'),person2)

person3 satisfies {
    name: string;
    age: number;
    wallet: Address;
}

const person4 = pipe(
    {name:'Alice'},
    (p) =>setAget(20,p),
    (p)=>setWallet(address('3vxVdCH5n78RRqy65rmaxxtKvk5KdwkuY2eZK4cXCijU'),p)
    )

person4 satisfies {
    name: string;
    age: number;
    wallet: Address;
}




