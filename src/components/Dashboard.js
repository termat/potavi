import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Mappanel from './Mappanel';
import TabLeft from './TabLeft';
import ControlBar from './ControlBar';
import DataTableDialog from './DataTableDialog';
import HelpDialog from './HelpDialog';
import Imagepopup from './Imagepopup';
import ControlPad from './ControlPad';

const drawerWidth = 250;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

let handleDrawerOpen;

export default function Dashboard(props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <TabLeft />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Mappanel page={props.page}/>
        <ControlBar /> 
        <ControlPad />
      </Main>
      <Imagepopup />
      <DataTableDialog />
      <HelpDialog />
    </Box>
  );
}

export class DrawerOpenControl {

  constructor(url,id){
      this.url=url;
      this.id=id;
  }

  onAdd(map) {
    this.map = map;
    const homeButton = document.createElement('button');
    homeButton.setAttribute("title","map-label");
    homeButton.innerHTML = '<img src="'+this.url+'" width="24px" aria-hidden="true"></i>';
    homeButton.addEventListener('click', (e) => {
      handleDrawerOpen();
    });
    this.container = document.createElement('div');
    this.container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    this.container.appendChild(homeButton);
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}
