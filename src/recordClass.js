import RecordingControls from "./RecordingControls";
// import jQuery from "jquery";
// import 'jquery-ui'
// import 'jquery-ui/widgets/draggable'

class record {
  constructor() {
    this.isDevicesAvailable = false;
    this.delay = true;
    this.audioStream = null;
    this.screenStream = null;
    this.mediaRecorder = null;
    this.cameraStream = null;
    this.cameraVideo = null;
    this.video = null;
  }

  // this function is requests user to get permission for screen and camera
  handleRecord = async (props) => {
    let delay = true;
    let {
      event,
      id,
      isCamera,
      isMicrophone,
      vidQuality,
      timeDelay,
      uploadType,
      videoLimit,
    } = props;
    console.log(
      "class's method handlerecord",
      isCamera,
      uploadType,
      videoLimit
    );
    if (id == 1) {
      try {
        this.screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            deviceId: "",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: true,
          preferCurrentTab: false,
        });
        console.log(this.screenStream, "inside try ");
        this.videoRecorderNDownloader(this.screenStream, props);
      } catch (error) {
        console.error("Error accessing screen capture:", error.message);
      }
    } else if (id == 2) {
      try {
        this.screenStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: { min: 1280 },
            height: { min: 720 },
          },
        });
        this.videoRecorderNDownloader(this.screenStream, props);
        this.audioToggle(this.screenStream, props);
      } catch (err) {
        console.error(`Error accessing media devices: ${err}`);
      }
    } else if (id == 3 || id == 4) {
      // to record this tab and select area
      try {
        this.screenStream = await navigator.mediaDevices.getDisplayMedia({
          preferCurrentTab: true,
          audio: true,
          video: {
            deviceId: "",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        if (id == 3) {
          this.videoRecorderNDownloader(this.screenStream, props);
        }
        if (id == 4) {
          delay = false;
          this.CropScreen(props, async () => {
            console.log(
              "hum ah display controls callback backback function k inside  q  "
            );
            let cropTarget = await CropTarget.fromElement(
              document.querySelector(".screen-cap-content")
            );
            const [videoTrack] = this.screenStream.getVideoTracks();
            await videoTrack.cropTo(cropTarget);
            let combine_stream = this.screenStream;
            console.log("combinestream", combine_stream);
            this.videoRecorderNDownloader(combine_stream, props);
          });
        }
      } catch (err) {
        console.error("Error during video capture:", err);
      }
    }
  };

  // this function is for download recordinng
  videoRecorderNDownloader = async (screenStream, props) => {
    try {
      const { id, isCamera, isMicrophone } = props;
      RecordingControls(props);
      document.querySelector("#floatable-recorder-tool").style.display = "none";
      console.log("screemstream what it gets as a props", screenStream);
      this.video = document.querySelector("video");
      this.video.srcObject = screenStream;
      this.video.onloadedmetadata = () => this.video.play();

      this.mediaRecorder = new MediaRecorder(screenStream);
      let videoChunks = [];
      console.log("mediaRecorder at first what it gets", this.mediaRecorder);
      this.mediaRecorder.ondataavailable = (event) => {
        //when stop button is clicked this function runs then checks if event.data.size after that goes to onstop function
        console.log("event>>>", event);
        if (event.data.size > 0) {
          videoChunks.push(event.data);
          console.log("mediaRecorder ondataavaible", this.mediaRecorder);
        }
      };
      this.mediaRecorder.onstop = () => {
        //this function runs after ondataavailable and create a blog
        console.log("mediaRecorder onstop", this.mediaRecorder);
        console.log("video chunks on stop ", videoChunks);
        const videoBlob = new Blob(videoChunks, { type: "video/mp4" });
        console.log("videoBlog", videoBlob);
        videoChunks = [];

        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(videoBlob);
        downloadLink.download = "captured_video.mp4";
        downloadLink.click();
      };

      //close button
      const stopAndDownloadButton = document.querySelector("#stop");
      stopAndDownloadButton.addEventListener("click", () => {
        console.log("button click stop");

        this.stopRecording(
          this.video,
          screenStream,
          this.mediaRecorder,
          id,
          this.cameraStream,
          this.cameraVideo
        );
      });
      //close button
      const stopAndDownloadIcon = document.querySelector(".close-rec");

      stopAndDownloadIcon.addEventListener("click", () => {
        console.log("icon click stop");

        this.stopRecording(
          this.video,
          screenStream,
          this.mediaRecorder,
          id,
          this.cameraStream,
          this.cameraVideo
        );
      });
      //close button
      const stopIcon = document.querySelector(".stop-rec");

      stopIcon.addEventListener("click", () => {
        console.log("stop click stop");

        this.stopRecording(
          this.video,
          screenStream,
          this.mediaRecorder,
          id,
          this.cameraStream,
          this.cameraVideo
        );
      });

      //hide controls
      const hideControls = document.querySelector(".close-toobar");

      hideControls.addEventListener("click", () => {
        console.log("hids toolbar");
        document.querySelector(".controls").remove();
      });

      //annotation button
      if (id != 2) {
        const annoClickHandler = (e) => {
          console.log(
            e.target.closest("#floatable-recorder-tool"),
            "noddfslfjldjlkjklfsjkdljklfjsdklj"
          );
          if (e.target.parentNode.classList.contains("anno-free-line")) {
            this.drawRecordingAnnotation("Line");
          } else if (
            e.target.parentNode.classList.contains("anno-reactangle")
          ) {
            this.drawRecordingAnnotation("Rectangle");
          } else if (e.target.closest(".anno-arrow")) {
            this.drawRecordingAnnotation("Arrow");
          }
        };
        let ele = [];
        document
          .querySelectorAll(".anno-effects .effect-child-options span")
          .forEach((elem) => ele.push(elem));
        const annoFreeLine = ele[0];
        const annoReactangle = ele[1];
        const annoArrow = ele[2];
        annoFreeLine.removeEventListener("click", annoClickHandler);
        annoReactangle.removeEventListener("click", annoClickHandler);
        annoArrow.removeEventListener("click", annoClickHandler);
        annoFreeLine.addEventListener("click", annoClickHandler);
        annoReactangle.addEventListener("click", annoClickHandler);
        annoArrow.addEventListener("click", annoClickHandler);

        //annotation color selection

        let selectedElement = null;
        const colorSelection = (event) => {
          const clickedColor = event.currentTarget.getAttribute("data-color");
          this.selectedColor = clickedColor;
          console.log("Selected Color:", clickedColor);

          if (selectedElement) {
            selectedElement.removeEventListener("click", colorSelection);
          }
          selectedElement = event.currentTarget;
        };

        const colorElements = document.querySelectorAll(".tool-color");
        colorElements.forEach((element) => {
          element.addEventListener("click", colorSelection);
        });

        //eraser icon
        const erasericon = document.querySelector(".remove-anno-effects");
        erasericon.addEventListener("click", () => {
          if (document.querySelector("#draw-recording-anno")) {
            document.querySelector("#draw-recording-anno").remove();
          }
        });
      }

      // Arroe
      // we used this here as a arrow function because when we are using this as a regular function it is not able to acees the method of the class
      const handleArrowClick = (e) => {
        var elem = document.body;
        //this is important because it is used to remove any pointer Events of the draw anno like click down move up ;
        // if (document.getElementById("draw-recording-anno")) { document.getElementById("draw-recording-anno").style.pointerEvents ="none";}
        var shape = "";
        this.mouseAnnoEvents(); //used to remove anno events if exits
        this.removeArrowEvents(); // used to remove arrow events if any exits
        elem.removeEventListener("mousedown", handleArrowDown);
        elem.removeEventListener("mousemove", handleArrowMove);
        elem.removeEventListener("mouseup", handleArrowUp);
        if (e.target.closest(".arrow-spotlight")) {
          console.log("arrow-spotlight");
          shape =
            '<div class="arrow-spotlight-outer"><div class="arrow-spotlight-cursor"></div></div>';
          elem.insertAdjacentHTML("afterbegin", shape);
          elem.removeEventListener("mousemove", handleArrowMove);
          elem.addEventListener("mousemove", handleArrowMove);
        } else if (e.target.closest(".arrow-highlight-click")) {
          console.log("arrow-highlight-click");
          shape = '<div class="shape-highlight-click"></div>';
          elem.insertAdjacentHTML("beforeend", shape);
          elem.removeEventListener("mousemove", handleArrowMove);
          elem.addEventListener("mousemove", handleArrowMove);
          elem.removeEventListener("mousedown", handleArrowDown);
          elem.addEventListener("mousedown", handleArrowDown);
          elem.removeEventListener("mouseup", handleArrowUp);
          elem.addEventListener("mouseup", handleArrowUp);
        } else if (e.target.closest(".arrow-highlight-mouse")) {
          console.log("arrow-highlight-mouse");
          shape = '<div class="shape-highlight-mouse"></div>';
          elem.insertAdjacentHTML("beforeend", shape);
          elem.removeEventListener("mousedown", handleArrowDown);
          elem.addEventListener("mousedown", handleArrowDown);
          elem.removeEventListener("mousemove", handleArrowMove);
          elem.addEventListener("mousemove", handleArrowMove);
          elem.removeEventListener("mouseup", handleArrowUp);
          elem.addEventListener("mouseup", handleArrowUp);
        }
      };

      document
        .querySelectorAll(".arrow-effects .effect-child-options span")
        .forEach(function (span) {
          span.removeEventListener("click", handleArrowClick);
          span.addEventListener("click", (e) => handleArrowClick(e));
        });

      function handleArrowDown() {
        const highlightClick = document.querySelector(".shape-highlight-click");
        const highlightMouse = document.querySelector(".shape-highlight-mouse");
        const spotlightCursor = document.querySelector(
          ".arrow-spotlight-cursor"
        );
        if (spotlightCursor) {
          document.querySelector(".arrow-spotlight-cursor").style.display =
            "block";
        } else if (highlightClick) {
          document.querySelector(".shape-highlight-click").style.display =
            "block";
        } else if (highlightMouse) {
          document.querySelector(".shape-highlight-mouse").style.display =
            "block";
        }
      }
      function handleArrowMove(e) {
        var top = e.pageY - 25;
        var left = e.pageX - 25;
        const spotlightCursor = document.querySelector(
          ".arrow-spotlight-cursor"
        );
        const highlightClick = document.querySelector(".shape-highlight-click");
        const highlightMouse = document.querySelector(".shape-highlight-mouse");
        if (spotlightCursor) {
          document.querySelector(".arrow-spotlight-cursor").style.top =
            top + "px";
          document.querySelector(".arrow-spotlight-cursor").style.left =
            left + "px";
        } else if (highlightClick) {
          document.querySelector(".shape-highlight-click").style.top =
            top + "px";
          document.querySelector(".shape-highlight-click").style.left =
            left + "px";
        } else if (highlightMouse) {
          document.querySelector(".shape-highlight-mouse").style.top =
            top + "px";
          document.querySelector(".shape-highlight-mouse").style.left =
            left + "px";
        }
      }
      function handleArrowUp() {
        if (document.querySelector(".shape-highlight-click")) {
          document.querySelector(".shape-highlight-click").style.display =
            "none";
        }
      }

      //dragable
      $("#floatable-recorder-tool").draggable();

      // this is for delay timer
      const delayDuration = props.timeDelay * 1000;
      let countdown = delayDuration / 1000;

      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "rgba(0, 0, 0, 0.7)";
      overlay.style.color = "white";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.fontSize = "2em";
      overlay.innerHTML = `Recording starts in ${countdown} seconds`;
      document.body.appendChild(overlay);

      function updateTimer() {
        overlay.innerHTML = `Recording starts in ${countdown} seconds`;
      }

      const timerInterval = setInterval(async () => {
        updateTimer();
        countdown--;
        if (countdown < 0) {
          //calling the recording controls function
          //  RecordingControls(props)
          document.querySelector("#floatable-recorder-tool").style.display =
            "flex";
          clearInterval(timerInterval);
          document.body.removeChild(overlay);
          this.video.style.display = "block";
          if (id != 2 && isCamera) {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
              audio: true,
              video: {
                width: { min: 1280 },
                height: { min: 720 },
              },
            });
            if (this.cameraStream) {
              document.querySelector(".cam-rec-disable").style.display = "none";
              document.querySelector(".cam-rec").style.display = "block";
              document.querySelector(".mic-rec-disable").style.display = "none";
              document.querySelector(".mic-rec").style.display = "block";
            }
            console.log("camera >>>>>>>>>>>>>>>>>", this.cameraStream);
            this.cameraVideo = document.createElement("video");
            this.cameraVideo.srcObject = this.cameraStream;
            this.cameraVideo.classList.add("circle-video");
            this.cameraVideo.style.cssText = "";
            this.cameraVideo.onloadedmetadata = () => {
              this.cameraVideo.play();
            };
            document.body.appendChild(this.cameraVideo);
            //draggable
            $(".circle-video").draggable();
            this.cameraToggle(this.cameraStream, this.cameraVideo, props);
            this.audioToggle(this.cameraStream, props);
          }
          if (id === 4) {
            document.querySelector(
              ".screen-cap-content"
            ).style.backgroundColor = "rgba(0, 0, 0, 0.033)";
            document.querySelector(".screen-cap-content").style.cursor =
              "pointer";
          }
          //timer function
          if (props.id) {
            this.timerRecord(
              props.autoStop,
              this.screenStream,
              this.mediaRecorder
            );
          }

          this.mediaRecorder.start();
        }
      }, 1000);
    } catch (err) {
      console.error("error in videoRecorderNDownloader method", err);
    }
  };

  // stop recording here
  stopRecording = (
    video,
    screenStream,
    mediaRecorder,
    id,
    cameraStream,
    cameraVideo
  ) => {
    // console.log("camerastream",cameraStream)
    console.log(
      "stop recording function",
      video,
      screenStream,
      mediaRecorder,
      id
    );
    video.pause();
    screenStream.getTracks().forEach((track) => track.stop()); // when this function executes then ondataavaible and onstop executes
    if (cameraStream) {
      // cameraStream.stop();
      cameraStream.getTracks().forEach((track) => track.stop()); // this is used to stop the camera stream
      cameraVideo.remove();
    }
    video.style.display = "none";
    mediaRecorder.stop();
    //removing recording controls
    document.querySelector("#floatable-recorder-tool").remove();
    if (id == 4) {
      console.log("inside stop recording id 4");
      // document.querySelector("#floatable-recorder-camera-container").remove();
      // document.querySelector("#selected-screen-capture-inner").remove();
      // document.querySelector(".screen-cap-top").remove();
      // document.querySelector(".screen-cap-right").remove();
      // document.querySelector(".screen-cap-left").remove();
      // document.querySelector(".screen-cap-bottom").remove();
      // document.querySelector(".screen-cap-content").remove();
      // document.querySelector("#selected-screen-capture").remove();
      document.querySelector("#floatable-recorder-tool-container").remove();
      var button = document.createElement("button");
      button.id = "stop";
      button.className =
        "border-solid border-2 border-red-600 rounded-lg block p-5 m-2 w-80 bg-slate-300 text-2xl font-bold hover:bg-slate-400";
      button.textContent = "Stop🛑";
      document.querySelector(".app").appendChild(button);
    }

    // if canvas present in the page
    if (id != 2) {
      const cang = document.querySelector("#draw-recording-anno");
      console.log(cang);
      if (cang) {
        cang.remove();
      }
    }
  };

  // camera toggle functionality

  cameraToggle(cameraStream, cameraVideo, props) {
    console.log(
      "inside camera toggle function ",
      cameraStream,
      cameraVideo,
      props
    );
    const camdis = document.querySelector(".cam-rec-disable");
    const camact = document.querySelector(".cam-rec");
    camdis.addEventListener("click", (e) => {
      this.camdisablefunction(cameraStream, cameraVideo, props, e);
    });
    camact.addEventListener("click", (e) => {
      this.camactfun(cameraStream, cameraVideo, props, e);
    });
  }
  async camdisablefunction(cameraStream, cameraVideo, props, e) {
    e.target.parentNode.style.display = "none";
    document.querySelector(".cam-rec").style.display = "block";
    console.log("cameradisfunction");
    cameraVideo.pause();
    cameraVideo.style.display = "block";
  }
  camactfun(cameraStream, cameraVideo, props, e) {
    if (cameraVideo && cameraStream) {
      e.target.parentNode.style.display = "none";
      document.querySelector(".cam-rec-disable").style.display = "block";
      console.log("camera function");
      // Stop the video playback
      cameraVideo.pause();

      // Remove the video element from the document
      cameraVideo.style.display = "none";

      // // Close the camera stream
      // const tracks = cameraStream.getTracks();
      // tracks.forEach(track => track.stop());
    }
  }

  // microphone toggle
  audioToggle(cameraStream, props) {
    const micicon = document.querySelector(".mic-rec");
    const micdisicon = document.querySelector(".mic-rec-disable");
    const audioTracks = cameraStream.getAudioTracks();
    //audiotracks === [MediaStreamTrack]0: MediaStreamTrack contentHint: "" enabled: false id: "f8113ed9-91b4-4801-98e7-64ec8215eba9" kind: "audio" label: "Default - Microphone (Lenovo FHD Webcam Audio) (17ef:4831)" muted: false oncapturehandlechange: null onended: null onmute: null onunmute: null readyState: "live" stats: null [[Prototype]]: MediaStreamTrack
    micicon.addEventListener("click", (e) => {
      if (audioTracks.length > 0) {
        e.target.parentNode.style.display = "none";
        micdisicon.style.display = "block";
        audioTracks[0].enabled = false;
        console.log(
          "mic icon2",
          audioTracks.length,
          "=====",
          audioTracks[0].enabled
        );
      }
    });
    micdisicon.addEventListener("click", (e) => {
      if (audioTracks.length > 0) {
        e.target.parentNode.style.display = "none";
        micicon.style.display = "block";
        audioTracks[0].enabled = true;
        console.log(
          "mic disable icon 2",
          audioTracks.length,
          "=====",
          audioTracks[0].enabled
        );
      }
    });
  }

  //timer  function
  timerRecord(autostop, screemstream, mediaStream) {
    console.log("time recorder", screemstream, mediaStream);
    let paused = false;
    let stop = 0;
    autostop = autostop * 60;
    const timer = document.querySelector(".timer-rec");
    let dat = new Date();
    dat.setHours(0, 0, 0);
    let min = dat.getMinutes();
    let sec = dat.getSeconds();
    const int = setInterval(() => {
      if (!paused) {
        sec++;
        stop++;
        // If seconds reach 60, reset seconds and increment minutes
        if (sec === 60) {
          sec = 0;
          min++;
        }

        // Update the innerText with the new values
        timer.innerText =
          min.toString().padStart(2, "0") +
          ":" +
          sec.toString().padStart(2, "0");

        // If 10 seconds have passed, clear the interval
        //  if (stop == 10) {
        if (stop == autostop) {
          clearInterval(int);
          // this.stopRecording
          document.querySelector(".close-rec").click();
        }
      } else {
        console.log("click on the resume button to start recording");
      }
    }, 1000);
    const pause = document.querySelector(".play-rec");
    pause.addEventListener("click", () => {
      mediaStream.pause();
      console.log("setinterval pause clicked");
      paused = true;
    });
    const resume = document.querySelector(".pause-rec");
    resume.addEventListener("click", (e) => {
      mediaStream.resume();
      console.log("setinterval resume clicked");
      paused = false;
    });
  }
  // draw anothations
  removeArrowEvents(){
    // if(jQuery(".shape-highlight-mouse")){ jQuery(".shape-highlight-mouse").remove(); }
    // if(jQuery(".shape-highlight-click")){ jQuery(".shape-highlight-click").remove(); }
    // if(jQuery(".arrow-spotlight-outer")){ jQuery(".arrow-spotlight-outer").remove(); }
    console.log("removeArrowEvents ");
    if (document.querySelector(".shape-highlight-mouse")) {
      document.querySelector(".shape-highlight-mouse").remove();
    }
    if (document.querySelector(".shape-highlight-click")) {
      document.querySelector(".shape-highlight-click").remove();
    }
    if (document.querySelector(".arrow-spotlight-outer")) {
      document.querySelector(".arrow-spotlight-outer").remove();
    }
  };
  mouseAnnoEvents(){
    var elem = "body";
    // //if(recordingType == 5){ elem = ".screen-cap-content"; }
    // jQuery(elem).unbind("mousemove");
    // jQuery(elem).unbind("mousedown");
    // jQuery(elem).unbind("mouseup");
    if (document.getElementById("draw-recording-anno")) {
      document
        .getElementById("draw-recording-anno")
        .removeEventListener("mousedown", this.mouseDownLine);
      document
        .getElementById("draw-recording-anno")
        .removeEventListener("mouseup", this.mouseUpLine);
      document
        .getElementById("draw-recording-anno")
        .removeEventListener("mousemove", this.mouseMoveLine);
    }
    this.annoEvents = false;
  };

  drawRecordingAnnotation = (type) => {
    var elem = "body";
    //if(recordingType == 5){ elem = ".screen-cap-content"; }
    this.removeArrowEvents();
    this.VideoDuration = type;
    var ww = window.innerWidth;
    var hh = document.body.scrollHeight; //jQuery(document).height(); //window.innerHeight;

    var canVA = null;
    if (!document.getElementById("draw-recording-anno")) {
      var canHtml = document.createElement("canvas");
      canHtml.id = "draw-recording-anno";
      canHtml.height = hh;
      canHtml.width = ww - 10;
      canHtml.style.position = "absolute";
      canHtml.style.top = 0;
      canHtml.style.left = 0;
      document.body.appendChild(canHtml);
      var canVA = document.getElementById("draw-recording-anno");
    } else {
      canVA = document.getElementById("draw-recording-anno");
    }
    // selector color get saved into this
    this.anno_selectedColor = this.selectedColor;
    document.querySelector("#draw-recording-anno").style.pointerEvents = "all";
    if (!this.annoEvents) {
      this.mouseAnnoEvents();
      canVA = document.getElementById("draw-recording-anno");
      canVA.addEventListener("mousedown", this.mouseDownLine, false);
      canVA.addEventListener("mouseup", this.mouseUpLine, false);
      canVA.addEventListener("mousemove", this.mouseMoveLine, false);
      this.annoEvents = true;
    }
    this.ctxR = canVA.getContext("2d");
    this.annoType = type;
    if (type == "Line") {
      canVA.addEventListener("mousedown", this.mouseDownLine, false);
      canVA.addEventListener("mouseup", this.mouseUpLine, false);
    } else if (type == "Reactangle" || type == "Arrow") {
      this.imageObjR = new Image();
      this.imageObjR.onload = () => {
        this.ctxR.drawImage(this.imageObjR, 0, 0);
      };
      this.imageObjR.src = canVA.toDataURL("image/png", 1);
    }
  };

  // Mouse down event while recording screen
  mouseDownLine = (e) => {
    this.rectR = {};
    this.rectR.startX = e.pageX;
    this.rectR.startY = e.pageY;
    if (this.annoType == "Line") {
      var highlightColor = this.anno_selectedColor;
      var c = document.getElementById("draw-recording-anno");
      this.ctxR = c.getContext("2d");
      this.ctxR.globalCompositeOperation = "multiply";
      this.ctxR.fillStyle = highlightColor;
      this.ctxR.strokeStyle = highlightColor;
      //this.ctxR.globalAlpha = "0.01";
      this.ctxR.lineWidth = 0;
      this.lineLastPoint = { x: e.pageX, y: e.pageY };
      c.onmousemove = this.mouseMoveLine;
    }
    this.dragRecord = true;
  };

  // Mouse move event while recording screen
  mouseMoveLine = (e) => {
    if (this.dragRecord) {
      if (this.annoType == "Arrow") {
        this.rectR.w = e.pageX;
        this.rectR.h = e.pageY;
      } else {
        this.rectR.w = e.pageX - this.rectR.startX;
        this.rectR.h = e.pageY - this.rectR.startY;
      }
      if (this.annoType == "Line") {
        var highlightH = 5;

        //rectR.w = e.pageX;
        //rectR.h = e.pageY;
        var currentPoint = { x: e.pageX, y: e.pageY };
        var dist = this.distanceBetween(this.lineLastPoint, currentPoint);
        var angle = this.angleBetween(this.lineLastPoint, currentPoint);
        for (var i = 0; i < dist; i += 3) {
          this.x = this.lineLastPoint.x + Math.sin(angle) * i - highlightH + 5;
          this.y = this.lineLastPoint.y + Math.cos(angle) * i - highlightH + 5;
          this.ctxR.beginPath();
          this.ctxR.arc(
            this.x + highlightH / 2,
            this.y + highlightH / 2,
            highlightH,
            false,
            Math.PI * 2,
            false
          );
          this.ctxR.closePath();
          this.ctxR.fill();
          this.ctxR.stroke();
        }
        this.lineLastPoint = currentPoint;
        this.drawRecordingAnnotation("Line");
      } else {
        this.drawRecordShape(this.annoType);
      }
    }
  };

  // Mouse up event while recording screen
  mouseUpLine = () => {
    this.drawRecordingAnnotation(this.VideoDuration);
    this.dragRecord = false;
  };
  // distance between two cordinates
  distanceBetween = (point1, point2) => {
    // console.log(point1, point2, ">>sFd;lfd")
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  };

  // angle between two cordinates
  angleBetween = (point1, point2) => {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  };

  // draw different annotations on screen while recording
  drawRecordShape = (type) => {
    var canvA = document.getElementById("draw-recording-anno");
    var fontOutline = this.anno_selectedColor;
    var fontOulineSize = 8;
    if (this.rectR.w > 0 && this.rectR.h > 0) {
      switch (type) {
        case "Reactangle":
          this.ctxR.beginPath();
          this.ctxR.fillStyle = "transparent";
          this.ctxR.clearRect(0, 0, canvA.width, canvA.height);
          this.ctxR.filter = "none";
          this.ctxR.drawImage(this.imageObjR, 0, 0);
          this.ctxR.strokeStyle = fontOutline;
          this.ctxR.lineWidth = fontOulineSize;
          this.ctxR.strokeRect(rectR.startX, rectR.startY, rectR.w, rectR.h);
          this.ctxR.stroke();
          this.ctxR.beginPath();
          break;
        case "Arrow":
          var headlen = 32;
          var dx = this.rectR.startX - this.rectR.w;
          var dy = this.rectR.startY - this.rectR.h;
          var angle = Math.atan2(dy, dx);
          this.ctxR.beginPath();
          this.ctxR.fillStyle = "transparent";
          this.ctxR.clearRect(0, 0, canvA.width, canvA.height);
          this.ctxR.filter = "none";
          this.ctxR.lineCap = "round";
          this.ctxR.drawImage(this.imageObjR, 0, 0);
          this.ctxR.strokeStyle = fontOutline;
          this.ctxR.lineWidth = fontOulineSize;
          this.ctxR.moveTo(this.rectR.startX, this.rectR.startY);
          this.ctxR.lineTo(this.rectR.w, this.rectR.h);
          let delta = Math.PI / 6;
          for (let i = 0; i < 2; i++) {
            this.ctxR.moveTo(this.rectR.w, this.rectR.h);
            let x = this.rectR.w + headlen * Math.cos(angle + delta);
            let y = this.rectR.h + headlen * Math.sin(angle + delta);
            this.ctxR.lineTo(x, y);
            delta *= -1;
          }
          this.ctxR.stroke();
          break;
      }
    }
  };

  CropScreen = (props, callback) => {
    let video_crop = false;
    let record_crop_startX;
    let record_crop_startY;
    console.log("CropScreen");
    const crop = document.createElement("div");
    const htmlWaitOverlay = `<div id="selected-screen-capture" style="float: left;width: 100%;height: 100%;position: absolute;">
                            <div id="selected-screen-capture-inner" style="float: left;width: 100%;height: 100%;position: absolute; cursor: crosshair ">
                                    <div class="screen-cap-top" style="position:absolute"></div>
                                    <div class="screen-cap-right" style="position:absolute"></div>
                                    <div class="screen-cap-left" style="position:absolute"></div>
                                    <div class="screen-cap-bottom" style="position:absolute"></div>
                                    <div class="screen-cap-content" style="position:absolute"></div>
                            </div>
                        </div>
                        `;
    // background-color: rgba(0, 0, 0, 0.7)
    // <div id="floatable-recorder-tool-container" style="width: 100%;height: 100%;position: fixed;top: 0px;left: 0px;z-index: 9998; pointer-events: none;"></div>
    // <div id="floatable-recorder-camera-container" style="width: 100%;height: 100%;position: fixed;top: 0px;left: 0px;z-index: 9998; pointer-events: none;"></div>
    crop.innerHTML = htmlWaitOverlay;
    crop.style.position = "fixed";
    crop.style.top = "0";
    crop.style.left = "0";
    crop.style.width = "100%";
    crop.style.height = "100%";
    crop.style.color = "white";
    crop.style.display = "flex";
    crop.style.fontSize = "2em";
    // crop.style.background = 'rgba(0, 0, 0, 0.7)'
    crop.id = "floatable-recorder-tool-container";
    document.body.appendChild(crop);
    const cropp = document.getElementById("selected-screen-capture-inner");
    const moveDownHandler = (e) => {
      video_crop = true;
      record_crop_startX = e.clientX;
      record_crop_startY = e.clientY;
      console.log(record_crop_startX, record_crop_startY, e.screenX, e.screenY);
      const mouseMoveHandler = (e) => {
        if (video_crop) {
          document.getElementById(
            "selected-screen-capture-inner"
          ).style.backgroundColor = "transparent";

          let winW = e.currentTarget.clientWidth;
          let winH = e.currentTarget.clientHeight;
          console.log(winW, winH);

          if (!document.getElementById("dimensions-message")) {
            let dimensionsMessage = document.createElement("span");
            dimensionsMessage.id = "dimensions-message";
            dimensionsMessage.style.width = "fit-content";
            dimensionsMessage.style.color = "#e30808";
            dimensionsMessage.style.position = "absolute";
            dimensionsMessage.style.bottom = "-30px";
            dimensionsMessage.style.right = "0px";
            dimensionsMessage.style.border = "solid";
            dimensionsMessage.style.fontSize = "medium";
            dimensionsMessage.innerHTML = "0*0 (min. 500*350)";

            document
              .querySelector(".screen-cap-content")
              .appendChild(dimensionsMessage);
          }

          let contentW = e.clientX - record_crop_startX;
          let contentH = e.clientY - record_crop_startY;

          document.getElementById("dimensions-message").innerHTML =
            contentW + "*" + contentH + " (min. 500*350)";
          let contentT = record_crop_startY;
          let contentL = record_crop_startX;

          let topW = record_crop_startX + contentW;
          let topH = record_crop_startY;

          let rightW = winW - topW;
          let rightH = topH + contentH;

          let leftW = record_crop_startX;
          let leftH = winH - topH;

          let bottomW = winW - leftW;
          let bottomH = winH - rightH;

          contentW = contentW + "px";
          contentH = contentH + "px";
          contentT = contentT + "px";
          contentL = contentL + "px";
          topW = topW + "px";
          topH = topH + "px";
          rightW = rightW + "px";
          rightH = rightH + "px";
          leftW = leftW + "px";
          leftH = leftH + "px";
          bottomW = bottomW + "px";
          bottomH = bottomH + "px";

          document.querySelector(".screen-cap-top").style.width = topW;
          document.querySelector(".screen-cap-top").style.height = topH;

          document.querySelector(".screen-cap-right").style.width = rightW;
          document.querySelector(".screen-cap-right").style.height = rightH;

          document.querySelector(".screen-cap-left").style.width = leftW;
          document.querySelector(".screen-cap-left").style.height = leftH;

          document.querySelector(".screen-cap-bottom").style.width = bottomW;
          document.querySelector(".screen-cap-bottom").style.height = bottomH;

          var screenCapContent = document.querySelector(".screen-cap-content");
          screenCapContent.style.width = contentW;
          screenCapContent.style.height = contentH;
          screenCapContent.style.zIndex = 2;
          screenCapContent.style.top = contentT;
          screenCapContent.style.left = contentL;
          screenCapContent.style.backgroundColor = "#00000047";
        }
      };

      const mouseUpHandler = () => {
        let capW = parseInt(jQuery(".screen-cap-content").css("width"));
        let capH = parseInt(jQuery(".screen-cap-content").css("height"));
        if (capW < 500 || capH < 350) {
          video_crop = false;
          document.getElementById(
            "selected-screen-capture-inner"
          ).style.backgroundColor = "rgba(0, 0, 0, 0.3)";

          document.querySelector(".screen-cap-top").style.width = "0";
          document.querySelector(".screen-cap-top").style.height = "0";

          document.querySelector(".screen-cap-right").style.width = "0";
          document.querySelector(".screen-cap-right").style.height = "0";

          document.querySelector(".screen-cap-left").style.width = "0";
          document.querySelector(".screen-cap-left").style.height = "0";

          document.querySelector(".screen-cap-bottom").style.width = "0";
          document.querySelector(".screen-cap-bottom").style.height = "0";

          var screenCapContent = document.querySelector(".screen-cap-content");
          screenCapContent.style.width = "0";
          screenCapContent.style.height = "0";
          screenCapContent.style.zIndex = "2";
          screenCapContent.style.top = "0";
          screenCapContent.style.left = "0";

          alert("Selection must be more than 500*350.");

          return;
        } else {
          console.log("innnn");
          var stopButton = document.querySelector("#stop");
          var screenCapContent = document.querySelector(".screen-cap-content");

          stopButton.style.width = "80px";
          stopButton.style.margin = "2px";
          stopButton.style.padding = "2px";
          stopButton.style.fontSize = "15px";
          stopButton.style.position = "absolute";
          stopButton.style.bottom = "15px";
          stopButton.style.right = "20px";

          screenCapContent.appendChild(stopButton);

          // document.getElementById("recorder-tool-controls-inner").style.display = "none";
          // document.getElementById("camera-recording-preview").style.display = "none";

          // if (props.id != 1 && props.id != 2) { document.getElementById("camera-tool-controls").style.display = "none"; }

          // document.querySelector(".close-toobar").style.display = "none";
          // document.getElementById("recorder-tool-custom-tab").style.display = "block";

          let toolX = 0;
          let toolY = 0;
          if (props.id == "4") {
            toolX =
              parseInt(jQuery(".screen-cap-content").css("left")) +
              parseInt(jQuery(".screen-cap-content").css("width")) -
              130;
            toolY =
              parseInt(jQuery(".screen-cap-content").css("top")) +
              parseInt(jQuery(".screen-cap-content").css("height"));
          } else {
            toolX = parseInt(jQuery(".screen-cap-content").css("left"));
            toolY =
              parseInt(jQuery(".screen-cap-content").css("top")) +
              parseInt(jQuery(".screen-cap-content").css("height"));
          }
          cropp.removeEventListener("mousemove", mouseMoveHandler);
          cropp.removeEventListener("mouseup", mouseUpHandler);
          cropp.removeEventListener("mousedown", moveDownHandler);
          callback();
          return;
        }
      };
      cropp.addEventListener("mousemove", mouseMoveHandler);
      // cropp.removeEventListener('mouseup')
      cropp.addEventListener("mouseup", mouseUpHandler);
    };
    cropp.addEventListener("mousedown", moveDownHandler);
  };
}
export default record;
