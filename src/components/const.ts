import { Connection, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import { Wallet } from '@project-serum/anchor';




const PROGRAM_ID = new PublicKey("aUW7zdmxR1BTNa59QeBY5s7TsGxe6cYqmhu8HFW2oS7");
const POOL_TOKEN_ACCOUNT = new PublicKey("GsLMKbKAQx2JfcjiSLGBqUkc7CHA9RDw1wNFCFhJSKtR");
const NFT_COLLECTION_ID = new PublicKey("E3d2trTaNHmduutXQzd521AiyycnKhZXCkJVApGsHbpe");


 const [configAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from('config')],
    PROGRAM_ID
  );
 
  const mint= new PublicKey("chAZFTpRrSj4nbygm5ZgqoPD5GffDwMCv4iKXhZ2X9f")
  
  const[stakingPool] = PublicKey.findProgramAddressSync(
      [Buffer.from('staking_pool'), mint.toBuffer()],
      PROGRAM_ID
    );
 
    const [stakingRewardAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('staking_reward'),mint.toBuffer()],
      PROGRAM_ID
    );




const network =  clusterApiUrl('devnet'); //"https://go.getblock.io/4136d34f90a6488b84214ae26f0ed5f4";


const getConfig = (wallet:Wallet | null) => {
    const connection = new Connection(network);
     const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });
    return {provider, connection};
  };






export { 
    PROGRAM_ID, 
    mint, 
    stakingPool, 
    POOL_TOKEN_ACCOUNT, 
    configAccount,
    stakingRewardAccount,
    getConfig, 
    NFT_COLLECTION_ID

};