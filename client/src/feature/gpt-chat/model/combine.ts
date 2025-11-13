import { createGPTChatModel } from './chat';
import { createCompressModel, type CreateCompressModelProps } from './compress';
import { createFetchModel, type CreateFetchModelProps } from './fetch';
import { createFormModel, type CreateFormModelProps } from './form';
import { createMessagesModel } from './messages';

export function combineGPTChatModel({
  formProps = {},
  fetchProps,
  compress,
}: {
  formProps?: CreateFormModelProps;
  fetchProps: CreateFetchModelProps;
  compress?: CreateCompressModelProps;
}) {
  const fetchModel = createFetchModel(fetchProps);
  const messagesModel = createMessagesModel();
  const formModel = createFormModel({ fetchModel, messagesModel, ...formProps });
  const compressModel = compress && createCompressModel(compress);
  const GPTChatModel = createGPTChatModel({ fetchModel, formModel, compressModel, messagesModel });

  return { fetchModel, messagesModel, formModel, compressModel, GPTChatModel };
}
