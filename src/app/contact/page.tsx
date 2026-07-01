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
          <h1 className="text-4xl md:text-5xl font-bold text-[#EDEDED] mb-4">Let&apos;s Connect</h1>
          <p className="text-slate-400 max-w-md mx-auto text-lg">
            Have a project in mind or just want to chat? I&apos;d love to hear from you.
            Fill out the form below and I&apos;ll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="w-full max-w-4xl bg-[#0A0A0A] border border-[#2E2E2E] rounded-2xl overflow-hidden shadow-2xl">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
