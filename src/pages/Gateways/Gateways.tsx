import Button from 'src/components/ui/Button';
import GatewayList from '../../features/gateways/components/GatewayList';
import { useNavigate } from 'react-router';

/**
 * GatewaysPage component responsible for displaying the list of gateways and navigation to add a new gateway.
 */
function GatewaysPage() {
  const navigate = useNavigate();

  return (
    <div className="gateways-list">
      <h2 className="subpage-title">Gateways List</h2>
      <GatewayList />
      <Button variant="primary" className="mt-15" onClick={() => navigate('/add-gateway')}>
        Add Gateway
      </Button>
    </div>
  );
}

export default GatewaysPage;
