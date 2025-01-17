import { Settings } from "src/0DanhoLibrary/Settings";
import handleHiding from "./handleHiding";

export default function Feature() {
  if (!Settings.current.wakeUp) return;

  handleHiding();
}