import './App.css';
import { BrowserRouter, Routes ,Route,useLocation} from 'react-router-dom';
import Dashboard from './components/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/potavi" element={<Child />} />
        <Route path="*" element={<div>404 page not found.</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export const Child = () => {
  const location = useLocation();
  const arg=getArg(location.search);
  if(arg["p"]){
    return (
      <Dashboard page={arg["p"]} help={false} />
    )
  }else{
    return (
      <Dashboard help={true} />
    )
  }
}

const getArg=(search)=>{
  var arg = [];
  var pair=search.substring(1).split('&');
  for(var i=0;pair[i];i++) {
      var kv = pair[i].split('=');
      arg[kv[0]]=kv[1];
  }
  return arg;
}


export default App;
