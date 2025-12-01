'use client'
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { FaExternalLinkAlt } from 'react-icons/fa';


function ConnectComponent() {
  const account = useAccount();
  const { connectors, connect, status } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div style={{height:"calc(100vh - 120px)"}} className=' flex flex-col items-center justify-center  '>
    <div className='flex flex-col  items-center justify-center p-4 bg-gray-100 rounded-2xl shadow-lg border border-gray-200 w-full max-w-sm mx-auto space-y-4 font-sans'>
      
      {/* Header and Close Button */}
      <div className='flex items-center justify-between w-full'>
        <h2 className='text-xl font-bold text-gray-800'>Connect Wallet</h2>
      </div>
      
      <div className='w-full space-y-3'>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className='flex items-center justify-between w-full p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 cursor-pointer'
            disabled={status === 'pending'}
          >
            <div className='flex items-center space-x-4'>
              <img 
                src={`/images/wallets/${connector.name.replace(/\s/g, '')}.png`}
                alt={`${connector.name} logo`}
                className='w-10 h-10 rounded-lg object-contain' 
              />
              <span className='text-lg font-semibold text-gray-800'>{connector.name}</span>
            </div>
            {status === 'pending' && <span className='text-gray-500 text-sm'>Connecting...</span>}
          </button>
        ))}
      </div>
      
      {/* Connected Account and Disconnect Button */}
      {account.status === 'connected' && (
        <div className='w-full space-y-3'>
          <div className='flex items-center justify-between w-full p-3 bg-green-50 rounded-xl border border-green-200'>
            <span className='text-sm text-green-700 font-medium'>
              Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </span>
            <a 
              href={`${account.chain?.blockExplorers?.default.url}/address/${account.address}`} 
              target='_blank' 
              rel='noopener noreferrer'
              className='text-green-500 hover:text-green-700 transition-colors duration-200'
            >
              <FaExternalLinkAlt className='w-4 h-4' />
            </a>
          </div>
          <button
            onClick={() => disconnect()}
            className='flex items-center justify-center w-full px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200'
          >
            Disconnect
          </button>
        </div>
      )}
      
      {/* Error Message */}
      {status === 'error' && (
        <div className='w-full text-center text-red-500 text-sm p-2 rounded-lg bg-red-50'>
          Failed to connect. Please try again.
        </div>
      )}
      
    </div>
    </div>

  );
}

export default ConnectComponent;
