import handleVideoCapture from "./handleVideoCapture";
import recordd from "./recordClass";
const RecordType = (props) => {
  const record = new recordd()
  console.log(record, "record class here ")
//  props.uploadType = "Cloud";
//  console.log("recordType >><", props);
  if (props.event === "record") {
    if (props.uploadType != "Local") {
      if (props.videoLimit === 10 ) {
        let text =
          "You have reached the max upload limit, so you cannot upload videos to the cloud. Do you want to continue with local download?";
        if (confirm(text)) {
            props.uploadType = "Local";
            console.log("video equal", props)
          // handleVideoCapture(props);
          record.handleRecord(props)
        }
      } else {
        console.log("not video equal")
        // handleVideoCapture(props);
        record.handleRecord(props)
      }
    } else {
        console.log("local")
      // handleVideoCapture(props);
      record.handleRecord(props)
    }
  }
};

export default RecordType;
