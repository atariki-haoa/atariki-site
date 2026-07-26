import React, { useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  budget: string;
  technology: string;
  timeline: string;
}

interface QuoteFormProps {
  onSubmit: (data: QuoteFormData) => void;
  isSubmitting?: boolean;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    phone: '',
    email: '',
    budget: '',
    technology: '',
    timeline: '',
  });

  const [errors, setErrors] = useState<Partial<QuoteFormData>>({});

  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(isSpanish ? 'es-CL' : 'en-US', {
        style: 'currency',
        currency: isSpanish ? 'CLP' : 'USD',
        minimumFractionDigits: 0,
      }),
    [isSpanish]
  );

  const copy = useMemo(
    () =>
      isSpanish
        ? {
            title: 'Solicitar Cotización',
            labels: {
              name: 'Nombre',
              phone: 'Teléfono',
              email: 'Correo Electrónico',
              budget: 'Rango de Presupuesto',
              technology: 'Tipo de Tecnología',
              timeline: 'Plazo estimado para recibir el proyecto',
            },
            placeholders: {
              name: 'Ingresa tu nombre completo',
              phone: '+56 9 1234 5678',
              email: 'tu@email.com',
              budget: 'Selecciona un rango de presupuesto',
              technology: 'Selecciona el tipo de tecnología',
              timeline: 'Selecciona el plazo objetivo',
            },
            errors: {
              name: 'El nombre es obligatorio',
              emailRequired: 'El correo electrónico es obligatorio',
              emailInvalid: 'El formato del correo no es válido',
              budget: 'Debe seleccionar un rango de presupuesto',
              technology: 'Debe seleccionar una tecnología',
              timeline: 'Debe seleccionar un plazo estimado',
            },
            submit: {
              idle: 'Generar Cotización',
              loading: 'Calculando...',
            },
          }
        : {
            title: 'Request an Estimate',
            labels: {
              name: 'Name',
              phone: 'Phone',
              email: 'Email',
              budget: 'Budget Range',
              technology: 'Technology Type',
              timeline: 'Desired delivery timeline',
            },
            placeholders: {
              name: 'Enter your full name',
              phone: '+56 9 1234 5678',
              email: 'your@email.com',
              budget: 'Select a budget range',
              technology: 'Select the technology focus',
              timeline: 'Select your target timeline',
            },
            errors: {
              name: 'Name is required',
              emailRequired: 'Email is required',
              emailInvalid: 'Invalid email format',
              budget: 'Please select a budget range',
              technology: 'Please select a technology type',
              timeline: 'Please select an estimated timeline',
            },
            submit: {
              idle: 'Generate Estimate',
              loading: 'Calculating...',
            },
          },
    [isSpanish]
  );
    const formatCurrency = (amount: number): string => currencyFormatter.format(amount);


  const budgetOptions = useMemo(() => {
    const options: number[] = [];
    const budgetCLP = 1_000_000;
    const budgetUSD = 1_000;
    let budget = budgetCLP;
    if (!isSpanish) {
      budget = budgetUSD;
    }
    for (let amount = budget; amount <= budget * 10; amount += budget) {
      options.push(amount);
    }
    return options;
  }, [isSpanish]);

  const technologyOptions = useMemo(
    () =>
      isSpanish
        ? [
            { value: 'web_app', label: 'Aplicación Web' },
            { value: 'integrations', label: 'Integraciones' },
            { value: 'mobile_app', label: 'Aplicación Móvil' },
            { value: 'other', label: 'Otros' },
          ]
        : [
            { value: 'web_app', label: 'Web Application' },
            { value: 'integrations', label: 'Integrations' },
            { value: 'mobile_app', label: 'Mobile Application' },
            { value: 'other', label: 'Other' },
          ],
    [isSpanish]
  );

  const timelineOptions = useMemo(
    () =>
      isSpanish
        ? [
            { value: '1', label: '1 mes (express)' },
            { value: '2', label: '2 meses' },
            { value: '3', label: '3 meses' },
            { value: '4', label: '4 meses' },
            { value: '6', label: '6 meses' },
            { value: '9', label: '9 meses' },
            { value: '12', label: '12 meses' },
            { value: '15', label: 'Más de 12 meses' },
          ]
        : [
            { value: '1', label: '1 month (express)' },
            { value: '2', label: '2 months' },
            { value: '3', label: '3 months' },
            { value: '4', label: '4 months' },
            { value: '6', label: '6 months' },
            { value: '9', label: '9 months' },
            { value: '12', label: '12 months' },
            { value: '15', label: 'More than 12 months' },
          ],
    [isSpanish]
  );


  const validateForm = (): boolean => {
    const newErrors: Partial<QuoteFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = copy.errors.name;
    }

    if (!formData.email.trim()) {
      newErrors.email = copy.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = copy.errors.emailInvalid;
    }

    if (!formData.budget) {
      newErrors.budget = copy.errors.budget;
    }

    if (!formData.technology) {
      newErrors.technology = copy.errors.technology;
    }

    if (!formData.timeline) {
      newErrors.timeline = copy.errors.timeline;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof QuoteFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3.5 py-[11px] bg-term-panelAlt border rounded-lg text-term-text placeholder-term-dim font-mono text-sm transition-colors ${
      hasError ? 'border-term-red' : 'border-term-border'
    }`;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-term-panel border border-term-border rounded-2xl p-8">
        <h2 className="text-[28px] font-bold text-center mb-7 text-gradient-hero">{copy.title}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-[13px] text-term-sub mb-1.5">
              {copy.labels.name}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={inputClass(!!errors.name)}
              placeholder={copy.placeholders.name}
            />
            {errors.name && <p className="mt-1.5 text-xs text-term-red">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-[13px] text-term-sub mb-1.5">
              {copy.labels.phone}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={inputClass(false)}
              placeholder={copy.placeholders.phone}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[13px] text-term-sub mb-1.5">
              {copy.labels.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={inputClass(!!errors.email)}
              placeholder={copy.placeholders.email}
            />
            {errors.email && <p className="mt-1.5 text-xs text-term-red">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="budget" className="block text-[13px] text-term-sub mb-1.5">
              {copy.labels.budget} ({isSpanish ? 'CLP' : 'USD'})
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className={inputClass(!!errors.budget)}
            >
              <option value="">{copy.placeholders.budget}</option>
              {budgetOptions.map(amount => (
                <option key={amount} value={amount}>
                  {formatCurrency(amount)}
                </option>
              ))}
            </select>
            {errors.budget && <p className="mt-1.5 text-xs text-term-red">{errors.budget}</p>}
          </div>

          <div>
            <label htmlFor="technology" className="block text-[13px] text-term-sub mb-1.5">
              {copy.labels.technology}
            </label>
            <select
              id="technology"
              name="technology"
              value={formData.technology}
              onChange={handleInputChange}
              className={inputClass(!!errors.technology)}
            >
              <option value="">{copy.placeholders.technology}</option>
              {technologyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.technology && <p className="mt-1.5 text-xs text-term-red">{errors.technology}</p>}
          </div>

          <div>
            <label htmlFor="timeline" className="block text-[13px] text-term-sub mb-1.5">
              {copy.labels.timeline}
            </label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className={inputClass(!!errors.timeline)}
            >
              <option value="">{copy.placeholders.timeline}</option>
              {timelineOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.timeline && <p className="mt-1.5 text-xs text-term-red">{errors.timeline}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white font-semibold py-[13px] px-6 rounded-[10px] text-[14.5px]"
            style={{
              background: isSubmitting ? '#2d3a5c' : 'linear-gradient(120deg,#3f6fe0,#8b6ff0)',
            }}
          >
            {isSubmitting ? copy.submit.loading : copy.submit.idle}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuoteForm;
