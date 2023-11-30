const theme = {
  setDark: function () {
    $("head").append(`<link rel="stylesheet" href="css/dark.css">`);
  },
  setLight: function () {
    $("head").append(`<link rel="stylesheet" href="css/light.css">`);
  },
};

export default theme;
