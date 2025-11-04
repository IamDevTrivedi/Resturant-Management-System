import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const questions = [
    {
        q: 'What is your return policy?',
        a: "We offer a 30-day money-back guarantee on all products. If you're not satisfied, contact our support team for a full refund.",
    },
    {
        q: 'How long does shipping take?',
        a: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 day delivery at checkout.',
    },
    {
        q: 'Do you offer international shipping?',
        a: 'Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location.',
    },
    {
        q: 'How can I track my order?',
        a: "Once your order ships, you'll receive a tracking number via email. You can also check your order status in your account dashboard.",
    },
];

export function FAQs() {
    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-12 sm:py-16">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                    Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground">Find answers to common questions below</p>
            </div>

            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                {questions.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`}>
                        <AccordionTrigger className="text-left hover:no-underline text-md">
                            <span className="font-medium">{item.q}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
