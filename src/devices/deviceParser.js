const devices = {
  parseADB(devicesUnparsed) {
    // plain text
    let devicesArray = devicesUnparsed.replace(/\r\n/, "\n").split("\n");
    devicesArray.shift();
    devicesArray.splice(-2, 2);
    // [SN\tmode]
    return devicesArray;
  },
  parseFB(devicesUnparsed) {
    let devicesArray = text.replace(/\r\n/, "\n").split("\n");

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
    return devicesArray;
  },
};

export default devices;