import { createPlugin } from "@dium/index";
import FavorFavoriteEmojis from "./features/FavorFavoriteEmojis";
import BanEmojis from "./features/BanEmojis";
import {Settings} from "./Settings";

export default createPlugin({
  start() {
    FavorFavoriteEmojis();
    BanEmojis();
  },

  Settings
})