import DeviceTypePanel from './components/DeviceTypePanel';
import zigbeeImg from 'src/assets/img/zigbee-logo.png';
import lorawanImg from 'src/assets/img/lora-logo.png';

/**
 * DeviceTypeChoice component responsible for allowing users to select a device type they want to add.
 */
function DeviceTypeChoice() {
  return (
    <div className="flex gap-10">
      <DeviceTypePanel type="zigbee" img={zigbeeImg} />
      <DeviceTypePanel type="lora" img={lorawanImg} />
    </div>
  );
}

export default DeviceTypeChoice;
