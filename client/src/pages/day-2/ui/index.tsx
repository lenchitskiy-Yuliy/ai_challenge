import { Layout } from '#shared/ui/layout';
import { JsonSchema } from '#feature/json-schema';

import '../model/process';
import { SimpleChat } from '#feature/simple-chat';

export function Day2() {
  return (
    <Layout title="День второй">
      <JsonSchema />
      <SimpleChat />
    </Layout>
  );
}
