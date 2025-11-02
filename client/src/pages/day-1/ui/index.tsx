import { Layout } from '#shared/ui/layout';
import { SimpleChat } from '#feature/simple-chat';

import '../model/process';

export function Day1() {
  return (
    <Layout title="День первый">
      <SimpleChat />
    </Layout>
  );
}
