import { Mail, Phone, User, Link2 } from 'lucide-react';

const contact = {
  name: 'Aditya Sharma',
  email: 'adityasharma89000@gmail.com',
  phone: '+91 7007380157',
  linkedin: 'https://www.linkedin.com/in/aditya-sharma55/',
  github: 'https://github.com/adityasharma67',
};

function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-5xl py-8">
      <h1 className="text-3xl font-bold uppercase tracking-wide text-slate-800">Contact</h1>
      <p className="mt-2 text-slate-600">Reach out for collaboration, project work, or product support.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-slate-800">
            <User size={18} />
            <h2 className="text-lg font-semibold">Name</h2>
          </div>
          <p className="text-slate-700">{contact.name}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-slate-800">
            <Mail size={18} />
            <h2 className="text-lg font-semibold">Email</h2>
          </div>
          <a className="text-[#ff523b] hover:underline" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-slate-800">
            <Phone size={18} />
            <h2 className="text-lg font-semibold">Contact Number</h2>
          </div>
          <a className="text-[#ff523b] hover:underline" href={`tel:${contact.phone.replace(/\s+/g, '')}`}>
            {contact.phone}
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-slate-800">
            <Link2 size={18} />
            <h2 className="text-lg font-semibold">LinkedIn</h2>
          </div>
          <a className="text-[#ff523b] hover:underline" href={contact.linkedin} target="_blank" rel="noreferrer">
            {contact.linkedin}
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-slate-800">
            <Link2 size={18} />
            <h2 className="text-lg font-semibold">GitHub</h2>
          </div>
          <a className="text-[#ff523b] hover:underline" href={contact.github} target="_blank" rel="noreferrer">
            {contact.github}
          </a>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
