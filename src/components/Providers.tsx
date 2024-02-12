'use client'


import { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

interface ProvidersProps {
  children:ReactNode
}

const Providers: FC<ProvidersProps> = ({children}) => {
  return <>
    <Toaster 
      position='top-center' 
      reverseOrder={false} 
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          icon: '👏',

          style: {
            background: 'green',
          },
        },
        error: {
          style: {
            background: 'black',
          },
        },
    
      }}
    />
    {children}
  </>
}

export default Providers