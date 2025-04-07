import { createPlugin } from "@dium";
import styles from './style.scss';
import { $ } from "@danho-lib/DOM";

export default createPlugin({
  start() {
    $('#app-mount').addClass('danho-expand-bio-again');
  },

  styles,
})