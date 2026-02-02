import { useEffect, useRef, useState } from 'react';
import Input from 'src/components/ui/Input';
import AiIcon from 'src/assets/img/ai-icon.png';
import type { DeviceConfigAttribute } from 'src/types/deviceConfiguration';
import { useAppDispatch } from 'src/app/store/hooks';
import { suggestCustomSingleName } from 'src/features/config/configSlice';

type RenameCellProps = {
  inputId: string;
  attribute: DeviceConfigAttribute;
  onSave: (next?: string) => void;
  editIconSrc: string;
  saveIconSrc?: string;
  placeholder?: string;
  className?: string;
  disabledExternally?: boolean;
};

/**
 * RenameCell components responsible for rendering a cell that allows renaming an attribute.
 *  @param inputId - ID for the input element
 * @param value - Current value of the attribute.
 * @param onSave - Callback function to save the new name.
 * @param editIconSrc - Source URL for the edit icon.
 * @param saveIconSrc - Source URL for the save icon.
 * @param placeholder - Placeholder text for the input.
 * @param className - Additional CSS classes for styling.
 * @param disabledExternally - Whether the input is disabled externally.
 * @returns
 */
const RenameCell = ({
  attribute,
  onSave,
  editIconSrc,
  saveIconSrc,
  inputId,
  placeholder = 'Enter name',
  className = '',
  disabledExternally = false,
}: RenameCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string>(attribute.rename ?? '');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isEditing) setDraft(attribute.rename ?? '');
  }, [attribute.rename, isEditing]);

  useEffect(() => {
    if (isEditing && !disabledExternally) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isEditing, disabledExternally]);

  const handleToggle = () => {
    if (isEditing) {
      const normalized = draft.trim() === '' ? undefined : draft.trim();
      onSave(normalized);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabledExternally) {
      handleToggle();
    }
  };

  const handleSuggestName = async () => {
    try {
      await dispatch(suggestCustomSingleName(attribute.name));
    } catch (error) {
      console.error('Error fetching name suggestion:', error);
    }
  };

  const disabled = !isEditing || disabledExternally;

  return (
    <div className={`relative flex gap-1 items-center ${className}`}>
      <Input
        ref={inputRef}
        type="text"
        id={inputId}
        name={inputId}
        value={draft}
        placeholder={placeholder}
        onChange={(v) => setDraft(v as string)}
        disabled={disabled}
        className={`!p-0 flex items-center gap-4 ${isEditing || !draft ? 'font-normal' : 'font-bold'}`}
        onKeyDown={handleKeyDown}
      />
      <div className="buttons flex gap-2">
        <button type="button" onClick={handleSuggestName} className="cursor-pointer">
          <img src={AiIcon} alt={'AI Suggest'} className="w-10 h-10 object-contain" />
        </button>
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isEditing ? 'Save custom name' : 'Edit custom name'}
          className="p-1 cursor-pointer"
          disabled={disabledExternally}
        >
          <img
            src={isEditing ? (saveIconSrc ?? editIconSrc) : editIconSrc}
            alt={isEditing ? 'Save' : 'Edit'}
            className="w-8 h-8 object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default RenameCell;
