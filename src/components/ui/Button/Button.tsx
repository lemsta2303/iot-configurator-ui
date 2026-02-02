import { setButtonStyles } from './helpers';

type ButtonProps = {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'transparent' | 'warning';
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

/**
 * Button component responsible for rendering a styled button with various variants and states.
 * @param children - Button label or content.
 * @param onClick - Click event handler.
 * @param variant - Button style variant.
 * @param disabled - Disabled state of the button.
 * @param className - Additional CSS classes for custom styling.
 * @param type - Button type attribute.
 * @constructor
 */
function Button({ children, onClick, variant, disabled = false, className, type = 'button' }: ButtonProps) {
  const buttonTypeStyles = setButtonStyles(variant || 'primary');
  const disabledStyles = disabled ? 'opacity-50 !cursor-not-allowed  pointer-events-none' : '';

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-label cursor-pointer w-auto h-auto transition-all ${buttonTypeStyles} ${className} ${disabled && disabledStyles}`}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
export default Button;
