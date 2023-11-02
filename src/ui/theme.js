const theme = {
  setDark: function () {
    $(".winCtrl-btn").css("background-color", "unset");
    $("#close-btn:hover").css("background-color", "red");
    $("#max-btn:hover,#min-btn:hover").css("background-color", "darkgray");
    $(".operations:hover").css("color", "black");
  },
  setLight: function () {
    $(".winCtrl-btn").css("background-color", "rgba(255, 255, 255, 0)");
    $(".winCtrl-btn").css("color", "white");
    $("#close-btn:hover").css("background-color", "brown");
    $("#max-btn:hover,#min-btn:hover").css("background-color", "#3c3642");
    $(".operations:hover").css("color", "white");
  },
};

export default theme;
