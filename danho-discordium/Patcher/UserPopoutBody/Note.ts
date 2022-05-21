import { Snowflake } from "@discord"

export type NoteSection = {
    children: [
        eyebrow: React.ReactElement<NoteEyebrow>,
        note: React.ReactElement<Note>
    ],
}
export type NoteEyebrow = {
    children: "Note",
    className: string,
    color: string,
    level: number,
    variant: "eyebrow"
}
export type Note = {
    autoFocus: boolean,
    className: string,
    userId: Snowflake,
}