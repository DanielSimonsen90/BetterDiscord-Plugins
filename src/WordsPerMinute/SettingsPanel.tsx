import { React, useMemo } from '@react';
import { Settings, Highscores } from './settings';
import { getMeta } from '@dium/meta';

const PluginName = getMeta().name;

const ResetButton: React.FC<{
  onClick: () => void;
  children?: string;
  danger?: boolean;
}> = ({ children = 'Reset', onClick, danger }) => (
  <button className={`bd-button bd-button-outlined ${danger ? 'bd-button-color-red' : 'bd-button-color-primary'}`}
    onClick={onClick}
  >{children}</button>
);

const SettingsGroup: React.FC<{
  settingsKey: keyof Settings;
  title: string;
  readonly?: boolean;
}> = ({ settingsKey, title, readonly }) => {
  const [current, defaults, set] = Settings.useStateWithDefaults();

  return (
    <div className={`${PluginName}-${settingsKey}-setting`}>
      <h3>{title}</h3>
      <div className="bd-flex bd-flex-horizontal" style={{ gap: '.5rem' }}>
        <input type={
          typeof defaults[settingsKey] === 'number' ? 'number'
            : typeof defaults[settingsKey] === 'boolean' ? 'checkbox'
              : 'text'}
          value={current[settingsKey]}
          readOnly={readonly}
          onChange={event => {
            set({ [settingsKey]: event.target.value });
          }}
        />
        <ResetButton onClick={() => { set({ [settingsKey]: defaults[settingsKey] }); }}></ResetButton>
      </div>
    </div>
  );
};

const HighscoresGroup: React.FC<{
  type: 'best' | 'today';
}> = ({ type }) => {
  const { best, bestDate, today, todayDate } = Highscores.useCurrent();
  const [value, date] = useMemo(() => type === 'best'
    ? [best, new Date(bestDate)]
    : [today, new Date(todayDate)],
    [type, best, bestDate, today, todayDate]
  );

  return (
    <div className={`${PluginName}-${type}`}>
      <h3>{type === 'best' ? 'Best' : `Today's`} Highscore</h3>
      <p>
        <span id={`${PluginName}-${type}`}>{value} wpm</span>
        <span id={`${PluginName}-${type}-date`}>{date.toLocaleDateString()}</span>
      </p>
    </div>
  );
};

export default function SettingsPanel() {
  const { todayDate } = Highscores.current;

  if (new Date(todayDate).toLocaleDateString() !== new Date().toLocaleDateString()) {
    Highscores.update({ today: 0, todayDate: new Date().toLocaleDateString() });
  }

  return (
    <div className={`${PluginName}-settings`} style={{ width: '100%' }}>
      <SettingsGroup settingsKey="leftAlign" title="Left Align" />

      <div className={`${PluginName}-highscores`}>
        <h3>Highscores</h3>
        <section className={`${PluginName}-highscores-container`}>
          <HighscoresGroup type="best" />
          <HighscoresGroup type="today" />
        </section>
        <ResetButton danger onClick={() => Highscores.reset()}>Reset Highscores</ResetButton>
      </div>
    </div>
  );
}
