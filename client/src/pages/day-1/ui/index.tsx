import { Layout } from '#shared/ui/layout';
import { GPTChat } from '#feature/gpt-chat';

import { GPTChatModel } from '../model/process';

export function Day1() {
  return (
    <Layout title="День первый">
      <GPTChat model={GPTChatModel} />
    </Layout>
  );
}
