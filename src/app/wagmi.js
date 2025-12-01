import { http, createConfig } from 'wagmi'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import {  bscTestnet } from '@wagmi/core/chains'

// export const basechain = {
//   id: 8453,
//   name: 'Base Mainnet',
//   nativeCurrency: {
//       decimals: 18,  
//       name: 'ETH',
//       symbol: 'ETH',
//   },
//   rpcUrls: {
//       default: { http: ['https://mainnet.base.org'] },
//   },
//   blockExplorers: {
//       default: { name: 'basescan', url: 'https://basescan.org' },
//   },
//   testnet: true,
// };


export const config = createConfig({
  chains: [bscTestnet],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'BNBDOGINU' }),
    walletConnect({ projectId: "fe0b280c99ba43c32644fb8b84e7dc96" }),
  ],
  ssr: true,
  transports: {
    [bscTestnet.id]: http(),
  },
})

// declare module 'wagmi' {
//   interface Register {
//     config: typeof config
//   }
// }

