// import FriendRequests from '@/components/FriendRequests'
// import { fetchRedis } from '@/helpers/redis'
// import { authOption } from '@/lib/auth'
// import { getServerSession } from 'next-auth'
// import { notFound } from 'next/navigation'
// import { FC } from 'react'

// const page= async ({} : FC)=> {
//     const session = await getServerSession(authOption)

//     if(!session)notFound()

//     // ids of the people sent friend requests
//     const  incomingSenderIds = (await fetchRedis(
//         'smembers',
//         `user:${session.user.id}:incoming_friend_requests`
//       )) as string[]
    
    

//     const incomingFriendRequests  = await Promise.all(
//         incomingSenderIds.map(async(senderId)=>{
//             const sender = (await fetchRedis('get',`user:${senderId}`)) as User;
//             return {
//                 senderEmail: sender.email,
//                 senderId
//             }
//         })
//     )


//     return <main className='pt-8'>
//         <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id}/>
//         <h1 className='font-bold text-5xl mb-8'>Add a Friend</h1>
//         <div className='flex flex-col gap-4'>
//             <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id}/>
//         </div> 
//     </main>
// }

// export default page
import AddFriendButton from '@/components/AddFriendButton'
import FriendRequestsOperation from '@/components/FriendRequestsOperation'
import { fetchRedis } from '@/helpers/redis'
import { authOption } from '@/lib/auth'
import { UserPlus } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

const page = async () => {
  const session = await getServerSession(authOption)
  if (!session) notFound()

  // ids of people who sent current logged in user a friend requests
  const incomingSenderIds = (await fetchRedis(
    'smembers',
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[]

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis('get', `user:${senderId}`)) as string
      const senderParsed = JSON.parse(sender) as User
    //   console.log('senderParsed ' , sender)
      
      return {
        senderId,
        senderEmail: senderParsed.email,
      }
    })
  )
//   await console.log('incoming' , incomingFriendRequests)

  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
      <div className='flex flex-col gap-4'>
        <FriendRequestsOperation incomingFriendRequest={incomingFriendRequests} sessionId={session.user.id} />

      </div>
    </main>
  )
}

export default page