import Button from 'src/components/ui/Button';
import Input from 'src/components/ui/Input';
import Alert from 'src/components/ui/Alert';
import type { DeviceAttributeOption } from 'src/types/deviceConfiguration';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import {
  resetSendingStatus,
  saveDeviceConfig,
  selectConfigDraft,
  selectConfigError,
  selectConfigSendingStatus,
  setAttributeRename,
  updateAttributeOption,
} from 'src/features/config/configSlice.ts';
import EditIcon from 'src/assets/img/edit-icon.svg';
import AcceptIcon from 'src/assets/img/accept-icon.svg';
import RenameCell from './components/RenameCell';
import { useEffect } from 'react';
import ProcessingFunctionCell from './components/ProcessingFunctionCell';

/**
 * ConfigTable component responsible for displaying and editing device configuration attributes.
 */
function ConfigTable() {
  const thClass = 'py-3 text-body-small px-6 text-left font-semibold bg-gray-500 text-white';
  const tdClass = 'py-3 text-body-small px-6 text-gray-600 relative';
  const tdKeyClass = 'py-3 text-body-small px-6 font-medium text-gray-800';

  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectConfigDraft);
  const sendingStatus = useAppSelector(selectConfigSendingStatus);
  const error = useAppSelector(selectConfigError);

  const devicePropertyOptions: DeviceAttributeOption[] = ['tag', 'field', 'ignore'];

  useEffect(() => {
    dispatch(resetSendingStatus());
  }, [dispatch]);

  const handleSubmit = async () => {
    try {
      await dispatch(saveDeviceConfig());
    } catch (error) {
      console.error('An error occurred while submitting the configuration:', error);
    }
  };

  return (
    <div className="config-table">
      <table
        className={`border border-gray-500 rounded-lg box-sizing-border-collapse ${sendingStatus === 'saving' ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <thead>
          <tr>
            <th className={`${thClass}`}>Attribute</th>
            <th className={`${thClass}`}>Custom Name</th>
            <th className={`${thClass}`}>Example value</th>
            <th className={`${thClass}`}>Option</th>
            <th className={`${thClass}`}>Processing Function</th>
          </tr>
        </thead>
        <tbody>
          {draft.config.attributes.map((attr, index) => (
            <tr key={attr.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
              <td className={`${tdKeyClass}`}>{attr.name}</td>
              <td className={`${tdClass}`}>
                <RenameCell
                  attribute={attr}
                  onSave={(v) => {
                    dispatch(setAttributeRename({ attributeName: attr.name, rename: v || undefined }));
                    dispatch(resetSendingStatus());
                  }}
                  editIconSrc={EditIcon}
                  saveIconSrc={AcceptIcon}
                  inputId={`rename-${attr.name}`}
                />
              </td>
              <td className={tdClass}>{attr.value ? String(attr.value) : <span className="text-red-500">N/A</span>}</td>
              <td className={tdClass}>
                <Input
                  type="select"
                  value={attr.option}
                  onChange={(v) => {
                    const newValue = v as DeviceAttributeOption;
                    dispatch(updateAttributeOption({ attributeName: attr.name, value: newValue }));
                    dispatch(resetSendingStatus());
                  }}
                  options={devicePropertyOptions.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  placeholder="Select option"
                  id={`attr-name-${attr.name}`}
                  name={`attr-name-${attr.name}`}
                  className="w-full min-h-20"
                />
              </td>
              <td className={tdClass}>
                <ProcessingFunctionCell attribute={attr} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttons flex gap-4">
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="mt-4 py-5 px-10"
          disabled={sendingStatus === 'saving'}
        >
          Save Config
        </Button>
      </div>

      {sendingStatus === 'succeeded' && (
        <Alert type="success" message="Configuration submitted successfully." className="mt-4" />
      )}
      {sendingStatus === 'failed' && error && <Alert type="error" message={error} className="mt-4" />}
    </div>
  );
}

export default ConfigTable;
