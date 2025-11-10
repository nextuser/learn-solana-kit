import { Rpc, SolanaRpcApi } from '@solana/kit';
// ---cut-before---
import {
    address,
    Address,
    assertAccountExists,
    fetchEncodedAccount,
    getAddressCodec,
    getBooleanCodec,
    getOptionCodec,
    getStructCodec,
    getU64Codec,
    getU32Codec,
    getU8Codec,    
    Option,
} from '@solana/kit';
import { getClient } from 'client.ts';
const rpc = getClient("dev").rpc;
const account = await fetchEncodedAccount(rpc, address('BsGbWPb4bJdYfy2fCJuEZDhnf5wjsxmRPPiHVXgwYZ3c'));
assertAccountExists(account);

const mintCodec = getStructCodec([
    ['mintAuthority', getOptionCodec(getAddressCodec(),{prefix:getU32Codec()})], // [simplified]
    ['supply', getU64Codec()],
    ['decimals', getU8Codec()],
    ['isInitialized', getBooleanCodec()],
    ['freezeAuthority', getOptionCodec(getAddressCodec(),{prefix:getU32Codec()})], // [simplified]
]);

const decodedData = mintCodec.decode(account.data);
decodedData satisfies {
    mintAuthority: Option<Address>;
    supply: bigint;
    decimals: number;
    isInitialized: boolean;
    freezeAuthority: Option<Address>;
};

console.log("\n --------decoded mint data----------\n",decodedData) 