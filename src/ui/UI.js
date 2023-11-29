export const oprs = {
  system: {
    navbar: "System",
    items: {
      power: {
        rev: 3,
        title: "Reboot to",
        name: "system-power-menu",
        script: [
          {
            mode: "adb",
            verb: "reboot",
            params: ["$radio"],
          },
        ],
        content: [
          {
            type: "radio",
            value: "bootloader",
            misc: "checked",
          },
          {
            type: "radio",
            value: "recovery",
          },
          {
            type: "radio",
            value: "fastboot",
          },
          {
            type: "radio",
            value: "system",
          },
          {
            type: "radio",
            value: "sideload",
          },
          {
            type: "radio",
            value: "other",
          },
          {
            type: "input",
            value: "input",
            misc: "Other target",
          },
        ],
        navbar: "Reboot to",
      },
      push: {
        rev: 3,
        title: "Push file to /sdcard",
        name: "push-menu",
        navbar: "Push file to /sdcard",
        script: [
          {
            mode: "adb",
            verb: "push",
            params: ["$file", "/sdcard"],
          },
        ],
        content: [
          {
            type: "file",
            value: "file",
          },
        ],
      },
      install: {
        rev: 3,
        title: "Install apk file",
        name: "install-menu",
        subtitle: "For installing apk, not for flashing magisk!",
        navbar: "Install apk file",
        script: [
          {
            mode: "adb",
            verb: "install",
            params: ["$file"],
          },
        ],
        content: [
          {
            type: "file",
            value: "file",
            misc: ".apk,application/zip",
          },
        ],
      },
      getprop: {
        rev: 3,
        title: "Get infos from *.prop file",
        name: "getprop-menu",
        navbar: "Get properties",
        script: [
          {
            mode: "adb",
            verb: "shell",
            params: ["getprop", "$radio"],
          },
        ],
        content: [
          {
            type: "radio",
            value: "ro.boot.slot_suffix",
            misc: "checked",
          },
          {
            type: "radio",
            value: "ro.apex.updatable",
          },
          {
            type: "radio",
            value: "ro.build.fingerprint",
          },
          {
            type: "radio",
            value: "ro.build.version.release",
          },
          {
            type: "radio",
            value: "ro.build.version.security_patch",
          },
          {
            type: "radio",
            value: "ro.product.board",
          },
          {
            type: "radio",
            value: "ro.product.brand",
          },
          {
            type: "radio",
            value: "ro.product.model",
          },
          {
            type: "radio",
            value: "ro.secure",
          },
          {
            type: "radio",
            value: "ro.adb.secure",
          },
          {
            type: "radio",
            value: "sys.usb.config",
          },
          {
            type: "radio",
            value: "",
          },
          {
            type: "radio",
            value: "other",
          },
          {
            type: "input",
            value: "input",
            misc: "Other property",
          },
        ],
      },
      density: {
        rev: 3,
        title: "Set DPI",
        name: "density-menu",
        navbar: "Set DPI",
        script: [
          {
            mode: "adb",
            verb: "shell",
            params: ["wm", "density", "$radio"],
          },
        ],
        content: [
          {
            type: "radio",
            value: "reset",
          },
          {
            type: "radio",
            value: "other",
          },
          {
            type: "input",
            value: "input",
            misc: "Custom value",
          },
        ],
      },
    },
  },
  recovery: {
    navbar: "Recovery",
    items: {
      sideload: {
        rev: 3,
        title: "Sideload flashable zip",
        name: "sideload-menu",
        subtitle: "You can flash magisk here",
        navbar: "Sideload flashable zip",
        script: [
          {
            mode: "adb",
            verb: "sideload",
            params: ["$file"],
          },
        ],
        content: [
          {
            type: "file",
            value: "file",
            misc: "application/zip,.apk",
          },
        ],
      },
    },
  },
  fastboot: {
    navbar: "Fastboot",
    items: {
      power: {
        rev: 3,
        title: "Reboot to",
        name: "power-menu",
        needUnlock: false,
        navbar: "Reboot to",
        script: [
          {
            mode: "fastboot",
            verb: "reboot",
            params: ["$radio"],
          },
        ],
        content: [
          {
            type: "radio",
            value: "bootloader",
            misc: "checked",
          },
          {
            type: "radio",
            value: "recovery",
          },
          {
            type: "radio",
            value: "fastboot",
          },
          {
            type: "radio",
            value: "system",
          },
          {
            type: "radio",
            value: "sideload",
          },
          {
            type: "radio",
            value: "other",
          },
          {
            type: "input",
            value: "input",
            misc: "Other target",
          },
        ],
      },
      boot: {
        rev: 3,
        title: "Boot a image",
        name: "boot-menu",
        subtitle: "Some models are not supported",
        needUnlock: true,
        navbar: "Boot a image",
        script: [
          {
            mode: "fastboot",
            verb: "boot",
            params: ["$file"],
          },
        ],
        content: [
          {
            type: "file",
            value: "file",
            misc: ".img,.bin",
          },
        ],
      },
      flash: {
        rev: 3,
        title: "Flash image to partition",
        name: "flash-menu",
        needUnlock: true,
        navbar: "Flash image to partition",
        script: [
          {
            mode: "fastboot",
            verb: "flash",
            params: ["$radio", "$file"],
          },
        ],
        content: [
          {
            type: "radio",
            value: "boot",
            misc: "checked",
          },
          {
            type: "radio",
            value: "bootloader",
          },
          {
            type: "radio",
            value: "init_boot",
          },
          {
            type: "radio",
            value: "dtbo",
          },
          {
            type: "radio",
            value: "vbmeta",
          },
          {
            type: "radio",
            value: "recovery",
          },
          {
            type: "radio",
            value: "radio",
          },
          {
            type: "radio",
            value: "super",
          },
          {
            type: "radio",
            value: "system",
          },
          {
            type: "radio",
            value: "vendor",
          },
          {
            type: "radio",
            value: "userdata",
          },
          {
            type: "radio",
            value: "other",
          },
          {
            type: "input",
            value: "input",
            misc: "Partition to flash",
          },
          {
            type: "file",
            value: "file",
            misc: ".img,.bin,.mbn,.txt,.zip",
          },
        ],
      },
      flash_remove_verity: {
        rev: 3,
        title: "Disable dm-verity (by flashing modifed vbmeta image)",
        name: "flash-menu",
        needUnlock: true,
        navbar: "Disable dm-verity",
        script: [
          {
            mode: "fastboot",
            verb: "flash",
            params: [
              "--disable-verity",
              "--disable-verification",
              "vbmeta",
              "$file",
            ],
          },
        ],
        content: [
          {
            type: "file",
            value: "file",
            misc: ".img,.bin,.mbn,.txt,.zip",
          },
        ],
      },
      erase: {
        rev: 3,
        title: "Erase partition",
        name: "erase-menu",
        needUnlock: true,
        navbar: "Erase partition",
        script: [
          {
            mode: "fastboot",
            verb: "erase",
            params: ["$radio"],
          },
        ],
        content: [
          {
            type: "radio",
            value: "boot",
            misc: "checked",
          },
          {
            type: "radio",
            value: "init_boot",
          },
          {
            type: "radio",
            value: "dtbo",
          },
          {
            type: "radio",
            value: "vbmeta",
          },
          {
            type: "radio",
            value: "recovery",
          },
          {
            type: "radio",
            value: "super",
          },
          {
            type: "radio",
            value: "system",
          },
          {
            type: "radio",
            value: "vendor",
          },
          {
            type: "radio",
            value: "cache",
          },
          {
            type: "radio",
            value: "userdata",
          },
          {
            type: "radio",
            value: "metadata",
          },
          {
            type: "radio",
            value: "other",
          },
          {
            type: "input",
            value: "input",
            misc: "Partition to erase",
          },
        ],
      },
      format: {
        rev: 3,
        title: "Format partition",
        name: "format-menu",
        needUnlock: true,
        navbar: "Format partition",
        script: [
          {
            mode: "fastboot",
            verb: "format",
            params: ["$radio"],
          },
        ],
        content: [
          {
            type: "radio",
            value: "super",
            misc: "checked",
          },
          {
            type: "radio",
            value: "system",
          },
          {
            type: "radio",
            value: "vendor",
          },
          {
            type: "radio",
            value: "cache",
          },
          {
            type: "radio",
            value: "userdata",
          },
          {
            type: "radio",
            value: "other",
          },
          {
            type: "input",
            value: "input",
            misc: "Partition to format",
          },
        ],
      },
      flashing: {
        rev: 3,
        title: "Fastboot flashing",
        name: "flashing-menu",
        needUnlock: false,
        navbar: "Fastboot flashing",
        script: [
          {
            mode: "fastboot",
            verb: "flashing",
            params: ["$radio"],
          },
        ],
        content: [
          {
            type: "radio",
            value: "unlock",
            misc: "checked",
          },
          {
            type: "radio",
            value: "lock",
          },
          {
            type: "radio",
            value: "unlock_critical",
          },
          {
            type: "radio",
            value: "lock_critical",
          },
          {
            type: "radio",
            value: "get_unlock_ability",
          },
          {
            type: "radio",
            value: "other",
          },
          {
            type: "input",
            value: "input",
            misc: "Custom command",
          },
        ],
      },
      oem: {
        rev: 3,
        title: "Fastboot oem",
        name: "oem-menu",
        needUnlock: true,
        navbar: "Fastboot oem",
        script: [
          {
            mode: "fastboot",
            verb: "oem",
            params: ["$radio"],
          },
        ],
        content: [
          {
            type: "radio",
            value: "unlock",
            misc: "checked",
          },
          {
            type: "radio",
            value: "lock",
          },
          {
            type: "radio",
            value: "device-info",
          },
          {
            type: "radio",
            value: "cdms",
          },
          {
            type: "radio",
            value: "other",
          },
          {
            type: "input",
            value: "input",
            misc: "Custom command",
          },
        ],
      },
      update: {
        rev: 3,
        title: "Fastboot update",
        name: "update-menu",
        needUnlock: true,
        navbar: "Fastboot update",
        script: [
          {
            mode: "fastboot",
            verb: "update",
            params: ["$file"],
          },
        ],
        content: [
          {
            type: "file",
            value: "file",
            misc: "application/zip",
          },
        ],
      },
      getvar: {
        rev: 3,
        title: "Fastboot getvar",
        name: "getvar-menu",
        needUnlock: false,
        navbar: "Fastboot getvar",
        script: [
          {
            mode: "fastboot",
            verb: "getvar",
            params: ["$radio"],
          },
        ],
        content: [
          {
            type: "radio",
            value: "all",
            misc: "checked",
          },
          {
            type: "radio",
            value: "current-slot",
          },
          {
            type: "radio",
            value: "unlocked",
          },
          {
            type: "radio",
            value: "is-userspace",
          },
          {
            type: "radio",
            value: "anti",
          },
          {
            type: "radio",
            value: "other",
          },
          {
            type: "input",
            value: "input",
            misc: "Custom variable",
          },
        ],
      },
      active: {
        rev: 3,
        title: "Switch active slot to",
        name: "active-menu",
        needUnlock: true,
        navbar: "Switch active slot to",
        script: [
          {
            mode: "fastboot",
            verb: "set_active",
            params: ["$radio"],
          },
        ],
        content: [
          {
            type: "radio",
            value: "a",
            misc: "checked",
          },
          {
            type: "radio",
            value: "b",
            misc: "",
          },
        ],
      },
    },
  },
  settings: {
    navbar: "Settings",
    items: {
      settings: {
        title: "TODO",
        subtitle: "TODO",
        noStartButton: true,
        navbar: "TODO",
      },
      updater: {
        title: "Online Updates",
        noStartButton: true,
        navbar: "Online Updates",
      },
    },
  },
};

export const availableLanguages = ["zh-TW", "zh-CN", "en-US"];
export const settings = {
  language: {
    title: "Language:",
    type: "dropdown",
    name: "language",
    options: [...availableLanguages, "auto"],
  },
  theme: {
    title: "Theme:",
    type: "dropdown",
    name: "theme",
    options: ["light", "dark", "auto"],
  },
  updateFrequency: {
    title: "Update frequency (days):",
    type: "dropdown",
    name: "updateFrequency",
    options: ["1", "2", "3", "7", "14"],
  },
};
