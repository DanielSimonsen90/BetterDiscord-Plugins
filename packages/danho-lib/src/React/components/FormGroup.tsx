import { StringUtils } from '@danho-lib/Utils';
import { React, HTMLInputTypeAttribute, useRef } from '../React';
import { classNames } from '../utils';
import { FormSwitch, TextInput, Select, SingleSelect } from '@dium/components';
import { ClassNamesUtils } from '@danho-lib/Utils/ClassNames';
import { MutableRefObject } from 'react';

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
  defaultValue: T extends boolean ? never : T;
  type: (
    T extends number ? 'number' :
    T extends boolean ? 'checkbox' :
    T extends string ? 'text' | 'email' | 'password' | 'url' | 'tel' | 'search' | 'color' | 'date' | 'datetime-local' | 'month' | 'week' | 'time' | 'file' :
    T extends undefined ? 'text'
    : never
  );
}>;

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
    name={label}
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
      onModelChange(model, property, v);
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
  defaultValue?: T extends boolean ? never : T;
};

function FormGroup<T extends string | number | boolean>(props: FormGroupProps<T>) {
  const className = classNames(
    "danho-form-group__input",
    `danho-form-group__${props.inputType}`,
    props.required && `danho-form-group__${props.inputType}--required`,
    props.disabled && InputModule.disabled,
    InputModule.inputDefault,
  );

  return (
    <EmptyFormGroup label={props.label} name={props.name} onClick={() => {
      if (props.inputType === 'checkbox') return;
    }}>
      {ref => (
        props.inputType === 'checkbox' ? (
          <FormSwitch className={className}
            value={typeof props.value === 'boolean' ? props.value : undefined}
            disabled={props.disabled}
            onChange={checked => props.onChange(checked as T)}
          />
        ) : (
          <input className={className} ref={ref}
            type={props.inputType}
            name={props.name}
            required={props.required}
            disabled={props.disabled}
            defaultValue={props.defaultValue}
            checked={typeof props.value === 'boolean' ? props.value : undefined}
            value={typeof props.value === 'boolean' ? undefined : props.value}
            onChange={e => {
              const newValue = props.inputType === 'checkbox'
                ? e.currentTarget.checked
                : typeof props.value === 'number' ? Number(e.target.value) : e.currentTarget.value;
              props.onChange(newValue as T);
            }}
          />
        )
      )}
    </EmptyFormGroup>
  );
}

type EmptyFormGroupProps = Pick<FormGroupProps<any>, 'name' | 'label'> & {
  children: (ref: MutableRefObject<HTMLInputElement>) => JSX.Element;
  onClick?: () => void;
}
export function EmptyFormGroup(props: EmptyFormGroupProps) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="danho-form-group" onClick={() => {
      if (ref.current) ref.current.focus();
      props.onClick?.();
    }}>
      <label className={classNames("danho-form-group__label", InputModule.title)} htmlFor={props.name}>
        {props.label}
      </label>
      {props.children(ref)}
    </div>
  );
}

function getInputType(value: InputValueType): HTMLInputTypeAttribute {
  if (typeof value === 'boolean') return 'checkbox';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') {
    if (value.includes('@')) return 'email';
    if (value.includes('http')) return 'url';
    if (value.includes('+')) return 'tel';
    if (value.includes('#')) return 'color';
    if (value.includes('T')) return 'datetime-local';
    if (value.includes('-')) return 'date';
    if (value.includes(':')) return 'time';
  }
  return 'text';
}