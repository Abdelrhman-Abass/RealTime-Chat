import Button from '@/components/ui/Button';
import { FC } from 'react'

interface pageProps {
  
}

const  page: FC<pageProps> = ({}) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-black text-white underline text-2xl">Hello To Dashboard</div>
      <Button />
    </main>
  );
}

export default page