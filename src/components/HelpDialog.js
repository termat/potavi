import React,{ useState }from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Link from '@mui/material/Link';
import { Box } from '@mui/material';
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
          <Box textAlign="center">
          <h1 style={{margin: "8px"}}>Potavi ： ポタリングした地域を3D地図で俯瞰するWebアプリです。</h1>
          <p style={{fontSize: "20px",margin: "8px"}}>自転車走行記録（GPSログ）を可視化し、ポタリング（自転車散歩）した地域を俯瞰して楽しむWebアプリです。<br />
            実際に走った地域を俯瞰して振り返ることで新たな発見を促します。<br />
            また、サイクリングルートや地域の紹介に活用することで、サイクルツーリズムを推進します。<br /><br />
            </p>
            <hr />
            <div>
						<h5 style={{fontSize: "14px",margin: "8px"}}>免責事項</h5>
						<p style={{fontSize: "12px",margin: "8px"}}>
							明示、暗黙を問わず本サイトの内容に関してはいかなる保証も適用しません。<br />
							本サイトの利用により、何らかのトラブルや損失・損害等が生じた場合、本サイトの関係者は損害、損失に対していかなる場合も一切の責任を負いません。<br />
							コンテンツの全ての情報について、内容の合法性・正確性・安全性等、あらゆる点において保証しません。<br />
							リンクをしている外部サイトについて、一切、保証しません。<br />
							事前の予告無く、コンテンツの提供を中止する可能性があります。<br />
						</p>
            </div>
          </Box>
        </div>
        <br />
        <Copyright />
      </Dialog>
    </div>
  );
}
