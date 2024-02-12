import { fetchRedis } from "@/helpers/redis"
import { authOption } from "@/lib/auth"
import { db } from "@/lib/db"
import { addFriendValidator } from "@/lib/validations/add-friend"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req:Request){
    try {
        const body = await req.json()

        const {email:emailToAdd} = addFriendValidator.parse(body.email)
        console.log(emailToAdd)
        const idToAdd = (await fetchRedis(
            'get',
            `user:email:${emailToAdd}`
          )) as string
          
        if(!idToAdd){
            return new Response('This Person does not exist.' , {status: 400})
        }

        const session = await getServerSession(authOption)
        
        if(!session){
            return new Response('Unauthorized' , {status: 401})
        }

        if(idToAdd === session.user.id){
            return new Response('You Cannot add yourself as a friend', {status: 400})
        }

        const isAlreadyAdded = (await fetchRedis('sismember', `user:${idToAdd}:incoming_friend_request`, session.user.id)) as  0 | 1

        if( isAlreadyAdded){
            return new Response('Already added this user', {status:400})
        }

        const isAlreadyFriends = (await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd)) as  0 | 1

        if( isAlreadyFriends){
            return new Response('Already added this friend', {status:400})
        }

        await db.sadd(`user:${idToAdd}:incoming_friend_request` , session.user.id)

        return new Response('OK')
    } catch (error) {
        if(error instanceof z.ZodError ){
            return new Response('Invalid Request payload'  ,{status:422})
        }
        // console.log(error)
        return new Response('Invalid Request' ,{status:400})

    }
}