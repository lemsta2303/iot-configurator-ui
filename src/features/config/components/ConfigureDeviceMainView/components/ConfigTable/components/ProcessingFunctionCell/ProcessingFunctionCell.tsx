import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import Input from 'src/components/ui/Input';
import { resetSendingStatus, selectProcessingFunctions, setProcessingFunction } from 'src/features/config/configSlice';
import type { DeviceConfigAttribute } from 'src/types/deviceConfiguration';
import type { ProcessingFunctionType } from 'src/types/processingFunctions';

type ProcessingFunctionCellProps = {
  attribute: DeviceConfigAttribute;
};

/**
 * ProcessingFunctionCell component allows selecting a processing function for a given device configuration attribute.
 * @param attribute - The device configuration attribute for which the processing function is being selected.
 */
const ProcessingFunctionCell = ({ attribute }: ProcessingFunctionCellProps) => {
  const dispatch = useAppDispatch();
  const processingFunctions = useAppSelector(selectProcessingFunctions);

  const functionLabels: Record<string, string> = {};

  const addFunctionLabel = (fnName: string, fnLabel: string) => {
    functionLabels[fnName] = fnLabel;
  };

  const computeFunctionSortWeight = (fn: ProcessingFunctionType): number => {
    if (fn.name === attribute.proc) {
      // currently selected option gets highest priority
      return 10;
    }
    if (fn.value_type === 'noneType') {
      // 'none' option gets second priorety
      return 9;
    }
    for (const tag of fn.tags) {
      if (attribute.name.toLowerCase().includes(tag.toLowerCase())) {
        // higher priority if attribute name matches tag
        addFunctionLabel(fn.name, ' (suggested)');
        return 8;
      }
      if (attribute.rename?.toLowerCase().includes(tag.toLowerCase())) {
        // slightly lower priority if custom name matches tag
        addFunctionLabel(fn.name, ' (suggested)');
        return 7;
      }
      if (tag === 'generic') {
        // generic tag mid priority
        addFunctionLabel(fn.name, ' (generic)');
        return 6;
      }
    }

    // lowest priority otherwise
    addFunctionLabel(fn.name, ' (other)');
    return 0;
  };

  const processingFunctionSortedAndFiltered = processingFunctions
    .filter((proc) => {
      if (proc.value_type === 'noneType') {
        // always include 'none' option
        return true;
      }
      if (attribute.type === 'int' || attribute.type === 'float') {
        return proc.value_type === 'number';
      }
      if (attribute.type === 'string') {
        return proc.value_type === 'string';
      }
      if (attribute.type === 'bool') {
        return proc.value_type === 'bool';
      }
      return false;
    })
    .sort((a, b) => computeFunctionSortWeight(b) - computeFunctionSortWeight(a));

  return (
    <Input
      type="select"
      value={attribute.proc || ''}
      onChange={(v) => {
        const newProc = v as string;
        dispatch(setProcessingFunction({ attributeName: attribute.name, proc: newProc || null }));
        dispatch(resetSendingStatus());
      }}
      options={processingFunctionSortedAndFiltered.map((proc) => ({
        value: proc.name,
        label: proc.display_name + (functionLabels[proc.name] || ''),
      }))}
      placeholder="Select option"
      id={`attr-process-fn-${attribute.name}`}
      name={`attr-process-fn-${attribute.name}`}
      className="w-full min-h-20"
    />
  );
};

export default ProcessingFunctionCell;
