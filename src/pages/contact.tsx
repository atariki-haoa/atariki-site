import React from 'react';
import ContactForm from '../components/Contact';
import Layout from '../components/Layout';

const ContactPage: React.FC = () => {
  return (
    <Layout title="Contacto - Ariel Lobos Haoa" description="Contacto - Ariel Lobos Haoa">
      <ContactForm />
    </Layout>
  );
};

export default ContactPage;