export * from '@dium/api/finder';

export const findBySourceStrings = <TResult = any>(...keywords: string[]) => BdApi.Webpack.getModule(m =>
  m
  && Object.keys(m).length
  && Object.keys(m).some(k => typeof m[k] === 'function' && keywords.every(keyword => m[k].toString().includes(keyword)))
  , { defaultExport: false }
) as TResult
