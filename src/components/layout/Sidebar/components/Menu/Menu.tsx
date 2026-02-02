import { NavLink } from 'react-router-dom';
import { menuItems } from './constants';

/**
 * Menu component responsible for rendering the navigation menu with active link highlighting.
 */
function Menu() {
  const baseMainStyle =
    'text-body-small py-5 w-100 pl-10 block transition rounded-md hover:bg-gray-200 hover:text-black border-l-4 hover:border-primary';
  const baseSubStyle = 'text-body-small py-5 w-full pl-20 block transition rounded-md hover:text-primary border-l-4';

  const activeMainStyle = 'text-black bg-gray-200 border-primary font-semibold';
  const inactiveMainStyle = 'border-transparent text-gray-500';

  const activeSubStyle = 'border-transparent text-primary font-semibold';
  const inactiveSubStyle = 'border-transparent text-gray-500';

  const renderLink = (to: string, label: string, isSub = false) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          isSub ? baseSubStyle : baseMainStyle,
          isActive ? (isSub ? activeSubStyle : activeMainStyle) : isSub ? inactiveSubStyle : inactiveMainStyle,
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  );

  return (
    <nav className="list-none overflow-y-auto max-h-[calc(100vh-80px)]">
      <ul className="flex flex-col gap-2 pr-2 pt-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            {renderLink(item.path, item.label)}
            {item.subItems && (
              <ul>
                {item.subItems.map((subItem) => (
                  <li key={subItem.path}>{renderLink(subItem.path, subItem.label, true)}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Menu;
