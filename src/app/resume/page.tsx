'use client';

import Image from 'next/image';

// Client component

export default function ResumePage() {
  // TODO: Replace with dynamic content from site_settings after database setup
  const headshotUrl = ""; // Add your headshot URL in admin settings
  
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm dark:bg-gray-900 print:shadow-none print:p-0">
      <header className="border-b pb-6 mb-6 flex justify-between items-start">
        <div className="flex gap-6 items-start">
          {headshotUrl && (
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700 shrink-0 print:w-20 print:h-20">
              <Image
                src={headshotUrl}
                alt="Profile Photo"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold mb-2">Bhanura Waduge</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">Full Stack Developer</p>
            <div className="mt-4 space-y-1 text-sm text-gray-500 dark:text-gray-400">
              <p>San Francisco, CA</p>
              <p>contact@bhanura.dev</p>
              <p>linkedin.com/in/bhanura</p>
            </div>
          </div>
        </div>
        <button 
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 print:hidden dark:bg-white dark:text-black"
          onClick={() => window.print()} 
        >
          Print PDF
        </button>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2 uppercase tracking-wide">Summary</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Experienced Full Stack Developer with a passion for building scalable web applications. 
          Proficient in JavaScript, TypeScript, React, Next.js, and Node.js. 
          Dedicated to clean code, performance optimization, and user-centric design.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2 uppercase tracking-wide">Experience</h2>
        
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-xl font-semibold">Senior Developer</h3>
            <span className="text-sm text-gray-500">2023 - Present</span>
          </div>
          <p className="font-medium text-gray-600 dark:text-gray-400 mb-2">Tech Corp Inc.</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>Led the migration of legacy app to Next.js 14.</li>
            <li>Improved site performance by 40% using SSR and ISR.</li>
            <li>Mentored junior developers and conducted code reviews.</li>
          </ul>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-xl font-semibold">Web Developer</h3>
            <span className="text-sm text-gray-500">2020 - 2023</span>
          </div>
          <p className="font-medium text-gray-600 dark:text-gray-400 mb-2">Creative Solutions Agency</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>Developed responsive websites for diverse clients.</li>
            <li>Integrated Supabase for backend needs.</li>
            <li>Collaborated with designers to implement pixel-perfect UIs.</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2 uppercase tracking-wide">Education</h2>
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-xl font-semibold">BSc in Computer Science</h3>
            <span className="text-sm text-gray-500">2016 - 2020</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">University of Technology</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2 uppercase tracking-wide">Skills</h2>
         <div className="flex flex-wrap gap-2">
            {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git', 'CI/CD'].map((skill) => (
              <span key={skill} className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
         </div>
      </section>

      <div className="hidden print:block text-center text-sm text-gray-400 mt-12 bg-white">
        <p>Generated from portfolio website</p>
      </div>

      <style jsx global>{`
        @media print {
          @page { margin: 2cm; }
          body { background: white; color: black; }
          nav, footer, button { display: none !important; }
        }
      `}</style>
    </div>
  );
}
