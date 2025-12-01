
import { ethers } from "ethers";

const GOVERNANCE_CONTRACT  =  "0xAf27F663aB38Ae90b82Dd5e08E7a288D8835FC9d";
const USERBOOK_CONTRACT    =  "0x41dccCdF181556137e87254bffEfbCD58fEe7590";
const RWA_FACTORY_CONTRACT =  "0xcEAe16a89E42fb7Cad7fc47266ff3dF7605C3d46";
const USDT_CONTRACT 	     =  "0x6bbF61DF553BAE51fA18989A110645Abf7b75960";
const RESERVE_VAULT        =  "0x3DAb81793d07684c2f9416F406E90BB83C54Fd97";
const OPERATIONS_CONTRACT  =  "0x6805BBFc960e6D4535F54722c4Cd82416373254A";
const ESCROW_CONTRACT      =  "0xb3d57d10d3bdeaf4b3670134cc925116fbb8431d";


// ERC20 : 0x5d70FD5fd8f7D14709aa44C0C125a6442bEdF4d1
// ERC721 : 0x9d358AD833453fbC886e80ad815F844E8A0642F5
// ERC1155 : 0x717c9d727a8f4Ae2fDC97500F2cFC6b642d036fd

const toWei=(val)=>ethers.parseEther(val+"");

const toEth=(weiValue)=> { 
  return ethers.formatEther(weiValue+"");
}

const t2dt=(timestamp)=>{
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(); 
}

export { 
    GOVERNANCE_CONTRACT,
    USERBOOK_CONTRACT,
    RWA_FACTORY_CONTRACT,
    USDT_CONTRACT,
    RESERVE_VAULT,
    OPERATIONS_CONTRACT,
    ESCROW_CONTRACT,
    toWei,
    toEth,
    t2dt
};