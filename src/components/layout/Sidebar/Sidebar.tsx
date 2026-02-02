import Menu from './components/Menu';

/**
 * Sidebar component responsible for rendering the sidebar menu.
 */
function Sidebar() {
  return (
    <div className="min-h-full bg-gray-100 text-black shadow-default flex flex-col ">
      <Menu />
    </div>
  );
}

export default Sidebar;
