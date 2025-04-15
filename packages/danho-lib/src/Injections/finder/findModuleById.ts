import { SearchOptions } from "betterdiscord";

export const findModuleById = (id: string | number, options?: SearchOptions<boolean>) => {
  return BdApi.Webpack.getModule((_, __, _id) => _id === id.toString(), options);
};

export default findModuleById;