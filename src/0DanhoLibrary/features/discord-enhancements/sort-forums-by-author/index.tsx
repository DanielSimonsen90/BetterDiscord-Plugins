import { Settings } from "src/0DanhoLibrary/Settings";
import { addSortAndViewButtonClick } from "./functions";

export default function Feature() {
  if (!Settings.current.allowForumSortByAuthor) return;
  
  addSortAndViewButtonClick();
}