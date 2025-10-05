import React, { useState } from 'react';

interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  budget: string;
  technology: string;
}

interface QuoteFormProps {
  onSubmit: (data: QuoteFormData) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    phone: '',
    email: '',
    budget: '',
    technology: ''
  });

  const [errors, setErrors] = useState<Partial<QuoteFormData>>({});

  const budgetOptions = [];
  for (let i = 1000000; i <= 10000000; i += 1000000) {
    budgetOptions.push(i);
  }

  const technologyOptions = [
    { value: 'web', label: 'Aplicación Web' },
    { value: 'mobile', label: 'Aplicación Móvil' },
    { value: 'other', label: 'Otro' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<QuoteFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del correo no es válido';
    }

    if (!formData.budget) {
      newErrors.budget = 'Debe seleccionar un rango de presupuesto';
    }

    if (!formData.technology) {
      newErrors.technology = 'Debe seleccionar una tecnología';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof QuoteFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-gray-800 rounded-3xl shadow-lg p-8 glass">
        <h2 className="text-3xl font-bold text-center mb-8 text-gradient-blue">
          Solicitar Cotización
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Ingresa tu nombre completo"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="+56 9 1234 5678"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
              Rango de Presupuesto <span className="text-red-500">*</span>
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.budget ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Selecciona un rango de presupuesto</option>
              {budgetOptions.map((amount) => (
                <option key={amount} value={amount}>
                  {formatCurrency(amount)}
                </option>
              ))}
            </select>
            {errors.budget && (
              <p className="mt-1 text-sm text-red-500">{errors.budget}</p>
            )}
          </div>

          <div>
            <label htmlFor="technology" className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Tecnología <span className="text-red-500">*</span>
            </label>
            <select
              id="technology"
              name="technology"
              value={formData.technology}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.technology ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Selecciona el tipo de tecnología</option>
              {technologyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.technology && (
              <p className="mt-1 text-sm text-red-500">{errors.technology}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Solicitar Cotización
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuoteForm;
