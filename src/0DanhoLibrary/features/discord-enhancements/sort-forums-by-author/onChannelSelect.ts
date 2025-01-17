import { createActionCallback } from "@actions";
import { sleep } from "@dium/utils";
import { addSortAndViewButtonClick } from "./functions";

export default createActionCallback('CHANNEL_SELECT', async () => {
  await sleep(1000);
  addSortAndViewButtonClick();
});