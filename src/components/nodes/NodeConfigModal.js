import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { nodeConfigs } from './nodeConfigs';

export const NodeConfigModal = ({ isOpen, onClose, node, onUpdate, className }) => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    if (node?.data?.config) {
      setConfig(node.data.config);
    } else {
      setConfig({});
    }
  }, [node]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(node.id, config);
    onClose();
  };

  const handleInputChange = (fieldId, value) => {
    setConfig(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  if (!node) return null;

  const nodeConfig = nodeConfigs[node.type];
  if (!nodeConfig) return null;

  const shouldShowField = (field) => {
    if (!field.showWhen) return true;
    return field.showWhen(config);
  };

  const isFieldRequired = (field) => {
    if (typeof field.required === 'function') {
      return field.required(config);
    }
    return field.required;
  };

  const renderField = (field) => {
    if (!shouldShowField(field)) return null;

    switch (field.type) {
      case 'select':
        return (
          <select
            id={field.id}
            value={config[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required={isFieldRequired(field)}
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={config[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required={isFieldRequired(field)}
          />
        );
      
      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={field.id}
            checked={config[field.id] || false}
            onChange={(e) => handleInputChange(field.id, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        );
      
      case 'range':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="range"
              id={field.id}
              value={config[field.id] || field.min}
              min={field.min}
              max={field.max}
              step={field.step}
              onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value))}
              className="w-full"
              required={isFieldRequired(field)}
            />
            <span className="text-sm text-gray-500">
              {config[field.id] || field.min}
            </span>
          </div>
        );
      
      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={config[field.id] || ''}
            min={field.min}
            max={field.max}
            onChange={(e) => handleInputChange(field.id, parseInt(e.target.value, 10))}
            placeholder={field.placeholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required={isFieldRequired(field)}
          />
        );
      
      case 'password':
        return (
          <input
            type="password"
            id={field.id}
            value={config[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required={isFieldRequired(field)}
          />
        );
      
      default:
        return (
          <input
            type="text"
            id={field.id}
            value={config[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required={isFieldRequired(field)}
          />
        );
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className={`fixed inset-0 ${className || ''} z-[150]`} 
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[150]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto z-[151]">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  <span>{nodeConfig.title}</span>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {nodeConfig.fields.map((field) => (
                    shouldShowField(field) && (
                      <div key={field.id}>
                        <label
                          htmlFor={field.id}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {field.label}
                          {isFieldRequired(field) && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {renderField(field)}
                      </div>
                    )
                  ))}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 