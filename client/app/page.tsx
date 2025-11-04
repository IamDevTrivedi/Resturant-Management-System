import { DraggableCard } from '@/components/DraggableCard';
import { FAQs } from '@/components/FAQs';
import { Feature } from '@/components/Feature';
import { HeroSection } from '@/components/hero-section';
import { Separator } from '@/components/ui/separator';

export default function Page() {
    return (
        <div className="">
            <HeroSection />
            <Separator />

            <Feature />
            <Separator />

            <DraggableCard />
            <Separator />

            <FAQs />
            <Separator />
        </div>
    );
}
