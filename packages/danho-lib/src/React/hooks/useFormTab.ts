import { MutableRefObject, useMemo, useRef } from '../React';
import { useKeybind } from './useKeybind';

type ReferenceResolve = MutableRefObject<HTMLFormElement> | string;

export function useFormTab(): {
  onKeyDown: (e: React.KeyboardEvent) => void;
};
export function useFormTab(ref: MutableRefObject<HTMLFormElement>, ...exclude: Array<ReferenceResolve>): void;
export function useFormTab(selector: string, ...exclude: Array<ReferenceResolve>): void;
export function useFormTab(refResolve?: ReferenceResolve, ...exclude: Array<ReferenceResolve>) {
  const formRef = refResolve ? typeof refResolve === 'string' ? useRef<HTMLFormElement>(document.querySelector(refResolve)) : refResolve : undefined;
  const includedInputs = useMemo(() => {
    if (!formRef?.current) return [] as HTMLInputElement[];

    const inputs = Array.from(formRef.current?.querySelectorAll('input, select, textarea') ?? []);
    exclude.forEach(excluded => {
      const excludedRef = typeof excluded === 'string' ? document.querySelector(excluded) : excluded.current;
      if (excludedRef) inputs.splice(inputs.indexOf(excludedRef), 1);
    });
    return inputs;
  }, [formRef, exclude]);

  useKeybind(['Tab'], formRef ? e => {
    e.preventDefault();
    const currentIndex = includedInputs.indexOf(e.target as HTMLInputElement);
    const nextIndex = (currentIndex + 1) % includedInputs.length;
    (includedInputs[nextIndex] as HTMLInputElement).focus();
  } : () => {});

  if (!formRef) return {
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      e.preventDefault();
      const forms = document.querySelectorAll('form');
      const form = Array.from(forms).find(form => form.contains(e.target as HTMLInputElement));
      if (!form) return;

      const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
      const currentIndex = inputs.indexOf(e.target as HTMLInputElement);
      const nextIndex = (currentIndex + 1) % inputs.length;
      (inputs[nextIndex] as HTMLInputElement).focus();
    }
  }
}