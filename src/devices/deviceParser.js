let getPlatform;
api.invoke("get-platform").then((result) => (getPlatform = result));
function parseSerialAndStatus(deviceAndSerial) {
  return deviceAndSerial.map((device) => device.split(/\t/));
}

const devices = {
  parseADB(devicesUnparsed) {
    // plain text
    let devicesArray = devicesUnparsed.replace(/\r\n/, "\n").split("\n");
    devicesArray.shift();
    devicesArray.splice(-2, 2);
    // [SN\tmode]
    const deviceParsed = parseSerialAndStatus(devicesArray);
    return deviceParsed;
  },
  parseFB(devicesUnparsed) {
    let devicesArray = devicesUnparsed.replace(/\r\n/, "\n").split("\n");
    if (getPlatform == "linux") {
      devicesArray.splice(-2, 2);
      devicesArray = devicesArray.flatMap((element, index) => {
        if (index % 2) {
          return [];
        } else {
          return element;
        }
      });
    }

    if (getPlatform == "win32") {
      devicesArray.splice(-1, 1);
      devicesArray = devicesArray.flatMap((element, index) => {
        return element;
      });
    }
    // [SN\tmode]

    const deviceParsed = parseSerialAndStatus(devicesArray);
    return deviceParsed;
  },
};

export default devices;
