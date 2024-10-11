import { React, useEffect, useState } from '../React';

type Props = {
  value: number;

  min?: number;
  max?: number;
  hideOnMin?: boolean;
  hideOnMax?: boolean;

  autofillPerSecond?: number | (() => number)

  barColor?: string;
  fillColor?: string;
};
export function Progress({ value, ...props }: Props) {
  const [internalValue, setInternalValue] = useState(value);

  const { min = 0, max = 100, fillColor, barColor, autofillPerSecond } = props;
  const { hideOnMin = false, hideOnMax = false } = props;
  const percentage = Math.min(100, Math.max(0, ((internalValue - min) / (max - min)) * 100));
  // console.log(percentage, { min, max, internalValue })

  useEffect(() => {
    if (!autofillPerSecond) return;

    const interval = setInterval(() => {
      if (percentage < 100) {
        setInternalValue(internalValue => {
          const newValue = internalValue + (typeof autofillPerSecond === 'number' ? autofillPerSecond : autofillPerSecond());
          return newValue <= max ? newValue : internalValue;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autofillPerSecond]);

  return (hideOnMin && percentage === 0) || (hideOnMax && percentage === 100) ? null : (
    <div className="progress-bar" style={{ backgroundColor: barColor }}>
      <div className="progress-bar__fill" style={{ backgroundColor: fillColor, width: `${percentage}%` }} />
    </div>
  );
}