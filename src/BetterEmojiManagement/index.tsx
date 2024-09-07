import { createPlugin } from "@dium/index";

import patch from "./patches";

import {Settings} from "./Settings";
import styles from './styles/index.scss';

export default createPlugin({
  start() {
    patch();
  },

  Settings,
  styles
})