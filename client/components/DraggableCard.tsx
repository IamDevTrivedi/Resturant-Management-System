'use client';

import { DraggableCardBody, DraggableCardContainer } from '@/components/ui/draggable-card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function DraggableCard() {
    const router = useRouter();

    const items = [
        {
            title: 'Butter Chicken',
            image: '/ButterChicken.avif',
            className: 'absolute top-10 left-[20%] rotate-[-5deg]',
        },
        {
            title: 'Biryani',
            image: '/Biryani.avif',
            className: 'absolute top-40 left-[25%] rotate-[-7deg]',
        },
        {
            title: 'Masala Dosa',
            image: '/MasalaDosa.avif',
            className: 'absolute top-5 left-[40%] rotate-[8deg]',
        },
        {
            title: 'Paneer Tikka',
            image: '/PaneerTikka.avif',
            className: 'absolute top-32 left-[55%] rotate-[10deg]',
        },
        {
            title: 'Samosa',
            image: '/Samosa.avif',
            className: 'absolute top-20 right-[35%] rotate-[2deg]',
        },
        {
            title: 'Tandoori Chicken',
            image: '/TandooriChicken.avif',
            className: 'absolute top-24 left-[45%] rotate-[-7deg]',
        },
        {
            title: 'Chole Bhature',
            image: '/CholeBhature.avif',
            className: 'absolute top-8 left-[30%] rotate-[4deg]',
        },
    ];

    return (
        <DraggableCardContainer className="my-6 relative flex min-h-screen w-full items-center justify-center overflow-clip">
            <div className="absolute top-1/2 mx-auto max-w-md -translate-y-3/4 text-center space-y-3">
                <p className="text-3xl font-extrabold tracking-tight">Hungry for More?</p>
                <p className="text-base text-muted-foreground leading-relaxed">
                    Don&apos;t just scroll through delicious dishes — taste them.
                    <br />
                    Reserve your spot and experience authentic flavors
                    <br />
                    that&apos;ll keep you coming back.
                </p>
                <Button
                    onClick={() => {
                        router.push('/login');
                    }}
                >
                    Reserve Your Table
                </Button>
            </div>
            {items.map((item) => (
                <DraggableCardBody className={item.className} key={item.title}>
                    <Image
                        src={item.image}
                        alt={item.title}
                        width={150}
                        height={150}
                        className="pointer-events-none relative z-10 h-80 w-80 object-cover"
                    />
                    <h3 className="mt-4 text-center text-2xl font-bold text-primary">
                        {item.title}
                    </h3>
                </DraggableCardBody>
            ))}
        </DraggableCardContainer>
    );
}
