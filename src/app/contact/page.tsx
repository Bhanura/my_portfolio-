import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact - Bhanura Waduge',
  description: 'Get in touch for opportunities, collaborations, or just to say hi.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 mt-16">
        <div className="max-w-2xl w-full text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#EDEDED] mb-4">Let's Connect</h1>
          <p className="text-[#A1A1A1] text-lg">
            I'm currently available for new opportunities. Whether you have a project to discuss or just want to say hi, my inbox is always open.
          </p>
        </div>
        
        <div className="w-full max-w-4xl bg-[#0A0A0A] border border-[#2E2E2E] rounded-2xl overflow-hidden shadow-2xl">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
