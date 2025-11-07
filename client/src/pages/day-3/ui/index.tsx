import { Layout } from '#shared/ui/layout';
import { GPTChat } from '#feature/gpt-chat';

import { GPTChatModel } from '../model/process';

export function Day3() {
  return (
    <Layout title="День третий">
      <GPTChat model={GPTChatModel} />
    </Layout>
  );
}
