import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid'; // Importing Chevron icon from Heroicons

function FormSelect({ label, name, value, onChange, options }) {
  return (
    <div className="w-full">
      <label className="block font-medium text-gray-700 mb-2">{label}</label>
      <Listbox
        value={value}
        onChange={(val) => onChange({ target: { name, value: val.value } })} // Use `value` as the selected item
      >
        {({ open }) => (
          <div className="relative bg-white rounded-xl">
            <Listbox.Button className="listbox__button">
              <span>
                {options.find((option) => option.value === value)?.label || 'انتخاب کنید'}
              </span>
              {/* Chevron Icon with rotation based on open state */}
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                  open ? 'rotate-180' : 'rotate-0'
                }`}
                aria-hidden="true"
              />
            </Listbox.Button>

            {/* Transition for the options */}
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className="listbox__options max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-100"
              >
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    className={({ active }) =>
                      `listbox__option ${
                        active ? 'bg-secondary-100 text-secondary-700' : 'text-gray-900'
                      }`
                    }
                  >
                    {/* Render the option label */}
                    <span className="block truncate font-normal">{option.label}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
}

export default FormSelect;
