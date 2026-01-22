import { forwardRef } from 'react';

type InputProps = {
  type: 'text' | 'select' | 'textarea';
  value: string | number;
  onChange: (value: string) => void;
  ref?: React.Ref<HTMLInputElement> | undefined;
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
  errorMessage?: string;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

/**
 * Input component that can render different types of inputs based on the `type` prop.
 * @param ref - Ref to the input element.
 * @param type - The type of input to render ('text', 'select', or 'textarea').
 * @param value - The current value of the input.
 * @param options - Options for the select input type.
 * @param onChange - Callback function to handle value changes.
 * @param placeholder - Placeholder text for text and textarea inputs.
 * @param id - The id attribute for the input element.
 * @param name - The name attribute for the input element.
 * @param className - Additional CSS classes for styling.
 * @param errorMessage - Error message to display below the input.
 * @param disabled - Whether the input is disabled.
 * @param onKeyDown - Callback function for key down events.
 * @constructor
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type, value, options, onChange, placeholder, id, name, className, errorMessage = '', disabled, onKeyDown },
  ref
) {
  const validationStyles = errorMessage
    ? 'border-red-500 shadow-[0]'
    : 'focus:border-primary focus:ring focus:ring-blue-300';
  const renderErrorMessage = () => {
    if (errorMessage) {
      return <p className="text-danger text-body-small">{errorMessage}</p>;
    }
    return null;
  };

  if (type === 'select') {
    return (
      <>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          id={id}
          name={name}
          className={`cursor-pointer ${className} ${validationStyles}`}
        >
          {options &&
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
        {renderErrorMessage()}
      </>
    );
  }
  if (type === 'textarea') {
    return (
      <>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          id={id}
          name={name}
          className={`${className} ${validationStyles}`}
        />
        {renderErrorMessage()}
      </>
    );
  }
  if (type === 'text') {
    return (
      <>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          id={id}
          name={name}
          className={`border-gray-300 rounded-md p-4 w-full text-body-small focus:outline-none ${className} ${validationStyles}`}
          disabled={disabled}
          onKeyDown={onKeyDown}
        />
        {renderErrorMessage()}
      </>
    );
  }
  return null;
});
export default Input;
