import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
    return (
        <div className="w-full min-h-screen items-center justify-center flex">
            <ModeToggle />
        </div>
    );
}
