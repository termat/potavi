import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import GearIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import MenuList from './MenuList';
import Geocoder from './Geocoder';

export default function TabLeft() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab icon={<GearIcon />} label="Layer" value="1" />
          <Tab icon={<SearchIcon />} label="Search" value="2" />
        </TabList>
      </Box>
      <TabPanel value="1">
        <MenuList />
      </TabPanel>
      <TabPanel value="2">
        <Geocoder />
      </TabPanel>
      </TabContext>
    </Box>
  );
}
