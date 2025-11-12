async function genKeyPair() {
    const keyPair = await crypto.subtle.generateKey({name:'ED25519'},false,['sign','verify'])
    return keyPair
}
async function getDb(){
    

    const db = await new Promise<IDBDatabase>((resolve, reject) => { 
        const request = indexedDB.open('mydb', 1);
        request.onupgradeneeded = function(event) {
            const db = (event.target as IDBOpenDBRequest).result;
            db.createObjectStore('MyKeypPairStore');
        };
        request.onsuccess = function(event) {
            resolve((event.target as IDBOpenDBRequest).result);
        };
        request.onerror = function(event) {
            reject(event.target);
        };
    })
    return db;
}

async function generateStoreKey(db:IDBDatabase){

    const keyPair = await genKeyPair();
    console.log("gen keypair",keyPair)
    const transaction = db.transaction('MyKeypPirStore','readwrite');
    const store = transaction.objectStore('MyKeypPairStore');
    await new Promise<void>((resolve, reject) => { 
        const request =  store.put(keyPair,'MyKey');
        if(request.result){
            resolve()
        } else{
            reject(new Error('key not found'))
        }
    })

}

async function readKeypair(db:IDBDatabase){
    const transaction = db.transaction('MyKeypPirStore','readonly');
    const store = transaction.objectStore('MyKeypPairStore');
    return await new Promise<CryptoKeyPair>((resolve, reject) => { 
        const request =  store.get('MyKey');
        request.onsuccess = ()=>{
            if(request.result){
                resolve(request.result as CryptoKeyPair)
            } else{
                reject(new Error('key not found'))
            }
        };
        request.onerror = ()=> reject(request.error);
    })
    
}

async function test(){
    const db = await getDb()
    await generateStoreKey(db)
    const keypair = await readKeypair(db)
    console.log("keypair of",keypair.publicKey)
}


test()