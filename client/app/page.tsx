import { DraggableCard } from '@/components/DraggableCard';
import { FAQs } from '@/components/FAQs';
import { Feature } from '@/components/Feature';
import { Separator } from '@/components/ui/separator';

export default function Page() {
    return (
        <>
            <div className="mb-8 text-transparent"> JUST FOR MAKING MARGIN </div>

            <Feature />
            <Separator />

            <DraggableCard />
            <Separator />

            <FAQs />
            <Separator />
        </>
    );
}
