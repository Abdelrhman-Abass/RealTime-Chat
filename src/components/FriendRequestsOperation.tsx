"use client"

import axios from 'axios'
import { UserPlus ,Check ,X} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

interface FriendRequestsOperationProps {
  incomingFriendRequest:IncomingFriendRequest[],
  sessionId:string,
}

const FriendRequestsOperation: FC<FriendRequestsOperationProps> = ({incomingFriendRequest , sessionId}) => {
    const router = useRouter()
    const [friendRequests , setFriendRequests ] = useState<IncomingFriendRequest[]>(incomingFriendRequest)
    
    // useEffect(() => {
    //     pusherClient.subscribe(
    //       toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    //     )
    //     console.log("listening to ", `user:${sessionId}:incoming_friend_requests`)
    
    //     const friendRequestHandler = ({
    //       senderId,
    //       senderEmail,
    //     }: IncomingFriendRequest) => {
    //       console.log("function got called")
    //       setFriendRequests((prev) => [...prev, { senderId, senderEmail }])
    //     }
    
    //     pusherClient.bind('incoming_friend_requests', friendRequestHandler)
    
    //     return () => {
    //       pusherClient.unsubscribe(
    //         toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    //       )
    //       pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
    //     }
    //   }, [sessionId])
    
      const acceptFriend = async (senderId: string) => {
        await axios.post('/api/requests/accept', { id: senderId })
    
        setFriendRequests((prev) =>
          prev.filter((request) => request.senderId !== senderId)
        )
    
        router.refresh()
      }
    
      const denyFriend = async (senderId: string) => {
        await axios.post('/api/requests/deny', { id: senderId })
    
        setFriendRequests((prev) =>
          prev.filter((request) => request.senderId !== senderId)
        )
    
        router.refresh()
      }
    
  return <>
        {friendRequests.length === 0 ? (
            <p className='text-sm text-zinc-500'>Nothing to show here...</p>
        ) : (
            friendRequests.map((request) => (
            <div key={request.senderId} className='flex gap-4 items-center'>
                <UserPlus className='text-black' />
                <p className='font-medium text-lg'>{request.senderEmail}</p>
                <button
                onClick={() => acceptFriend(request.senderId)}
                aria-label='accept friend'
                className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
                <Check className='font-semibold text-white w-3/4 h-3/4' />
                </button>

                <button
                onClick={() => denyFriend(request.senderId)}
                aria-label='deny friend'
                className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
                <X className='font-semibold text-white w-3/4 h-3/4' />
                </button>
            </div>
            ))
        )}
    </>
}

export default FriendRequestsOperation