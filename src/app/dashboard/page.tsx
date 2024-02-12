import Button from '@/components/ui/Button';
import { authOption } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { FC } from 'react'

interface pageProps {
  
}
// : FC<pageProps> 
const  page = async ({}) => {
  const session = await getServerSession(authOption)
  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //   <div className="bg-black text-white underline text-2xl">Hello To Dashboard</div>
    //   <Button variant='ghost'/>
    // </main>
    <pre>{JSON.stringify(session)}</pre>
  );
}

export default page