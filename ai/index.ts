import { anthropic } from '@ai-sdk/anthropic';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { middleware } from './middlware';

export const model = (apiIdentifier: string) => {
  return wrapLanguageModel({
    model: anthropic(apiIdentifier),
    middleware,
  });
};
