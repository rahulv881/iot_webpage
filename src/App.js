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
        const values = Object.entries(deviceInfo);
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
        : "Connecting..."
      }

        {/* <h6>avgcellvoltage: {deviceInfo.avgcellvoltage}</h6>
        <h6>batterypercent: {deviceInfo.batterypercent}</h6>
        <h6>cell1: {deviceInfo.cell1}</h6>
        <h6>cell2: {deviceInfo.cell2}</h6>
        <h6>cell3: {deviceInfo.cell3}</h6>
        <h6>cell4: {deviceInfo.cell4}</h6>
        <h6>cell5: {deviceInfo.cell5}</h6>
        <h6>cell6: {deviceInfo.cell6}</h6>
        <h6>cell7: {deviceInfo.cell7}</h6>
        <h6>cell8: {deviceInfo.cell8}</h6>
        <h6>cell9: {deviceInfo.cell9}</h6>
        <h6>cell10: {deviceInfo.cell10}</h6>
        <h6>cell11: {deviceInfo.cell11}</h6>
        <h6>cell12: {deviceInfo.cell12}</h6>
        <h6>cell13: {deviceInfo.cell13}</h6>
        <h6>cell14: {deviceInfo.cell14}</h6>
        <h6>createdAt: {deviceInfo.createdAt}</h6>
        <h6>current: {deviceInfo.current}</h6>
        <h6>datavia: {deviceInfo.datavia}</h6>
        <h6>id: {deviceInfo.id}</h6>
        <h6>imei: {deviceInfo.imei}</h6>
        <h6>latitude: {deviceInfo.latitude}</h6>
        <h6>longitude: {deviceInfo.longitude}</h6>
        <h6>packvoltage: {deviceInfo.packvoltage}</h6>
        <h6>updatedAt: {deviceInfo.updatedAt}</h6>
        <h6>vid: {deviceInfo.vid}</h6> */}
      
    </div>
  );
}

export default App;
