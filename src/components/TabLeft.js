import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
//import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import GearIcon from '@mui/icons-material/Settings';
import LayersIcon from '@mui/icons-material/Layers';
import SearchIcon from '@mui/icons-material/Search';
import MenuList from './MenuList';
import Geocoder from './Geocoder';
import Tabs from '@mui/material/Tabs';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const setMemory=(val)=>{
    localStorage.setItem("mem",val);
};

export const getMemory=()=>{
  const val=localStorage.getItem("mem");
  if(!val)return false;
  return JSON.parse(val);
};

export default function TabLeft() {
  const [value, setValue] = React.useState('1');
  const [state, setState] = React.useState(getMemory());

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSmoothChange = (event, newValue) => {
    setState(newValue);
    setMemory(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab icon={<LayersIcon />} label="Layer" value="1" />
          <Tab icon={<SearchIcon />} label="Search" value="2" />
          <Tab icon={<GearIcon />} label="Set" value="3" />
      </Tabs>
      </Box>
      <TabPanel value="1">
        <MenuList />
      </TabPanel>
      <TabPanel value="2">
        <Geocoder />
      </TabPanel>
      <TabPanel value="3">
        <div>
        <FormControlLabel
            control={
              <Checkbox checked={state} onChange={handleSmoothChange} name="gilad" />
            }
            label="省メモリ"
          />
        </div>
      </TabPanel>
      </TabContext>
    </Box>
  );
}
