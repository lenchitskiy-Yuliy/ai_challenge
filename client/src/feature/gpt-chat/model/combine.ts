import { createGPTChatModel } from './chat';
import { createFetchModel } from './fetch';
import { createFormModel, type CreateFormModelProps } from './form';
import { createMessagesModel } from './messages';

export function combineGPTChatModel(props?: { formProps?: CreateFormModelProps }) {
  const { formProps = {} } = props || {};

  const fetchModel = createFetchModel();
  const messagesModel = createMessagesModel();
  const formModel = createFormModel({ fetchModel, messagesModel, ...formProps });
  const GPTChatModel = createGPTChatModel({ fetchModel, formModel, messagesModel });

  return { fetchModel, messagesModel, formModel, GPTChatModel };
}
