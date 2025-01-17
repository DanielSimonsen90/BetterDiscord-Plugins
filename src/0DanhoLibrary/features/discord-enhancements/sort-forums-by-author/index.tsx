import { Settings } from "src/0DanhoLibrary/Settings";
import patchSortAndView from "./patchSortAndView";

export default function Feature() {
  if (!Settings.current.allowForumSortByAuthor) return;
  patchSortAndView();
}