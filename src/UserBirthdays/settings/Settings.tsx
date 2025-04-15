import { createSettings } from "@dium/settings";

export const Settings = createSettings({
	hideBirthdateIcon: false,
	hideBirthdateTimestamp: false,
	birthdateTimestampStyle: 'd',
	showBirthdayCalendar: true,
	showBirthdayOnNameTag: true,
	updateNotesOnCalendarChange: true,
	dateFormat: 'DD/MM/YYYY',
})

export const titles: Record<keyof typeof Settings.current, string> = {
	hideBirthdateIcon: `Hide the birthdate icon`,
	hideBirthdateTimestamp: `Hide the birthdate timestamp`,
	birthdateTimestampStyle: `Birthdate timestamp style`,
	showBirthdayCalendar: `Show birthday calendar in global navigation`,
	showBirthdayOnNameTag: `Show birthday on name tag`,
	updateNotesOnCalendarChange: `Update notes for users when adding their birthday to the calendar`,
	dateFormat: `Preferred date format`,
}