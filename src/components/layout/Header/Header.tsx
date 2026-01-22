import logo from 'src/assets/img/logo.png';
import { Link } from 'react-router';

type HeaderProps = {
  className?: string;
};

/**
 * Header component responsible for rendering the application header with logo and settings button.
 * @param className - Optional additional class names for styling the header.
 */
function Header({ className }: HeaderProps) {
  return (
    <header
      className={`fixed left-0 top-0 flex justify-between items-center w-full bg-white text-black shadow-default px-20 py-2 ${className}`}
    >
      <Link to="/" className="flex items-center gap-4">
        <img src={logo} alt="Logo" className="h-10" />
        <h1 className="text-h4 font-semibold">MQTT Device Configurator</h1>
      </Link>
    </header>
  );
}

export default Header;
