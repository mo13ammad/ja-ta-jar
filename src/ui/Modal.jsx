import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from '@heroicons/react/24/solid';

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose || (() => {})}>
        <Transition.Child
          as={Fragment}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-1">
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-4 scale-95"
          >
            {/* Modal Panel */}
            <Dialog.Panel
              className="
                w-full bg-white flex flex-col mx-4 sm:mx-10 md:mx-14 xl:p-6 max-w-9xl  items-center rounded-3xl py-3 px-1.5 shadow-lg
                max-h-[95vh]  
                overflow-auto
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 
                scrollbar-thumb-rounded-full scrollbar-track-rounded-full
              "
            >
              <div className=" relative flex flex-col items-center justify-center w-full">
                <div className=" mb-2 w-full  flex flex-row-reverse items-center  justify-between">
                <div className="rounded-full w-10 h-10  bg-primary-500 hover:bg-primary-100 text-white hover:text-primary-700  transition duration-150 ease-in-out ">
                {onClose && (
                  <button
                    onClick={onClose}
                    className="flex items-center w-full h-full justify-center"
                    aria-label="Close"
                  >
                    <XMarkIcon className="w-6   h-6" />
                  </button>
                )}
                 </div>
                {title && (
                  <Dialog.Title className="font-bold self-start text-lg sm:text-xl mr-2">
                    {title}
                  </Dialog.Title>
                )}
                </div>
                <div className="w-full">{children}</div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
