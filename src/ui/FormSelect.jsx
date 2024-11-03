// src/ui/FormSelect.jsx

import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';


function FormSelect({ label, name, value, onChange, options, disabled, placeholder, errorMessages }) {
  return (
    <div className="w-full">
      <label className="block font-medium text-gray-700 mb-2">{label}</label>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative bg-white rounded-xl">
            <Listbox.Button className={`listbox__button ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <span>{value?.label || placeholder || 'انتخاب کنید'}</span>
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                  open ? 'rotate-180' : 'rotate-0'
                }`}
                aria-hidden="true"
              />
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-100"
              >
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    className={({ active }) =>
                      `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                        active ? 'bg-secondary-100 text-secondary-700' : 'text-gray-900'
                      }`
                    }
                  >
                    <span className="block truncate font-normal">{option.label}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
      {errorMessages && errorMessages.length > 0 && (
        <div className="text-red-500 mt-1">
          {errorMessages.map((msg, idx) => (
            <p key={idx}>{msg}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default FormSelect;
