import { React } from '../React';

type Props = {
  value: number;

  min?: number;
  max?: number;

  hideOnMin?: boolean;
  hideOnMax?: boolean;

  barColor?: string;
  fillColor?: string;
}
export function Progress({ value, ...props }: Props) {
  const { min = 0, max = 100, fillColor, barColor } = props;
  const { hideOnMin = false, hideOnMax = false } = props;
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const barStyle = barColor ? { backgroundColor: barColor } : {};
  const fillStyle = fillColor ? { backgroundColor: fillColor, width: `${percentage}%` } : { width: percentage };

  return (hideOnMin && percentage === 0) || (hideOnMax && percentage === 100) ? null : (
    <div className="progress-bar" style={barStyle}>
      <div className="progress-bar__fill" style={fillStyle} />
    </div>
  );
}