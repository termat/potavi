import React,{ useState }from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { loadData } from './Mappanel';
import { stop } from './DataLoader';
import { endRunning } from './ControlBar';
import axios from 'axios';

const BASE_URL="https://www.termat.net/";
const SITE_URL="https://termat.github.io/";

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

const getDate=(time)=>{
  const dd = new Date(time);
  return dd.toLocaleDateString()
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export let handleDialogOpen;
export let handleDialogClose;
export let getTripData;
export let setUpPage;
let handleChange;
let setCountVal;
let bool=false;

setUpPage=()=>{
  if(bool)return;
  const url=BASE_URL+"trip/numofpage/";
  axios.get(url)
  .then(function (res) {
    let pages=res.data["numOfRows"];
    pages=Math.ceil(pages/8);
    setCountVal(pages);
    handleChange(null,1);
    bool=true;
  })
  .catch(function(error) {
    bool=true;
  });
};

const jumpData=(p)=>{
  const tmp=()=>{
    stop();
    endRunning();
  };
  setTimeout(tmp,10)
  handleDialogClose();
  setTimeout(loadData(p),500);
}

const clip=(p)=>{
  const url=SITE_URL+"potavi/?p="+p;
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(url).then(function () {
      alert("URLをClipboardに転送しました。");
    })
  }
};

export default function DataTableDialog(props) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [itemData, setData] = useState([]);
  const [colnum,setColnum]= useState(4);

  handleDialogOpen = () => {
    const mql1 = window.matchMedia("(orientation: landscape)");
    if(mql1.matches){
      setColnum(4);
    }else{
      setColnum(2);
    }
    setOpen(true);
  };

  handleDialogClose = () => {
    setOpen(false);
  };

  setCountVal=(val)=>{
    setCount(val);
  };

  handleChange = (e, p) => {
    setPage(p);
    p=p-1;
    const url=BASE_URL+"trip/data/"+p;
    axios.get(url)
    .then(function (res) {
      setData(res.data);
    });
  };

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleDialogClose} TransitionComponent={Transition}>
        <AppBar>
          <Toolbar>
          <div style={{ flexGrow: 1 }}></div>
          <CloseIcon onClick={handleDialogClose} />
          <Button color="inherit" onClick={handleDialogClose}>
              Close
          </Button>
          </Toolbar>
        </AppBar>
        <div style={{marginTop:70}}>
          <Pagination
              color="primary" 
              count={count}
              page={page}
              onChange={handleChange}
              renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
          <Box textAlign="center">
          <ImageList cols={colnum}>
        {itemData.map((item) => (
          <ImageListItem key={item.id}>
            <img
              srcSet={item.image}
              alt={item.title}
              loading="lazy"
              onClick={() => jumpData(item.json)}
            />
            <ImageListItemBar
              title={item.title}
              subtitle={getDate(item.date)}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.title}`}
                  onClick={()=>clip(item.json)}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
          </Box>
        </div>
        <br />
        <Copyright />
      </Dialog>
    </div>
  );
}
