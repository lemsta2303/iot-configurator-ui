import { useEffect } from 'react';
import GatewayCard from 'src/features/gateways/components/GatewayList/components/GatewayCard/GatewayCard.tsx';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks.ts';
import {
  fetchGateways,
  selectGateways,
  selectGatewaysLoadingError,
  selectGatewaysLoading,
} from 'src/features/gateways/gatewaysSlice.ts';
import Alert from 'src/components/ui/Alert';

/**
 * GatewayList component responsible for displaying a list of gateways.
 */
function GatewayList() {
  const dispatch = useAppDispatch();
  const gateways = useAppSelector(selectGateways);
  const loading = useAppSelector(selectGatewaysLoading);
  const error = useAppSelector(selectGatewaysLoadingError);

  useEffect(() => {
    dispatch(fetchGateways());
  }, [dispatch]);

  if (loading) {
    return <Alert type="info" message="Loading..." />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (gateways.length === 0) {
    return <Alert type="warning" message="No gateways found." />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {gateways.length !== 0 && gateways.map((gateway) => <GatewayCard key={gateway.gateway_id} gateway={gateway} />)}
    </ul>
  );
}

export default GatewayList;
