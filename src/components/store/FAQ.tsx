import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Do you offer free shipping?',
    answer: 'Yes, we provide free standard shipping on orders above ₹199.',
  },
  {
    question: 'What is your refund policy?',
    answer: 'We do not offer refunds. However, exchanges are available within 48 hours of purchase. If your product arrives damaged, please take a clear photo of the item and send it to us within the 48-hour window along with your order details. To be eligible for an exchange, the item must be unused and in its original packaging. Once we verify the issue, we will arrange an exchange as soon as possible.',
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach us via email at support@luxeaccessories.com or WhatsApp at +91-9876543210. We typically respond within 24 hours.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, you will receive a tracking number via email or SMS. You can use it to track your package on our website or the courier\'s site.',
  },
];

export function FAQ() {
  return (
    <section className="section-spacing">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="max-w-2xl mx-auto">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-0"
            >
              <AccordionTrigger className="bg-foreground text-background px-4 py-3 hover:no-underline text-left text-sm font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 text-sm leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
