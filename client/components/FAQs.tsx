'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
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
    <section className="w-full max-w-3xl mx-auto px-6 py-16 sm:py-20">
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-3">
          <HelpCircle className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-lg">
          Find quick answers to common questions below
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index + 1}`}
            className="border rounded-xl px-4 shadow-sm bg-card hover:shadow-md transition-all duration-200"
          >
            <AccordionTrigger className="text-left text-md py-4 font-medium hover:no-underline focus-visible:ring-2 focus-visible:ring-primary/30">
  {item.q}
</AccordionTrigger>

            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
