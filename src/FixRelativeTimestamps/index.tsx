import { createPlugin } from "@dium";

import patch from "./patches";
import { $ } from "@dom";

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