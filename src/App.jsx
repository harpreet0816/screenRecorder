import { useState } from "react";
import RecordType from "./RecordType";
import RecordingControls from "./RecordingControls";
function App() {
  const [recording, setRecording] = useState(false);

  const recordingIndicatorStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'red',
    color: 'white',
    padding: '5px',
    display: recording ? 'block' : 'none',
  };
  const parms = {
    event: "record",
    isCamera: true,
    isMicrophone: true, 
    vidQuality: "720",
    timeDelay: 1,
    uploadType: "Local",
    videoLimit: 10,
    autoStop: 5,
  }
 
  const handleRecord = (id, parms)=>
  {
    
    parms.id = id;
    let props = {...parms}
    // console.log(props)
    // console.log("handleRecordScreen", id)
    // RecordingControls(props)
    if(id === 2)
    {
      props.isCamera = true;
      props.isMicrophone = true;
      // console.log("camera only <<>>", props)
    }
    RecordType(props);
  }
  return (
    <>
    <div className="bg-slate-200 h-lvh z-10">
      <div className="app">
      <div className="text-red-300 text-5xl font-bold mb-9 w-fit m-auto">
        Screen Recording👌👌
      </div>
      <button className="border-solid border-2 border-red-600 rounded-lg block p-5 m-2 w-80 bg-slate-300 text-2xl font-bold hover:bg-slate-400" onClick={()=> handleRecord(1, parms)}>
        Record Full Screan➡️
      </button>
      <button className="border-solid border-2 border-red-600 rounded-lg block p-5 m-2 w-80 bg-slate-300 text-2xl font-bold hover:bg-slate-400" onClick={ ()=>  handleRecord(2, parms)}>
        Record Camera Only➡️
      </button>
      <button className="border-solid border-2 border-red-600 rounded-lg block p-5 m-2 w-80 bg-slate-300 text-2xl font-bold hover:bg-slate-400" onClick={ ()=> handleRecord(3, parms)}>
        Record This Tab➡️
      </button>
      <button className="border-solid border-2 border-red-600 rounded-lg block p-5 m-2 w-80 bg-slate-300 text-2xl font-bold hover:bg-slate-400" onClick={ ()=> handleRecord(4, parms)}>
        Record Selected Part➡️
      </button>
      <button id="stop" className="border-solid border-2 border-red-600 rounded-lg block p-5 m-2 w-80 bg-slate-300 text-2xl font-bold hover:bg-slate-400">Stop🛑</button>
      </div>
      <video id="myVideo" width="250" height="550" className="rounded-full"></video>
      {/* <RecordingControls /> */}
    </div>
    </>
  );
}

export default App;
