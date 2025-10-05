import Layout from '../components/functional/Layout';
import QuoteManager from '../components/logical/QuoteManager';

const CalculatorPage: React.FC = () => {
  return (
    <Layout 
      title="Cotización de Proyectos - Ariel Lobos Haoa" 
      description="Solicita una cotización personalizada para tu proyecto web o móvil. Presupuestos desde $1.000.000 CLP."
      canonicalUrl="/calculator"
      keywords="cotización, presupuesto, desarrollo web, aplicación móvil, proyecto, Ariel Lobos Haoa"
    >
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gradient-blue mb-6 animate-fadeInDown">
              Cotización de Proyectos
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fadeInUp">
              Completa el formulario y recibe una cotización personalizada para tu proyecto. 
              Trabajamos con presupuestos desde $1.000.000 CLP y ofrecemos soluciones web y móviles.
            </p>
          </div>
          
          <QuoteManager />
        </div>
      </div>
    </Layout>
  );
};

export default CalculatorPage;