const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL
const authToken = process.env.UPSTASH_REDIS_REST_URL

type commands = 'zrange' | 'sismember' | 'get' | 'semembers'

export async function fetchRedis(
    command : commands,
    ...args:(string|number)[]
){
    const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join('/')}`
    const response = await fetch(
        commandUrl ,{
            headers:{
                Authorization: `Bearer ${authToken}`
            },
            cache:'no-store',
        }
    )
    if(!response.ok){
        throw new Error(`Error executing Redis command ${response.statusText}`)
    }

    const data = await response.json()
    return data.result 
}