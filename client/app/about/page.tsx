
import AboutPage from '@/components/ui/about';
import Contact from '@/components/ui/contact';
import { Separator } from '@/components/ui/separator';

export default function Page() {
    return (
        <div className="">
            <AboutPage />
            <Separator />
            <Contact/>
            <Separator />
        </div>
    );
}
