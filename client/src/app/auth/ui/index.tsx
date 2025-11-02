import { useUnit } from 'effector-react';
import { useEffect, type JSX } from 'react';
import { $pageLoading, mount } from '../model/process';
import { CircularProgress } from '@mui/material';
import { $visibleForm } from '../model/form';
import { Form } from './form';
import { Content } from './content';

export function AuthWrapper({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { onMount, pageLoading, visibleForm } = useUnit({
    onMount: mount,
    pageLoading: $pageLoading,
    visibleForm: $visibleForm,
  });

  useEffect(() => {
    onMount();
  }, [onMount]);

  if (pageLoading) {
    return (
      <Content>
        <CircularProgress />
      </Content>
    );
  }

  if (visibleForm) {
    return (
      <Content>
        <Form />
      </Content>
    );
  }

  return children;
}
