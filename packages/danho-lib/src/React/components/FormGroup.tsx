import { FormSwitch, TextInput, Select, SingleSelect, Text } from '@dium/components';
import { ClassNamesUtils } from '@danho-lib/Utils/ClassNames';
import { StringUtils } from '@danho-lib/Utils';

import React, {
  HTMLInputTypeAttribute, MutableRefObject, ForwardedRef,
  useRef, forwardRef, useCallback,
  useState,
} from '../React';
import { classNames } from '../utils';
import { useDebounceCallback } from '../hooks';
import { EphemeralEye, EphemeralEyeSize } from './Icons';

const InputModule = ClassNamesUtils.combineModuleByKeys<(
  | 'disabled'
  | 'editable'
  | 'error'
  | 'focused'
  | `input${'' | 'Default' | 'Error' | 'Mini' | 'Prefix' | 'Wrapper'}`
) | (
    | 'container'
    | 'control'
    | `disabled${'' | 'Text'}`
    | 'dividerDefault'
    | 'labelRow'
    | 'note'
    | 'title'
  )>(
    ['inputWrapper', 'inputDefault'],
    ['dividerDefault', 'title']
  );

// #region Types
type InputValueType = string | number | boolean | undefined;
type BaseModel = Record<string, InputValueType>;

type OptionalProps<T extends InputValueType> = Partial<{
  required: boolean;
  disabled: boolean;
  debounce: number;

  name: string;
  errorText: string;
  defaultValue: T extends boolean ? never : T;
  type: (
    T extends number ? 'number' :
    T extends boolean ? 'checkbox' :
    T extends string ? 'text' | 'email' | 'password' | 'url' | 'tel' | 'search' | 'color' | 'date' | 'datetime-local' | 'month' | 'week' | 'time' | 'file' :
    T extends undefined ? 'text'
    : never
  );
} & ({} | {
  type: 'password',
  ephemeralEyeSize?: EphemeralEyeSize;
} | {
  type: 'number',
  min: number;
  max: number;
})>;

type SpreadProps<T extends InputValueType> = (
  & OptionalProps<T>
  & {
    value: T;
    onChange: (value: T) => void;
    label: string;
  }
);

type ModelProps<
  TRecord extends BaseModel,
  TKey extends keyof TRecord,
  T extends TRecord[TKey]
> = (
    & OptionalProps<T>
    & {
      model: TRecord;
      property: TKey;

      value?: T;
      label?: string;
    } & ({
      onModelChange: (model: TRecord, property: TKey, value: T) => void;
      onChange?: (value: T) => void;
    } | {
      onChange: (value: T) => void;
      onModelChange?: (model: TRecord, property: TKey, value: T) => void;
    })
  );

// #endregion

export function FormItem<T extends InputValueType>(props: SpreadProps<T>): JSX.Element {
  // Required
  const { value, label, type } = props;

  return <FormGroup {...props}
    name={props.name ?? label}
    inputType={type ?? getInputType(value)}
  />;
}

export function FormItemFromModel<
  TRecord extends BaseModel,
  TKey extends keyof TRecord,
  T extends TRecord[TKey]
>(props: ModelProps<TRecord, TKey, T>): JSX.Element {
  // Required
  const { model, property } = props;
  // Partially required
  const onModelChange = 'onModelChange' in props ? props.onModelChange : (m: TRecord, p: TKey, v: T) => { };
  const onChange = 'onChange' in props ? props.onChange : (v: T) => { };
  // Optional
  const { label, value } = props;

  return <FormGroup
    {...props}
    name={property as string}
    label={label ?? StringUtils.pascalCaseFromCamelCase(property as string)}
    inputType={props.type ?? getInputType(value ?? model[property])}
    value={value ?? model[property]}
    onChange={(v: T) => {
      onModelChange(Object.assign({}, model, { [property]: v }), property, v);
      onChange(v);
    }}
  />;
}

type FormGroupProps<T extends string | number | boolean> = {
  name: string;
  label: string;
  inputType: HTMLInputTypeAttribute;
  value: T;
  onChange: (value: T) => void;

  required?: boolean;
  disabled?: boolean;
  errorText?: string;
  defaultValue?: T extends boolean ? never : T;
  debounce?: number;
  
  ephemeralEyeSize?: EphemeralEyeSize;
  min?: number;
  max?: number;
};

