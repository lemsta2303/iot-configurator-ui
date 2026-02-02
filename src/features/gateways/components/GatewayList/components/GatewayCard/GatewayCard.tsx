import { useAppDispatch } from 'src/app/store/hooks.ts';
import { deleteSingleGateway } from 'src/features/gateways/gatewaysSlice.ts';
import Button from 'src/components/ui/Button';
import type { Gateway } from 'src/types/gateway.ts';

type GatewayCardProps = {
  gateway: Gateway;
};

/**
 * GatewayCard component responsible for rendering individual gateway information and delete action.
 * @param gateway - The gateway object containing its details.
 */
function GatewayCard({ gateway }: GatewayCardProps) {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(deleteSingleGateway(gateway.gateway_id));
  };

  return (
    <li className="list-element">
      <div className="flex flex-col">
        {gateway.name && (
          <h3 className="text-body-large text-gray-800 hover:text-black font-semibold">{gateway.name}</h3>
        )}
        <h4 className="text-body-default text-gray-500 text-sm">{gateway.gateway_id}</h4>
      </div>
      <div className="buttons flex gap-4">
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </li>
  );
}

export default GatewayCard;
