# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


// const video = document.querySelector("video");
            // video.srcObject = screenStream;
            // video.onloadedmetadata = () => video.play();
        
            // const mediaRecorder = new MediaRecorder(screenStream);
            // let videoChunks = [];
        
            // mediaRecorder.ondataavailable = (event) => {
            //     if (event.data.size > 0) {
            //         videoChunks.push(event.data);
            //     }
            // };
        
            // mediaRecorder.onstop = () => {
            //     const videoBlob = new Blob(videoChunks, { type: 'video/mp4' });
            //     videoChunks = [];
        
            //     const downloadLink = document.createElement("a");
            //     downloadLink.href = URL.createObjectURL(videoBlob);
            //     downloadLink.download = "captured_video.mp4";
            //     downloadLink.click();
            // };
        
            // const stopAndDownloadButton = document.querySelector('#stop'); // Assuming the stop button has an ID of "stop"
        
            // stopAndDownloadButton.addEventListener("click", () => {
            //     video.pause();
            //     screenStream.getTracks().forEach(track => track.stop());
            //     video.style.display = "none";
            //     mediaRecorder.stop();
            // });
        
            // mediaRecorder.start();



const handlesubmit = (e)=>{
      e.preventDefault(); // Corrected method name
      console.log("hello");
    }
    const parmsGetter = document.createElement("div")
    const html = `<div><span style="font-size: 38px;font-weight: bold;color: #cd6376;padding: 5px;"
                  >Need Information for recording</span>
                  <form onsubmit="event => handlesubmit(event)">
                    <div>
                    <label name='gender'style="font-size: 21px;font-weight: bold;color: #c91d3ccf;padding: 5px;"
                >Event:</label>
                        <input type="radio" name="event" value="Record" checked>Record
                        <input type="radio" name="event" value="capture">Capture
                    </div>
                    <div><label style="font-size: 21px;font-weight: bold;color: #c91d3ccf;padding: 5px;">Upload Type:</label> 
                      <label>
                        <input type="radio" name="uploadtype" value="Local" checked> Local
                      </label>
                      <label>
                        <input type="radio" name="uploadtype" value="Cloud"> Cloud
                      </label>
                    </div>
                    <div>
                    <label style="font-size: 21px;font-weight: bold;color: #c91d3ccf;padding: 5px;">Camera:</label>
                    <label>
                    <input type="radio" name="camera" value="true"> true
                    </label>
                    <label>
                      <input type="radio" name="camera" value="false" checked> false
                    </label>
                    </div>
                    <div>
                    <label style="font-size: 21px;font-weight: bold;color: #c91d3ccf;padding: 5px;">Microphone:</label>
                    <label>
                    <input type="radio" name="microphone" value="true"> true
                    </label>
                    <label>
                      <input type="radio" name="microphone" value="false" checked> false
                    </label>
                    </div>
                    <div>
                    <label style="font-size: 21px;font-weight: bold;color: #c91d3ccf;padding: 5px;">Video Quality:</label>
                    <label>
                    <input type="radio" name="quality" value="720" checked> 720
                    </label>
                    <label>
                      <input type="radio" name="quality" value="360"> 360
                    </label>
                    </div>
                    <div><label style="font-size: 21px;font-weight: bold;color: #c91d3ccf;padding: 5px;">Time Delay:</label>
                    <input type="number" id="numberInput" name="numberInput" min="3" max="20" value="3" style="width: 45px;background-color: #cb1616ad;color: white;">
                    </div>
                    <div><label style="font-size: 21px;font-weight: bold;color: #c91d3ccf;padding: 5px;">VideoLimit:</label> 
                      <input type="number" value=10 readonly style="width: 45px;background-color: #cb1616ad;color: white;"></input> 
                    </div> 
                    <button style="font-size: 21px;font-weight: bold;color: #c91d3ccf;padding: 5px;">Submit</button>
                    </form>
                    </div>`
   parmsGetter.innerHTML = html;
   parmsGetter.style.cssText = "position: absolute;font-size: 20px;top: 11%;left: 32%;background-color: #0000005e;";
   document.body.appendChild(parmsGetter)



   // displayControls(props, 50, delay, isDevicesAvailable, async () => 
                // {
                //         if (id == 4) {
                //             console.log("hum ah display controls callback backback function k inside  q  ")
                //             let cropTarget = await CropTarget.fromElement(document.querySelector(".screen-cap-content"));
                //             const [videoTrack] = screenStream.getVideoTracks();
                //             await videoTrack.cropTo(cropTarget);
                //         }
                //         if (isDevicesAvailable) {
                //             console.log("isDevicesAvailable is true")
                //             audioStream = await navigator.mediaDevices.getUserMedia({
                //                 audio: {
                //                     mandatory: {
                //                         deviceId: null,
                //                     }
                //                 },
                //                 video: false
                //             });
                //             console.log(audioStream)
                //             // this.combineMultipleStreams(this.screenStream, this.audioStream, (stream) => {
                //             //     this.combine_stream = stream;
                //             //     if(this.isCameraRecord){ this.recordCameraScreen(); }
                //             //     this.startRecording(this.combine_stream,autostopVal).then (recordedChunks => {
                //             //     this.downloadCapturedVideo(recordedChunks);
                //             //     });
                //             // }); 
                //         }
                //         else {
                //             console.log("displayControls isDeviceAvaible  else condition", screenStream)
                //             let combine_stream = screenStream;
                //             videoRecorderNDownloader( combine_stream, props);
                //             // StartRecording(combine_stream, autostopVal, props).then (recordedChunks => {
                //             // //     this.downloadCapturedVideo(recordedChunks);
                //             // console.log(recordedChunks, "recorded chunkssss<<<<<<<<<>>>>")
                //             // });
                //         }
                // });