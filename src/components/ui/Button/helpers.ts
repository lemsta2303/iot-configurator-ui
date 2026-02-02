/**
 * Sets the button styles based on the variant.
 * @param variant - The type of button to style.
 * @returns The corresponding button styles.
 */
export const setButtonStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return 'bg-primary text-white hover:bg-primary-dark';
    case 'secondary':
      return 'bg-secondary text-white hover:bg-secondary-dark';
    case 'success':
      return 'bg-success text-white hover:bg-success-dark';
    case 'danger':
      return 'bg-danger text-white hover:bg-danger-dark';
    case 'transparent':
      return 'bg-transparent hover:bg-gray-200';
    case 'warning':
      return 'bg-warning text-black hover:bg-warning-dark';
    default:
      return 'bg-primary text-gray-600 hover:bg-primary-dark';
  }
};
