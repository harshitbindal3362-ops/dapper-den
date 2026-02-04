import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const phoneNumber = '919876543210'; // Replace with your actual WhatsApp number
  const message = encodeURIComponent('Hi! I have a question about your products.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5C] text-white px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-medium hidden sm:inline">Contact us</span>
    </a>
  );
}
