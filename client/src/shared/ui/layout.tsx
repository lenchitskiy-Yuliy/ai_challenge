import {
  Box,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  ListItem,
  List,
  ListItemText,
} from '@mui/material';
import { useState, type JSX } from 'react';

import AppsIcon from '@mui/icons-material/Apps';
import { routes } from '#shared/routing';
import { Link } from 'atomic-router-react';

const links = [
  {
    label: 'День первый',
    route: routes.day1.route,
  },
];

export function Layout({
  title,
  children,
}: {
  title: string;
  children: JSX.Element[] | JSX.Element;
}) {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  function closeDrawer() {
    setDrawerIsOpen(false);
  }

  function openDrawer() {
    setDrawerIsOpen(true);
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <AppBar position="fixed" color="inherit">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={openDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <AppsIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="temporary" open={drawerIsOpen} onClose={closeDrawer}>
        <Box sx={{ width: 240, paddingTop: 8 }}>
          <List>
            {links.map(({ label, route }) => (
              <ListItem>
                <Link to={route} key={label} onClick={closeDrawer}>
                  <ListItemText primary={label} />
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
