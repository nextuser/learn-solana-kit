import {
    address,
    fetchEncodedAccount,
    fetchEncodedAccounts,
    getAddressCodec,
    getOptionCodec,
    getStructCodec,
    getU64Codec,
    getU8Codec,
    getBooleanCodec,
    MaybeAccount,
    MaybeEncodedAccount,
    assertAccountExists,
    Address,
    getPublicKeyFromAddress,    
    getArrayCodec,
    getBitArrayCodec, Option ,
    getU32Codec,
   
} from '@solana/kit'
import bs58 from 'bs58'
//import { base58 }from '@solana/codecs-strings'



import { getClient } from 'client.ts'
const Alice='3vxVdCH5n78RRqy65rmaxxtKvk5KdwkuY2eZK4cXCijU'
const token2022Addr = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
const tokenAddr     = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'




async function test(){
    const client = getClient('dev')
    const account = await fetchEncodedAccount(client.rpc, address(Alice))
    const accounts = await fetchEncodedAccounts(client.rpc,[address(Alice),address(token2022Addr),address(tokenAddr)])

    account satisfies MaybeEncodedAccount
    accounts satisfies MaybeEncodedAccount[]

}

/**
 * pub struct Mint {
    /// Optional authority used to mint new tokens. The mint authority may only
    /// be provided during mint creation. If no mint authority is present
    /// then the mint has a fixed supply and no further tokens may be
    /// minted.
    pub mint_authority: COption<Pubkey>,
    /// Total supply of tokens.
    pub supply: u64,
    /// Number of base 10 digits to the right of the decimal place.
    pub decimals: u8,
    /// Is `true` if this structure has been initialized
    pub is_initialized: bool,
    /// Optional authority to freeze token accounts.
    pub freeze_authority: COption<Pubkey>,
}
 */
async function testMintCoder(){
    const LOCAL_MINT_ADDR = '5Yu6szmWwDTD1KBuVzCLK65Z1JFpQgoDm2RAfRDwKawM'
    const DEV_MINT_ADDR = 'BsGbWPb4bJdYfy2fCJuEZDhnf5wjsxmRPPiHVXgwYZ3c'
    const MINT_ADDR = DEV_MINT_ADDR
    const client = getClient('dev')
    const mint_account = await fetchEncodedAccount(client.rpc, address(MINT_ADDR))
    
    assertAccountExists(mint_account)

    console.log("mint",mint_account.lamports,mint_account.address,mint_account.programAddress,mint_account.space);
    console.log("\n --------encoded mint data----------\n",mint_account.data)

    // const mintCodec = getStructCodec([
    //     ['mintAuthority',getOptionCodec(getAddressCodec(),{prefix:getU32Codec()})],
    //     ['supply',getU64Codec()],
    //     ['decimals',getU8Codec()],
    //     ['isInitialized',getBooleanCodec()],
    //     ['freezeAuthority',getOptionCodec(getAddressCodec(),{prefix:getU32Codec()})]

    // ])

    const mintCodec = getStructCodec([
    ['mintAuthority', getOptionCodec(getAddressCodec(),{prefix:getU32Codec()})], // [simplified]
    ['supply', getU64Codec()],
    ['decimals', getU8Codec()],
    ['isInitialized', getBooleanCodec()],
    ['freezeAuthority', getOptionCodec(getAddressCodec(),{prefix:getU32Codec()})], // [simplified]
    ]);


    const decodeData = mintCodec.decode(mint_account.data);

    console.log("\n---------------  data:\n",decodeData)
    
    let value = decodeData.mintAuthority

    decodeData satisfies {
        mintAuthority: Option<Address>;
        supply: bigint;
        decimals: number;
        isInitialized: boolean;
        freezeAuthority: Option<Address>;

    }
    
    console.log("\n---------------decoded mint data:\n",decodeData.mintAuthority)
    let mintAuthority = decodeData.mintAuthority;
    if(mintAuthority.__option == 'Some'){
        let value = mintAuthority.value
        console.log("authority:",mintAuthority.value)
    }
}

   


testMintCoder()
