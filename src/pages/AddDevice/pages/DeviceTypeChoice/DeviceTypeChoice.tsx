import DeviceTypeChoice from 'src/features/devices/components/add/DeviceTypeChoice';

/**
 * DeviceTypeChoicePage component responsible for rendering the device type choice interface.
 */
function DeviceTypeChoicePage() {
  return (
    <>
      <h2 className="subpage-title">Select Device Type</h2>
      <DeviceTypeChoice />
    </>
  );
}

export default DeviceTypeChoicePage;
