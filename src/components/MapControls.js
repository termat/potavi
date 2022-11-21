import { layerOnOff } from "./Mappanel";
import { fileRead,frame } from "./DataLoader";
import {handleDialogOpen,setUpPage} from './DataTableDialog'
import { handleHelpDialogOpen } from "./HelpDialog";
import { showPanel } from "./ControlPad";

export class LayerOnOffControl {

    constructor(url,id,label){
        this.url=url;
        this.id=id;
        this.label=label;
    }

    onAdd(map) {
      this.map = map;
      const homeButton = document.createElement('button');
      homeButton.setAttribute("title",this.label);
      homeButton.innerHTML = '<img src="'+this.url+'" width="24px" aria-hidden="true"></i>';
      homeButton.addEventListener('click', (e) => {
        layerOnOff(this.id);
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

export class FileReadControl {

  constructor(url,label){
      this.url=url;
      this.label=label;
  }

  onAdd(map) {
    this.map = map;
    const homeButton = document.createElement('button');
    homeButton.setAttribute("title",this.label);
    homeButton.innerHTML = '<img src="'+this.url+'" width="24px" aria-hidden="true"></i>';
    homeButton.addEventListener('click', (e) => {
      fileRead(this.map);
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

export class PlayControl {

  constructor(url,label){
    this.url=url;
    this.label=label;
}

  onAdd(map) {
    this.map = map;
    const homeButton = document.createElement('button');
    homeButton.setAttribute("title",this.label);
    homeButton.innerHTML = '<img src="'+this.url+'" width="24px" aria-hidden="true"></i>';
    homeButton.addEventListener('click', (e) => {
      requestAnimationFrame(frame)
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

export class DialogControl {

  constructor(url,label){
    this.url=url;
    this.label=label;
}

  onAdd(map) {
    this.map = map;
    const homeButton = document.createElement('button');
    homeButton.setAttribute("title",this.label);
    homeButton.innerHTML = '<img src="'+this.url+'" width="24px" aria-hidden="true"></i>';
    homeButton.addEventListener('click', (e) => {
      setUpPage();
      handleDialogOpen();
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

export class HelpControl {

  constructor(url,label){
    this.url=url;
    this.label=label;
  }

  onAdd(map) {
    this.map = map;
    const homeButton = document.createElement('button');
    homeButton.setAttribute("title",this.label);
    homeButton.innerHTML = '<img src="'+this.url+'" width="24px" aria-hidden="true"></i>';
    homeButton.addEventListener('click', (e) => {
      handleHelpDialogOpen();
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

export class PanelControl {

  constructor(url,label){
    this.url=url;
    this.label=label;
  }

  onAdd(map) {
    this.map = map;
    const homeButton = document.createElement('button');
    homeButton.setAttribute("title",this.label);
    homeButton.innerHTML = '<img src="'+this.url+'" width="24px" aria-hidden="true"></i>';
    homeButton.addEventListener('click', (e) => {
      showPanel();
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

export class HomeControl {

  constructor(url,label){
    this.url=url;
    this.label=label;
  }

  onAdd(map) {
    this.map = map;
    const homeButton = document.createElement('button');
    homeButton.setAttribute("title",this.label);
    homeButton.innerHTML = '<img src="'+this.url+'" width="24px" aria-hidden="true"></i>';
    homeButton.addEventListener('click', (e) => {
      window.location="https://termat.github.io/potavi"
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