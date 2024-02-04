let osType = "";
let osRelease = "";
let platform = "";
let appVersion = "";

api.invoke("get-os-type").then((result) => (osType = result));
api.invoke("get-os-release").then((result) => (osRelease = result));
api.invoke("get-platform").then((result) => (platform = result));
api.invoke("get-version").then((result) => (appVersion = result));

const platformInfo = {
  os: {
    type: osType,
    release: osRelease,
  },
  appVersion: appVersion,
  platform: platform,
};
export default platformInfo;
