import ConfigTable from './components/ConfigTable/ConfigTable';
import Alert from 'src/components/ui/Alert';
import { useAppSelector } from 'src/app/store/hooks';
import { selectConfigDraft, selectConfigError, selectConfigLoadingStatus } from 'src/features/config/configSlice.ts';
import ConfigOptions from './components/ConfigOptions';

/**
 * ConfigureDeviceMainView component responsible for rendering the main view for configuring a device.
 */
function ConfigureDeviceMainView() {
  const draft = useAppSelector(selectConfigDraft);
  const loadingStatus = useAppSelector(selectConfigLoadingStatus);
  const error = useAppSelector(selectConfigError);

  if (loadingStatus === 'loading') {
    return <Alert type="info" message="Loading device configuration..." />;
  }

  if (loadingStatus === 'failed') {
    return <Alert type="error" message={error ?? 'Failed to fetch device data'} />;
  }
  return (
    <div>
      <h2 className="flex flex-col items-baseline mb-5">
        <span className="subpage-title !mb-0">{draft.name}</span>
        <span className="text-4xl -mt-2 text-gray-500  z-index-0">Device configuration</span>
      </h2>

      {draft.config.attributes?.length ? (
        <div className="flex gap-6">
          <ConfigTable />
          <ConfigOptions />
        </div>
      ) : (
        <Alert
          type="warning"
          message="No attributes available for device. Please ensure the device is configured correctly."
        />
      )}
    </div>
  );
}

export default ConfigureDeviceMainView;
