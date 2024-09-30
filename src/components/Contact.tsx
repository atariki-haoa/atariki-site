import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form as HTMLFormElement);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData.entries())),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }

    setTimeout(() => setStatus(null), 3000); // Hide popup after 3 seconds
  };

  return (
    <div className="relative mt-8">
      <div className="max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-100 mb-4">Contáctame</h2>
        <p className="text-gray-300 mb-6">
          Si tienes alguna consulta técnica, necesitas hablar sobre un proyecto o cotizaciones, no dudes en contactarme a través del siguiente formulario o a mi correo: <a href="mailto:ariel@atariki.com">ariel@atariki.com</a>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300">Nombre:</label>
            <input type="text" id="name" name="name" className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300">Correo Electrónico:</label>
            <input type="email" id="email" name="email" className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-300">Mensaje:</label>
            <textarea id="message" name="message" className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-300 rounded-md" rows={5} required></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Enviar</button>
        </form>
      </div>

      {status && (
        <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${status ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto animate-popup">
            {loading ? (
              <div className="loader"></div>
            ) : status === 'success' ? (
              <p className="text-green-500">Correo enviado correctamente.</p>
            ) : (
              <p className="text-red-500">Error al enviar el correo. Inténtalo de nuevo más tarde.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;