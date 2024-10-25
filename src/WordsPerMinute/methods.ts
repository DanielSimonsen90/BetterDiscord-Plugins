import { log } from "@danho-lib/dium/api/logger";

import { typingEndTime, typingStartTime, wpm } from "./properties";
import { Highscores } from "./settings";

export function calculateWPM(messageContent: string) {
  // If, by mistake/debug, the start or end time is not set, return
  if (typingStartTime.hasNoValue() || typingEndTime.hasNoValue() || !messageContent) return;

  const timeDiffMs = typingEndTime.get() - typingStartTime.get(); // in milliseconds
  const timeDiffMin = timeDiffMs / 1000 / 60; // in minutes

  const wordCount = messageContent.trim().split(/\s+/).length;
  // For some reason, the !messageContent check is being ignored
  if (wordCount <= 1 || messageContent.trim() === '') return;

  const value = wordCount / timeDiffMin;
  if (value > 300) return; // This is a reasonable limit for typing speed
  wpm.set(value);
}

export function updateHighscores() {
  const {
    best, bestDate,
    today: storedTodayScore, todayDate
  } = Highscores.current;

  const current = wpm.get();
  const today = new Date().toLocaleDateString() === new Date(todayDate).toLocaleDateString() ? storedTodayScore : 0;
  const notification = (
    current > best ? `New best highscore! ${current} wpm`
    : current > today ? `New today's highscore! ${current} wpm`
    : null
  );

  if (!notification) return;

  Highscores.update({
    best: Math.max(best, current),
    bestDate: current > best ? new Date().toLocaleDateString() : new Date(bestDate).toLocaleDateString(),
    today: Math.max(today, current),
    todayDate: new Date().toLocaleDateString()
  });

  log(notification, Highscores.current, { best, today, todayDate });
  BdApi.UI.showToast(notification);
}
