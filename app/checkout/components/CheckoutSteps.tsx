'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CheckoutStep =
  | 'customer'
  | 'delivery'
  | 'payment'
  | 'review';

const steps: { key: CheckoutStep; label: string }[] = [
  { key: 'customer', label: 'Customer' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'payment', label: 'Payment' },
  { key: 'review', label: 'Review' },
];

export default function CheckoutSteps({
  currentStep,
}: {
  currentStep: CheckoutStep;
}) {
  const currentIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto mb-12">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step.key} className="flex items-center flex-1">
            {/* Step Circle */}
            <div
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-full border-2 font-black text-sm transition-all',
                isCompleted &&
                  'bg-[#06392F] border-[#06392F] text-white',
                isActive &&
                  'border-[#C75B39] text-[#C75B39] bg-white',
                !isCompleted &&
                  !isActive &&
                  'border-gray-300 text-gray-400 bg-white'
              )}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
            </div>

            {/* Label */}
            <span
              className={cn(
                'ml-3 text-xs font-black uppercase tracking-widest hidden sm:inline',
                isActive && 'text-[#C75B39]',
                isCompleted && 'text-[#06392F]',
                !isCompleted && !isActive && 'text-gray-400'
              )}
            >
              {step.label}
            </span>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-[2px] mx-4 transition-all',
                  isCompleted ? 'bg-[#06392F]' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
