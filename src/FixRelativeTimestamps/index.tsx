import { createPlugin, Logger } from "@dium";

import patch from "./patches";
import { $, SelectorCallback } from "@danho-lib/DOM";
import ElementSelector from "@danho-lib/DOM/ElementSelector";

const updateNodes = () => $(s => s.className('text-sm/normal')
	.and
	.has(s => s.className("timestamp", "span").and.ariaLabel()), 
	false
).forEach(node => node.forceUpdate());

export default createPlugin({
	start() {
		patch();
		updateNodes();
	},
	stop() {
		updateNodes();
	}
});