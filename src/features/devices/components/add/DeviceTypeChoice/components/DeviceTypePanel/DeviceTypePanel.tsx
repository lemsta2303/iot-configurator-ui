import { useNavigate } from 'react-router-dom';
import type { DeviceType } from 'src/types/deviceType.ts';

type DeviceTypeChoiceProps = {
  type: DeviceType;
  img: string;
};

/**
 * DeviceTypePanel component that displays a device Type with an image.
 * @param type - The device Type to display.
 * @param img - The image URL for the device Type.
 * @returns {JSX.Element} The rendered DeviceTypePanel component.
 */
function DeviceTypePanel({ type, img }: DeviceTypeChoiceProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    const typePath = type === 'zigbee' ? 'zigbee' : 'lora-profile';
    navigate(`/add-device/${typePath}`);
  };

  return (
    <div
      className="max-w-150 flex flex-col items-center justify-center gap-2 p-[3rem] rounded-lg shadow-lg hover:shadow-xl border-b-4 border-transparent hover:border-primary transition cursor-pointer bg-gray-50"
      onClick={handleClick}
    >
      <img src={img} alt={type ?? ''} />
    </div>
  );
}

export default DeviceTypePanel;
