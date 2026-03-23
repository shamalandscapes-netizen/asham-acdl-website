'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Truck, Store } from 'lucide-react';

export type DeliveryData = {
  method: 'delivery' | 'pickup';
  address?: string;
  city?: string;
  notes?: string;
};

export default function DeliveryForm({
  initialData,
  onBack,
  onNext,
}: {
  initialData?: DeliveryData;
  onBack: () => void;
  onNext: (data: DeliveryData) => void;
}) {
  const [method, setMethod] = useState<
    'delivery' | 'pickup'
  >(initialData?.method ?? 'delivery');

  const [form, setForm] = useState<DeliveryData>({
    method: initialData?.method ?? 'delivery',
    address: initialData?.address ?? '',
    city: initialData?.city ?? '',
    notes: initialData?.notes ?? '',
  });

  const [error, setError] = useState<string | null>(null);

  // ------------------------------
  // Validation
  // ------------------------------
  const validate = (): boolean => {
    if (method === 'delivery') {
      if (!form.address || form.address.trim().length < 5) {
        setError('Delivery address is required');
        return false;
      }
      if (!form.city || form.city.trim().length < 2) {
        setError('City or area is required');
        return false;
      }
    }
    setError(null);
    return true;
  };

  // ------------------------------
  // Handlers
  // ------------------------------
  const handleSubmit = () => {
    if (!validate()) return;

    if (method === 'pickup') {
      onNext({ method: 'pickup' });
    } else {
      onNext({
        method: 'delivery',
        address: form.address,
        city: form.city,
        notes: form.notes,
      });
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto bg-white border shadow-sm rounded-xl">
      <h2 className="mb-6 text-xl font-black">
        Delivery Method
      </h2>

      {/* Method selector */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setMethod('delivery')}
          className={`border rounded-xl p-4 flex flex-col items-center gap-2 font-bold transition
            ${
              method === 'delivery'
                ? 'border-[#06392F] bg-[#06392F]/5'
                : 'hover:bg-gray-50'
            }`}
        >
          <Truck />
          Home Delivery
        </button>

        <button
          onClick={() => setMethod('pickup')}
          className={`border rounded-xl p-4 flex flex-col items-center gap-2 font-bold transition
            ${
              method === 'pickup'
                ? 'border-[#06392F] bg-[#06392F]/5'
                : 'hover:bg-gray-50'
            }`}
        >
          <Store />
          Store Pickup
        </button>
      </div>

      {/* Delivery form */}
      {method === 'delivery' && (
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-bold">
              Delivery Address
            </label>
            <input
              value={form.address}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#06392F]"
              placeholder="Street, building, house number"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-bold">
              City / Area
            </label>
            <input
              value={form.city}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#06392F]"
              placeholder="e.g. Westlands, Syokimau"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-bold">
              Delivery Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              rows={3}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#06392F]"
              placeholder="Landmarks, gate instructions"
            />
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-between gap-4 mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 font-bold border rounded-xl hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <button
          onClick={handleSubmit}
          className="flex-1 py-4 bg-[#06392F] text-white font-black rounded-xl hover:bg-black transition"
        >
          Continue
          <ArrowRight size={16} className="inline ml-2" />
        </button>
      </div>
    </div>
  );
}
