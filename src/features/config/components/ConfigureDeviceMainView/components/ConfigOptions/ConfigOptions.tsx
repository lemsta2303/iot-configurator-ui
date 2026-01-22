import Button from 'src/components/ui/Button';
import {
  resetConfig,
  resetSendingStatus,
  selectConfigSendingStatus,
  selectNameSuggestionCaseFormat,
  setAttributesOptionsBasedOnType,
  setSuggestionCaseFormat,
  suggestCustomNames,
} from 'src/features/config/configSlice';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import Modal from 'src/components/ui/Modal';
import EditNameForm from '../EditNameForm';

const NAME_FORMATS = [
  { value: 'camel', label: 'camelCase' },
  { value: 'snake', label: 'snake_case' },
  { value: 'pascal', label: 'PascalCase' },
  { value: 'kebab', label: 'kebab-case' },
];

/**
 * ConfigOptions component responsible for rendering the configuration panel with buttons and settings for setting config.
 */
function ConfigOptions() {
  const dispatch = useAppDispatch();
  const sendingStatus = useAppSelector(selectConfigSendingStatus);
  const isSaving = sendingStatus === 'saving';
  const caseFormat = useAppSelector(selectNameSuggestionCaseFormat);

  const handleSuggestNames = async () => {
    try {
      await dispatch(suggestCustomNames());
    } catch (error) {
      console.error('Error fetching suggested names:', error);
    }
  };

  return (
    <div className="config-panel flex flex-col">
      <div className="config-menu flex flex-col gap-2">
        <Modal btnContent={'Edit Device Name'} content={<EditNameForm />} />
        <Button
          onClick={() => {
            dispatch(setAttributesOptionsBasedOnType());
            dispatch(resetSendingStatus());
          }}
          variant="secondary"
          className="py-5 px-10 font-semibold"
          disabled={isSaving}
        >
          Apply Type-Based Config
        </Button>

        <div
          className={`rounded-md border border-gray-300 bg-gray-100 p-3 flex flex-col gap-3 ${
            isSaving ? 'opacity-60 pointer-events-none' : ''
          }`}
        >
          <h4 className="font-medium text-gray-700 text-lg">Name format</h4>

          <div className="grid grid-cols-2 gap-2">
            {NAME_FORMATS.map((fmt) => {
              const isActive = caseFormat === fmt.value;
              return (
                <button
                  key={fmt.value}
                  type="button"
                  onClick={() => dispatch(setSuggestionCaseFormat(fmt.value as typeof caseFormat))}
                  className={`cursor-pointer rounded-md border px-2 py-1.5 transition 
                    ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {fmt.label}
                </button>
              );
            })}
          </div>

          <Button onClick={handleSuggestNames} variant="secondary" className="py-5 px-10" disabled={isSaving}>
            Suggest Custom Names
          </Button>
        </div>
        <Button
          onClick={() => {
            dispatch(resetConfig());
            dispatch(resetSendingStatus());
          }}
          variant="warning"
          className="py-5 px-10 mt-10 font-semibold"
          disabled={isSaving}
        >
          Reset Config
        </Button>
      </div>
    </div>
  );
}

export default ConfigOptions;
