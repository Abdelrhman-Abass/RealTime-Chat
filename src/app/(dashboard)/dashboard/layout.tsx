import { authOption } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import profile from  '/public/profile-placeholder.jpg'

import { ReactNode} from 'react'
import { Icons ,Icon } from '@/components/Icons'
import SignOutButton from '@/components/SignOutButton'
import FriendRequestSidebarOption from '@/components/FriendRequestSidebarOption'
import { fetchRedis } from '@/helpers/redis'

interface LayoutProps {
  children:ReactNode
}
interface SidebarOption{
    id: number,
    name:string,
    href:string,  
    Icon:Icon
}

const sidebarOptions : SidebarOption[] =[
    {
        id:1,
        name: 'Add friend',
        href: '/dashboard/add',
        Icon: 'UserPlus'
    }
]

const layout = async ({children} :LayoutProps) => {
    const session = await getServerSession(authOption)
    if(!session){
        notFound()
    }

    const unseenRequestCount = (
        (await fetchRedis(
          'smembers',
          `user:${session.user.id}:incoming_friend_requests`
        )) as User[]
      ).length


    return ( 
    <div className='w-full flex h-screen'>
        <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 border-gray-200 overflow-y-auto border-r bg-white px-6">
            <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
                <Icons.Logo className='h-8 w-auto text-indigo-600' />
            </Link>

            <div className="text-xs font-semibold leading-6 text-gray-400">Your Chats</div>

            <nav className='flex flex-col flex-1 '>
                <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                    <li>
                        / chats this user have
                    </li>
                    <li>
                        <div className='text-xs font-semibold leading-6 text-gray-400 '>
                            overview
                        </div>

                        <ul role='list' className='-mx-2 mt-2 space-y-1'>
                            {
                                sidebarOptions.map((option)=>{
                                    const Icon = Icons[option.Icon]
                                    return (
                                        <li key={option.id}>
                                            <Link href={option.href} className='text-gray-700 hover:text-indigo-600 hover:bg-gray-200 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                                                <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                                                    <Icon className='h-4 w-4' />
                                                </span>
                                                <span className='truncate'>{option.name}</span>
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </li>

                    <li>
                        <FriendRequestSidebarOption sessionId={session.user.id} initialUnseenRequestCount={unseenRequestCount} />
                    </li>

                    <li className='-mx-6 mt-auto flex items-center'>
                        <div className="flex items-center flex-1 gap-x-4 px-6 text-sm font-semibold  py-3 leading-6 text-gray-900">
                            <div className='relative  h-8 w-8 bg-gray-300'>
                                <Image 
                                    fill 
                                    referrerPolicy = 'no-referrer'
                                    className='rounded-full'
                                    src={profile || session.user.image }
                                    alt ='your profile picture'
                                    />
                            </div>
                            <span className='sr-only'>Your Profile</span>
                            <div className='flex flex-col'>
                                <span aria-hidden='true'>{session.user.name}</span>
                                <span className="text-xs truncate text-zinc-400" aria-hidden='true'>
                                    {session.user.email}
                                </span>
                            </div>
                        </div>

                        <SignOutButton className='h-full aspect-square'/>
                    </li>
                </ul>
            </nav>
        </div>
        
        {children}

    </div>
)}

export default layout