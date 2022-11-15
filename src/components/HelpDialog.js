import React,{ useState }from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Link from '@mui/material/Link';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://twitter.com/t_mat">
        t.matsuoka
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export let handleHelpDialogOpen;

const img_style = {
  width: "100%" 
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DataTableDialog(props) {
  const [open, setOpen] = useState(false);

  handleHelpDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleDialogClose} TransitionComponent={Transition}>
        <AppBar>
          <Toolbar>
          <DirectionsBikeIcon />
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', md: 'block' } }}>
          　Potavi（自転車走行記録の可視化）
          </Typography>
          <div style={{ flexGrow: 1 }}></div>
          <CloseIcon onClick={handleDialogClose} />
          <Button color="inherit" onClick={handleDialogClose}>
              Close
          </Button>
          </Toolbar>
        </AppBar>
        <div style={{marginTop:60}}>
          <img src={`${process.env.PUBLIC_URL}/images/back2.jpg`} style={img_style} alt={'top'} />
        </div>
        <br />
        <Copyright />
      </Dialog>
    </div>
  );
}
