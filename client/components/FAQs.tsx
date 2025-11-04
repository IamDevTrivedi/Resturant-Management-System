import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const questions = [
  {
    q: 'How do I reserve a table?',
    a: 'You can easily reserve a table through our online reservation system. Just select your preferred restaurant, date, time, and number of guests — and your booking will be confirmed instantly!',
  },
  {
    q: 'Can I modify or cancel my reservation?',
    a: 'Yes, you can modify or cancel your reservation anytime before your scheduled time through your account dashboard or by contacting the restaurant directly.',
  },
  {
    q: 'Are there any special discounts or offers?',
    a: 'Absolutely! We regularly feature exclusive offers, combo deals, and seasonal discounts. Check the “Offers” section or your restaurant’s page for current promotions.',
  },

  {
    q: 'Do you support group reservations or events?',
    a: 'Yes! For large groups or events, please mention your requirements while reserving or contact our team for personalized arrangements.',
  },
  {
    q: 'How can I share feedback or rate a restaurant?',
    a: 'After your meal or order, you’ll be prompted to leave feedback. Your reviews help restaurants improve and help other diners make better choices!',
  },
  {
    q: 'Is there a loyalty or reward program?',
    a: 'Yes! You earn reward points for every successful booking or order, which you can redeem for discounts or exclusive perks.',
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
