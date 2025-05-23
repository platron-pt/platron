const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getVersion: () => getVersion,
  writeFile: (...args) => ipcRenderer.send("write-file", ...args),
  writeFileToPrivDir:(...args)=>{ipcRenderer.send("write-file-to-priv-dir",...args)},
  runCommand: (...args) => ipcRenderer.send("run-command", ...args),
  send: (channel, args) => ipcRenderer.send(channel, args),
  handle: (channel, callback) =>
    ipcRenderer.on(channel, (event, args) => callback(args)),
  invoke: (channel, args) => {
    return ipcRenderer.invoke(channel, args);
  },
  removeIPCListener:(channel)=>{
    ipcRenderer.removeAllListeners(channel)
  }
});
