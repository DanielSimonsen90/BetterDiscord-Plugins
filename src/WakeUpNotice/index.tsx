import { createPlugin } from "@dium";

import { Settings, SettingsPanel } from "./settings";
import handleHiding from "./utils/handleHiding";

export default createPlugin({
	start() {
		handleHiding();
	},
  
	Settings,
	SettingsPanel,
});