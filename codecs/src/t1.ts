import type { Codec } from '@solana/codecs'
import {
    getU32Codec,
    getUtf8Codec,
    addCodecSizePrefix,
    getStructCodec
} from '@solana/codecs'


type Person = {name: string; age: number}

const getPersonCodec = ():Codec<Person> =>
    getStructCodec([
        ['name', addCodecSizePrefix(getUtf8Codec(),getU32Codec())],
        ['age', getU32Codec()]
    ])
const personCodec = getPersonCodec();
const person = {name: 'John', age: 30};
const encodePerson = personCodec.encode(person);
const decodePerson = personCodec.decode(encodePerson);
console.log("person:",person)
console.log("decodePerson:", decodePerson)