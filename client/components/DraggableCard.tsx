import { DraggableCardBody, DraggableCardContainer } from '@/components/ui/draggable-card';
import Image from 'next/image';

export function DraggableCard() {
    const items = [
        {
            title: 'Tyler Durden',
            image: 'https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            className: 'absolute top-10 left-[20%] rotate-[-5deg]',
        },
        {
            title: 'The Narrator',
            image: 'https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            className: 'absolute top-40 left-[25%] rotate-[-7deg]',
        },
        {
            title: 'Iceland',
            image: 'https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            className: 'absolute top-5 left-[40%] rotate-[8deg]',
        },
        {
            title: 'Japan',
            image: 'https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            className: 'absolute top-32 left-[55%] rotate-[10deg]',
        },
        {
            title: 'Norway',
            image: 'https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            className: 'absolute top-20 right-[35%] rotate-[2deg]',
        },
        {
            title: 'New Zealand',
            image: 'https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            className: 'absolute top-24 left-[45%] rotate-[-7deg]',
        },
        {
            title: 'Canada',
            image: 'https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            className: 'absolute top-8 left-[30%] rotate-[4deg]',
        },
    ];
    return (
        <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
            <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-muted-foreground">
                If its your first day at Fight Club, you have to fight.
            </p>
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
