import { createGPTChatModel } from './chat';
import { createFetchModel, type CreateFetchModelProps } from './fetch';
import { createFormModel, type CreateFormModelProps } from './form';
import { createMessagesModel } from './messages';

export function combineGPTChatModel({
  formProps = {},
  fetchProps,
}: {
  formProps?: CreateFormModelProps;
  fetchProps: CreateFetchModelProps;
}) {
  const fetchModel = createFetchModel(fetchProps);
  const messagesModel = createMessagesModel();
  const formModel = createFormModel({ fetchModel, messagesModel, ...formProps });
  const GPTChatModel = createGPTChatModel({ fetchModel, formModel, messagesModel });

  return { fetchModel, messagesModel, formModel, GPTChatModel };
}
