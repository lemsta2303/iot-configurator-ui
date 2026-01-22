import GatewayForm from '../../features/gateways/components/GatewayForm';

/**
 * AddGatewayPage component responsible for rendering the add gateway form page.
 */
function AddGatewayPage() {
  return (
    <div className="add-gateway">
      <h2 className="subpage-title">Add Gateway</h2>
      <GatewayForm />
    </div>
  );
}

export default AddGatewayPage;
