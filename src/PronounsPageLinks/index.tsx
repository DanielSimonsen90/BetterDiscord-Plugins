import { createPlugin } from "@dium";
import patch from "./patches";

export default createPlugin({
	start() {
		patch();
	},
});