import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import React, { useState } from "react";
 
  const style = {
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": {
        backgroundcolor: "red"
      }
    },
    img: {
      outline: "none"
    }
  };

  export let imagePop;
  export let imageClose;
  
  export default function Imagepopup() {
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState("");
  
    imagePop = (url) => {
        console.log(url);
        setImage(url);
        setOpen(true);
    };
    
    imageClose = () => {
        setOpen(false);
    };
  
    return (
      <div>
        <Modal
          sx={style.modal}
          open={open}
          onClose={imageClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            style: {
                backgroundColor: "transparent",
              }
          }}
        >
          <Fade in={open} timeout={500} >
            <img
              src={image}
              alt="asd"
              style={{ maxHeight: "90%", maxWidth: "90%" }}
            />
          </Fade>
        </Modal>
      </div>
    );
  }