function FormGroup<T extends string | number | boolean>(props: FormGroupProps<T>) {
  const [internal, setInternal] = useState<T>(props.value);
  const [inputType, setInputType] = useState(props.inputType);

  const debounceChange = useDebounceCallback((value: T) => props.onChange(value), props.debounce);
  const onChange = useCallback((newValue: T) => {
    setInternal(newValue as T);
    if (props.debounce) debounceChange(newValue as T);
    else props.onChange(newValue as T);
  }, [props.debounce, props.onChange, props.inputType, props.value]);

  const className = classNames(
    "danho-form-group__input",
    `danho-form-group__${props.inputType}`,
    props.required && `danho-form-group__${props.inputType}--required`,
    props.disabled && InputModule.disabled,
    InputModule.inputDefault,
  );

  const toggleInputType = (ref: ForwardedRef<HTMLInputElement>) => () => {
    if (ref && 'current' in ref && ref.current) {
      // Save the current cursor position
      const cursorPosition = ref.current.selectionStart;

      setInputType(current => current === 'text' ? 'password' : 'text');

      // Restore the cursor position after the input type changes
      setTimeout(() => {
        if (ref.current && cursorPosition !== null) {
          ref.current.setSelectionRange(cursorPosition, cursorPosition);
        }
      }, 0); // Use a timeout to ensure the DOM updates before restoring the cursor
    }
  };

  return (
    <EmptyFormGroup label={props.label} name={props.name} onClick={() => {
      if (props.inputType === 'checkbox') return;
    }}>
      {ref => (
        <>
          {props.inputType === 'checkbox' ? (
          <FormSwitch className={className}
            value={typeof internal === 'boolean' ? internal : undefined}
            disabled={props.disabled}
            onChange={checked => onChange(checked as T)}
          />
          ) : (
          <div className="input-container">
            <input className={className} ref={ref}
              type={inputType}
              placeholder={props.inputType === 'checkbox' ? undefined : props.label}
              name={props.name}
              required={props.required}
              disabled={props.disabled}
              defaultValue={props.defaultValue}
              checked={typeof internal === 'boolean' ? internal : undefined}
              value={typeof internal === 'boolean' ? undefined : internal}
              min={props.inputType === 'number' ? props.min : undefined}
              max={props.inputType === 'number' ? props.max : undefined}
              onChange={e => {
                const newValue = props.inputType === 'checkbox'
                  ? e.currentTarget.checked
                  : typeof props.value === 'number' ? Number(e.target.value) : e.currentTarget.value;
                onChange(newValue as T);
              }}
            />
            {props.inputType === 'password' && (
              <EphemeralEye size={props.ephemeralEyeSize} line={inputType !== 'password'} onClick={toggleInputType(ref)} />
            )}
          </div>
          )}
          {props.errorText 
            ? <Text variant='text-sm/normal' className={ClassNamesUtils.ColorClassNames.colorDanger}>{props.errorText}</Text> 
            : null
          }
        </>
      )}
    </EmptyFormGroup>
  );
}

type EmptyFormGroupProps = Pick<FormGroupProps<any>, 'name' | 'label'> & {
  children: (ref: ForwardedRef<HTMLInputElement>) => JSX.Element;
  onClick?: () => void;
};
export const EmptyFormGroup = forwardRef<HTMLInputElement, EmptyFormGroupProps>((props, ref) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const mergedRef = ref || internalRef;

  return (
    <div className="danho-form-group" onClick={() => {
      if (mergedRef && 'current' in mergedRef && mergedRef.current) mergedRef.current.focus();
      props.onClick?.();
    }}>
      <label className={classNames("danho-form-group__label", InputModule.title)} htmlFor={props.name}>
        {props.label}
      </label>
      {props.children(mergedRef)}
    </div>
  );
});

function getInputType(value: InputValueType): HTMLInputTypeAttribute {
  if (typeof value === 'boolean') return 'checkbox';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') {
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return 'email';
    if (/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(value)) return 'url';
    if (/^\d{10}$/.test(value)) return 'tel';
    if (/^\d{3}-\d{3}-\d{4}$/.test(value)) return 'tel';
    if (/^#[0-9A-F]{6}$/i.test(value)) return 'color';
    if (/\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
    if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) return 'datetime-local';
  }
  return 'text';
}