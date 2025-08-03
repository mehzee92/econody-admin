"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import useUserStore from '@/stores/userStore'
import { adminLogout, checkToken } from "@/components/utils";


function AdminHeader() {

  const { isLoggedIn, logout, getFreshToken } = useUserStore();

  return (
   <div className=" flex justify-between py-5 px-5 shadow-sm  items-center w-full ">
        
        <Link href="/" className="flex items-center  sm:justify-start space-x-2">
          <Image
            src="/images/logo.png"
            alt="Econody Logo"
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
          />
          <span className="text-xl Font1 font-bold tracking-wide text-gray-900">
            ECONODY
          </span>
        </Link>
      
      

        <div className=' flex'>


          { isLoggedIn && (
              <button   
                onClick={getFreshToken}
                className='font-bold mx-3 hidden text-black md:block'>Refresh Token</button>
            )
          }


          { isLoggedIn && (
              <button   
                onClick={()=>{ adminLogout(); logout();  }}
                className='font-bold hidden mx-3 text-black md:block'>Log out</button>
            )
          }
          



        </div>
      </div>
  )
}

export default AdminHeader
