import LoraDeviceForm from 'src/features/devices/components/add/LoraDeviceForm';

/**
 * LoraDeviceAddingPage component responsible for rendering the Lora device adding form.
 */
function LoraDeviceAddingPage() {
  return (
    <>
      <h2 className="subpage-title">Add Lora Device</h2>
      <LoraDeviceForm />
    </>
  );
}

export default LoraDeviceAddingPage;
