import afterTextModule from "../../../patches/after/TextModule";
import { Settings } from '../../../Settings'

export default function Feature() {
  if (!Settings.current.pronounsPageLinks) return;
  afterTextModule();
}