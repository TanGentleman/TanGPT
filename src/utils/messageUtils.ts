import { MessageInterface, ModelOptions, TotalTokenUsed, LimitedMessagesResult } from '@type/chat';

import useStore from '@store/store';

import { Tiktoken } from '@dqbd/tiktoken/lite';
const cl100k_base = await import('@dqbd/tiktoken/encoders/cl100k_base.json');

const encoder = new Tiktoken(
  cl100k_base.bpe_ranks,
  {
    ...cl100k_base.special_tokens,
    '<|im_start|>': 100264,
    '<|im_end|>': 100265,
    '<|im_sep|>': 100266,
  },
  cl100k_base.pat_str
);

// https://github.com/dqbd/tiktoken/issues/23#issuecomment-1483317174
export const getChatGPTEncoding = (
  messages: MessageInterface[],
  model: ModelOptions
) => {
  // adjusted to include all 3.5 models
  const isGpt3 = model === 'gpt-3.5-turbo' || model === 'gpt-3.5-turbo-16k' || model === 'gpt-3.5-turbo-0613';

  const msgSep = isGpt3 ? '\n' : '';
  const roleSep = isGpt3 ? '\n' : '<|im_sep|>';

  const serialized = [
    messages
      .map(({ role, content }) => {
        return `<|im_start|>${role}${roleSep}${content}<|im_end|>`;
      })
      .join(msgSep),
    `<|im_start|>assistant${roleSep}`,
  ].join(msgSep);

  return encoder.encode(serialized, 'all');
};

const countTokens = (messages: MessageInterface[], model: ModelOptions) => {
  if (messages.length === 0) return 0;
  return getChatGPTEncoding(messages, model).length;
};
// function to decide what max token limit should be
export const getMaxTokenLimit = (model: ModelOptions) => {
  switch (model) {
    case 'gpt-3.5-turbo':
      return 4096;
    case 'gpt-3.5-turbo-0613':
      return 4096;
    case 'gpt-3.5-turbo-16k':
      return 16384;
    case 'gpt-3.5-turbo-16k-0613':
      return 16384;
    case 'gpt-4':
      return 8192;
    case 'gpt-4-0613':
      return 8192;
    case 'gpt-4-32k':
      return 32768;
    case 'gpt-4-32k-0613':
      return 32768;
    default:
      // console.log('Diff model: ', model)
      return 4095;
  }
};
// improved for safety and new models
export const limitMessageTokensBetter = (
  messages: MessageInterface[],
  model: ModelOptions
): LimitedMessagesResult => {
  const limitedMessages: MessageInterface[] = [];
  // Ensure messages is nonzero in length
  let tokenCount = 0;
  if (messages.length === 0) return { limitedMessages, leftOverTokens: tokenCount };
  const maxTokenLimit = getMaxTokenLimit(model);
  let retainSystemMessage = false;
  let allowFirstMessage = false;
  // Check if the first message fits within the token limit
  const length = messages.length;
  const firstMessageTokenCount = countTokens([messages[length-1]], model);

  
  if (firstMessageTokenCount < maxTokenLimit) {
    tokenCount += firstMessageTokenCount;
    allowFirstMessage = true;
  }
  else {
    // console.log('error!', maxTokenLimit, model, getMaxTokenLimit(model));
    // throw error?
    // for now, im returning the empty list
    return { limitedMessages, leftOverTokens: tokenCount };
  }
  const isSystemFirstMessage = messages[0]?.role === 'system';
  // Check if the first message is a system message and if it fits within the token limit
  
  if (isSystemFirstMessage && messages.length > 1) {
    const systemTokenCount = countTokens([messages[0]], model);
    if (systemTokenCount + tokenCount < maxTokenLimit) {
      tokenCount += systemTokenCount;
      retainSystemMessage = true;
    }
  }
  // Iterate through messages in reverse order, adding them to the limitedMessages array
  // until the token limit is reached
  // assert allowFirstMessage = true
  for (let i = messages.length - 2; i >= 0; i--) {
    // assert(i is never less than 0, so messages access is safe) 
    if (i === 0 && isSystemFirstMessage) continue;
    
    // assert tokenCount < maxTokenLimit
    const count = countTokens([messages[i]], model);
    
    if (count + tokenCount >= maxTokenLimit) break;
    tokenCount += count;
    limitedMessages.unshift({ ...messages[i] });
  }

  // Process first message
  if (retainSystemMessage) {
    // Insert the system message in the first position - adjusted
    limitedMessages.unshift({ ...messages[0] });
  }
  // add first message
  limitedMessages.push({ ...messages[length-1] });
  // assert tokenCount < maxTokenLimit
  // console.log('limitedMessages:', limitedMessages)
  return { limitedMessages, leftOverTokens: maxTokenLimit - tokenCount };
};


export const updateTotalTokenUsed = (
  model: ModelOptions,
  promptMessages: MessageInterface[],
  completionMessage: MessageInterface
) => {
  const setTotalTokenUsed = useStore.getState().setTotalTokenUsed;
  const updatedTotalTokenUsed: TotalTokenUsed = JSON.parse(
    JSON.stringify(useStore.getState().totalTokenUsed)
  );

  const newPromptTokens = countTokens(promptMessages, model);
  const newCompletionTokens = countTokens([completionMessage], model);
  const { promptTokens = 0, completionTokens = 0 } =
    updatedTotalTokenUsed[model] ?? {};

  updatedTotalTokenUsed[model] = {
    promptTokens: promptTokens + newPromptTokens,
    completionTokens: completionTokens + newCompletionTokens,
  };
  setTotalTokenUsed(updatedTotalTokenUsed);
};

export default countTokens;

// Below legacy implementation prioritizes system messages over user messages
// export const limitMessageTokens = (
//   messages: MessageInterface[],
//   limit: number = 0,
//   model: ModelOptions
// ): MessageInterface[] => {
//   const limitedMessages: MessageInterface[] = [];
//   let tokenCount = 0;
//   const maxTokenLimit = getMaxTokenLimit(model);
//   const isSystemFirstMessage = messages[0]?.role === 'system';
//   let retainSystemMessage = false;

//   // Check if the first message is a system message and if it fits within the token limit
//   if (isSystemFirstMessage) {
//     const systemTokenCount = countTokens([messages[0]], model);
//     if (systemTokenCount < limit) {
//       tokenCount += systemTokenCount;
//       retainSystemMessage = true;
//     }
//   }

//   // Iterate through messages in reverse order, adding them to the limitedMessages array
//   // until the token limit is reached (excludes first message)
//   for (let i = messages.length - 1; i >= 1; i--) {
//     const count = countTokens([messages[i]], model);
    
   
//     if (count + tokenCount > maxTokenLimit) break;
//     tokenCount += count;
//     limitedMessages.unshift({ ...messages[i] });
//   }

//   // Process first message
//   if (retainSystemMessage) {
//     // Insert the system message in the first position - adjusted
//     limitedMessages.unshift({ ...messages[0] });
//   } else if (!isSystemFirstMessage) {
//     // Check if the first message (non-system) can fit within the limit
//     const firstMessageTokenCount = countTokens([messages[0]], model);
//     if (firstMessageTokenCount + tokenCount < maxTokenLimit) {
//       limitedMessages.unshift({ ...messages[0] });
//     }
//   }

//   return limitedMessages;
// };
