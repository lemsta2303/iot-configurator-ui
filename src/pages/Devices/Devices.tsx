import { useParams } from 'react-router-dom';
import DevicesList from '../../features/devices/components/display/DevicesList';

/**
 * DevicesPage component responsible for displaying the list of devices.
 */
function DevicesPage() {
  const { type } = useParams<{ type: string }>();
  return (
    <div className="devices-list">
      <h2 className="subpage-title">Device List{type ? `: ${type.toUpperCase()}` : ''}</h2>
      <DevicesList />
    </div>
  );
}

export default DevicesPage;
