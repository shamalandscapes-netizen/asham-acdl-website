'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export type CustomerData = {
  fullName: string;
  email: string;
  phone: string;
};

export default function CustomerForm({
  initialData,
  onNext,
}: {
  initialData?: CustomerData;
  onNext: (data: CustomerData) => void;
}) {
  const [form, setForm] = useState<CustomerData>({
    fullName: initialData?.fullName ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CustomerData, string>>
  >({});

  // ------------------------------
  // Validation
  // ------------------------------
  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (form.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name is required';
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!/^07\d{8}$/.test(form.phone)) {
      newErrors.phone = 'Use format 07XXXXXXXX';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------
  // Handlers
  // ------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Normalize phone for Mpesa (2547XXXXXXXX)
    const normalizedPhone =
      '254' + form.phone.slice(1);

    onNext({
      ...form,
      phone: normalizedPhone,
    });
  };

  return (
    <div className="max-w-xl p-6 mx-auto bg-white border shadow-sm rounded-xl">
      <h2 className="mb-6 text-xl font-black">
        Customer Information
      </h2>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block mb-1 text-sm font-bold">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#06392F]"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-bold">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#06392F]"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 text-sm font-bold">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="07XXXXXXXX"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#06392F]"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Action */}
        <button
          onClick={handleSubmit}
          className="w-full mt-6 py-4 bg-[#06392F] text-white font-black rounded-xl flex items-center justify-center gap-2 hover:bg-black transition"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
