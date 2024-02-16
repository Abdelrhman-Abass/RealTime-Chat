"use client"

import { ButtonHTMLAttributes, FC, useState } from 'react'
import Button from './ui/Button'
import toast from 'react-hot-toast'
import { signOut } from 'next-auth/react'
import { Loader2, LogOut } from 'lucide-react'

interface SignOutButtonProps extends  ButtonHTMLAttributes<HTMLButtonElement>{
  
}

const SignOutButton: FC<SignOutButtonProps> = ({...props}) => {
    const [isSigningOut, setisSigningOut] = useState<Boolean>(false)
  return <Button {...props} variant='ghost' onClick={async ()=>{
    setisSigningOut(true)
    try {
        await signOut()
    } catch (error) {
        toast.error('there was a problem with signing out')
    }finally{
        setisSigningOut(false)
    }
  }}>
    {
        isSigningOut ? (

            <Loader2 className='animate-spin h-4  w-4'/>
        ):
        (
            <LogOut className='w-4 h-4'/>
        )
    }
  </Button>
}

export default SignOutButton