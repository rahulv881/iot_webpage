import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';
import CustomTable from './components/CustomTable';

// var fetch = require('node-fetch');
var io = require('socket.io-client');
// var socket = io.connect('localhost:3000', {reconnect: true});
var socket = io.connect('https://agile-shelf-81976.herokuapp.com/', {reconnect: true});
// var logger = require('logger').createLogger('logfile.log'); 

const header = ["Device Info","Values"];
function App() {

  const [deviceInfo,setDeviceInfo] = useState({});
  const [rows,setRows] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // var socket = io.connect('http://localhost:3000/', {reconnect: true});
    try{
      console.log("Connecting to server...");
      // logger.info('Connecting to server...');
      socket.emit('FROM_WEB_USER');

      socket.on('connect', (socket)=> {
        console.log("Connected to server!");
      });

      socket.emit('GET_DEVICE_LATEST_INFO_EVENT',"XNG1037");
      socket.on('DEVICE_LATEST_INFO',(deviceInfo) => {
        console.log("DEVICE INFO: ",deviceInfo);
        const keys = Object.keys(deviceInfo);
        const values = Object.values(deviceInfo);
        var updatedRows = keys.map((key,index) => {return {name: key,value: values[index]}});
        setRows(updatedRows);
        setDeviceInfo(deviceInfo);
        setIsConnected(true);
      });
    }
    catch(e){
      console.log("Connecting to server failed.");
      console.log(e);
    }

    return () => {
      // socket.emit("WEB_USER_DISCONNECTED");
      socket.disconnect();
      console.log("Disconnectd from server.");
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        IoT Device Information: 
      </header>
      {
        isConnected ? 
          <CustomTable rows={rows} header={header} />
        : "Waiting to connect to IoT device..."
      }      
    </div>
  );
}

export default App;
