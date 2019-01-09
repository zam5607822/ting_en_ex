var Media = function() {
    this.startTime = [];
    this.$buffer = $(".buffer");
    this.$buffering = this.$buffer.find(".buffering");
    this.$playing = this.$buffer.find(".playing");
    this.$playButton = $(".playControl #playButton a");
    this.$pause = $(".playControl .pause a");
    this.$pre = $(".playControl .pre a");
    this.$next = $(".playControl .next a");
    this.$repeatButton = $(".modeControls #repeatControl a");
    this.$translateButton = $(".modeControls #translateControl a");
    this.$fullScreenButton = $(".modeControls #fullScreenPlay a");
    this.$modeButton = $(".modeControls #modeControl a");
    this.$desktopButton = $(".modeControls #desktopControl a");
    this.$soundButton = $(".modeControls .sound a");
    this.$positionControl = this.$buffer.find(".positionControl");
    this.$volumeControl = $(".volumeControl .soundControl");
    this.$sounds = $(".volumeControl .sounds");
    this.$loading = $(".playInfo .itemState");
    this.$playtime = $(".playtime");
    this.repeatStates = ["repeat,循环播放", "repeated,单篇循环播放", "repeatSen,单句循环播放"];
    this.repeatIndex = 0;
    this.repeatState = Tools.getLocalStorage("repeatState");
    this.modeState = Tools.getLocalStorage("modeState");
    this.desktopState = Tools.getLocalStorage("desktopState");
    this.desktopStateSeted = false;
    this.translateState = "";
    this.volume = parseInt(Tools.getLocalStorage("volume"));
    this.articleIndex = 0;
    this.playIndex = 0;
    this.startMedia = false;
    this.fillwordState = false;
    this.isFullScreen = false;
  };
  Media.prototype.getData = function(a) {
    return this[a];
  };
  Media.prototype.setData = function(a, b) {
    this[a] = b;
  };
  Media.prototype.init = function(e) {
    
    var c = this.volume,
      d = 100 - c + 10;
    if (!this.repeatState) {
      this.repeatState = "repeat,循环播放";
    }
    for (var b = 0, a = this.repeatStates.length; b < a; b++) {
      if (this.repeatStates[b] == this.repeatState) {
        this.repeatIndex = b;
        break;
      }
    }
    Qt.setState("repeat", this.repeatState.split(",")[0]);
    this.repeatState = this.repeatStates[this.repeatIndex];
    this.$repeatButton.parent().attr("class", this.repeatState.split(",")[0]);
    if (!this.modeState) {
      this.modeState = "read,阅读模式";
    }
    Qt.setState("mode", this.modeState.split(",")[0]);
    this.$modeButton.parent().attr("class", this.modeState.split(",")[0]);
    if (!this.desktopState) {
      this.desktopState = "desktopOff,已关闭桌面显示文章段落";
    }
    this.setDesktopState(this.desktopState);
    this.$sounds.css({
      height: c,
      top: d
    });
    this.$volumeControl.css({
      top: d - 10
    });
    $("body").bind("keydown", function(f) {
      if (!f.ctrlKey) {
        f.preventDefault();
      }
    }).bind("keyup", function(f) {
      if (!f.ctrlKey) {
        f.preventDefault();
      }
      switch (f.which) {
        case 39:
          if (f.shiftKey) {
            e.next();
          } else {
            e.nextSentence();
          }
          break;
        case 37:
          if (f.shiftKey) {
            e.pre();
          } else {
            e.previousSentence();
          }
          break;
        case 38:
          if ($(".volumeControl").css("display") == "none") {
            $(".volumeControl").css({
              display: "block"
            });
          }
          if (e.volume >= 100) {
            e.volume = 100;
          } else {
            if (e.volume <= 0) {
              e.volume = 0;
              e.$soundButton.parent().removeClass("mute");
            }
            e.volume += 10;
          }
          e.setVolume();
          break;
        case 40:
          if ($(".volumeControl").css("display") == "none") {
            $(".volumeControl").css({
              display: "block"
            });
          }
          if (e.volume == 0) {
            e.volume = 0;
          } else {
            if (e.volume == 10) {
              e.$soundButton.parent().addClass("mute");
            }
            e.volume -= 10;
          }
          e.setVolume();
          break;
        case 32:
          e.playControl();
          break;
        case 68:
          e.desktopControl();
          break;
        case 77:
          e.modeControl();
          break;
        case 78:
          e.nextSentence();
          break;
        case 80:
          e.previousSentence();
          break;
        case 82:
          e.repeatControl();
          break;
        case 84:
          e.translateControl();
          break;
      }
    }).bind("mouseup", function() {
      if ($(".volumeControl").css("display") == "block") {
        $(".volumeControl").hide();
      }
      $("body").unbind("mousemove");
      document.onselectstart = null;
    });
    this.$playButton.bind("click", function() {
      e.playControl();
    });
    this.$pre.bind("click", function() {
      e.pre();
    });
    this.$next.bind("click", function() {
      e.next();
    });
    this.$translateButton.bind("click", function() {
      e.translateControl();
    });
    this.$fullScreenButton.bind("click", function() {
      e.fullScreenControl();
    });
    this.$repeatButton.bind("click", function() {
      e.repeatControl();
    });
    this.$modeButton.bind("click", function() {
      e.modeControl();
    });
    this.$desktopButton.bind("click", function() {
      e.desktopControl();
    });
    this.$soundButton.bind("click", function() {
      switch ($(".volumeControl").css("display")) {
        case "none":
          $(".volumeControl").show();
          break;
        case "block":
          $(".volumeControl").hide();
          break;
      }
    }).bind("mouseup", function(f) {
      f.stopPropagation();
    });
    this.$volumeControl.bind("mousedown", function() {
      document.onselectstart = function() {
        return false;
      };
      $("body").bind("mousemove", function(f) {
        e.volumeMove(f);
      }).one("mouseup", function(f) {});
    });
    this.$positionControl.click(function(f) {
      f.stopPropagation();
    }).bind("mousedown", function() {
      Qt.setLoadPositionState("true");
      var f;
      document.onselectstart = function() {
        return false;
      };
      $("body").bind("mousemove", function(g) {
        f = e.positionMove(g);
      }).one("mouseup", function(g) {
        Qt.loadPosition(f);
        e.$playButton.parent().attr("class", "pause");
      });
    });
    this.$buffer.click(function(g) {
      var f = e.positionMove(g);
      Qt.loadPosition(f);
      e.$playButton.parent().attr("class", "pause");
    });
  };
  Media.prototype.positionMove = function(d) {
    var c = d.pageX - $(".bufferC").offset().left - parseInt($(".bufferC").css("padding-left")),
      b = $(".bufferC").width(),
      a;
    if (c >= 0 && c <= b) {
      a = parseInt(c / b * 100);
      this.$positionControl.css({
        left: a + "%"
      });
    } else {
      if (c < 0) {
        a = 0;
      }
      if (c > b) {
        a = 99;
      }
    }
    this.setPlaying(a);
    return a;
  };
  Media.prototype.volumeMove = function(b) {
    var a = b.pageY - $(".volume").offset().top;
    if (a >= 100) {
      a = 100;
      this.$soundButton.parent().addClass("mute");
    } else {
      if (this.$soundButton.parent().hasClass("mute")) {
        this.$soundButton.parent().removeClass("mute");
      }
      if (a <= 0) {
        a = 0;
      }
    }
    a = 100 - a;
    this.volume = a;
    this.setVolume();
  };
  Media.prototype.cancelPlay = function() {
    this.$playButton.parent().removeClass("pause").addClass("play");
    Qt.cancelPlay();
  };
  Media.prototype.initPlay = function(g, f, b) {
    $(".wrap").scrollTop(0);
    if (this.startMedia == false) {
      this.startMedia = true;
      this.init(this);
    }
    this.articleIndex = article.getData("index");
    if ($("#J_CIKU_sentence_time_range").length == 0) {
      this.startTime = [];
    } else {
      this.startTime = $("#J_CIKU_sentence_time_range").val().split(",");
    }
    var c = this.startTime,
      e, h = [];
    for (var d = 0, a = c.length; d < a; d++) {
      e = this.getTransformTimes(c[d]);
      if (!isNaN(e)) {
        h.push(e);
      }
    }
    this.setBuffering(0);
    this.setPlaying(0);
    Qt.initPlay(g, f, h, b);
  };
  Media.prototype.getTransformTimes = function(d) {
    var c = d.split(".");
    var a = c[0].split(":"),
      b;
    if (a.length == 2) {
      b = a[0] * 60 + a[1] * 100 / 100;
    } else {
      if (a.length == 3) {
        b = a[0] * 3600 + a[1] * 60 + a[2] * 100 / 100;
      }
    }
    if (c.length > 1) {
      b += c[1] / 100;
    }
    b *= 1000;
    return b;
  };
  Media.prototype.getFormatTime = function(c) {
    c = parseInt(c / 1000);
    var a = parseInt(c / 60),
      b = c - a * 60;
    if (a < 10) {
      a = "0" + a;
    }
    if (b < 10) {
      b = "0" + b;
    }
    return a + ":" + b;
  };
  Media.prototype.setDurationtime = function(a) {
    var b = this.getFormatTime(a);
    this.$playtime.find(".duration").html(b);
  };
  Media.prototype.setCurtime = function(b) {
    var a = this.getFormatTime(b);
    this.$playtime.find(".curtime").html(a);
  };
  Media.prototype.highlight = function(a) {
    this.playIndex = a;
    var b = this.startTime[a];
    article.highlight(b);
  };
  Media.prototype.setFillwordState = function(a) {
    this.fillwordState = a;
  };
  Media.prototype.playControl = function() {
    switch (this.$playButton.parent().attr("class")) {
      case "play":
        var a = 0;
        if (/fillword/.test(this.modeState) && this.fillwordState) {
          var b = this.startTime[this.playIndex];
          a = this.getTransformTimes(b);
          if (a == 0) {
            a = 1;
          }
        }
        this.play(a);
        break;
      case "pause":
        this.pause();
        break;
    }
  };
  Media.prototype.updatePlayState = function() {
    this.$playButton.parent().removeClass("play").addClass("pause");
  };
  Media.prototype.play = function(a) {
    this.updatePlayState();
    Qt.play(a);
  };
  Media.prototype.updatePauseState = function() {
    this.$playButton.parent().removeClass("pause").addClass("play");
  };
  Media.prototype.pause = function() {
    this.updatePauseState();
    Qt.pause();
  };
  Media.prototype.nextSentence = function() {
    ++this.playIndex;
    if (this.playIndex >= this.startTime.length) {
      this.playIndex = this.startTime.length = 1;
    }
    this.continuePlaySentence();
  };
  Media.prototype.previousSentence = function() {
    --this.playIndex;
    if (this.playIndex < 0) {
      this.playIndex = 0;
    }
    this.continuePlaySentence();
  };
  Media.prototype.continuePlaySentence = function() {
    if (this.playIndex < 0 || this.playIndex >= this.startTime.length) {
      this.play(0, false);
      return;
    }
    Qt.setLoadPositionState("true");
    var b = this.startTime[this.playIndex],
      a = this.getTransformTimes(b);
    Qt.setClickState("true");
    this.play(a, false);
    Qt.setClickState("false");
    this.highlight(this.playIndex);
    Qt.setPlayIndex(this.playIndex);
    var c = this.modeState.split(",")[0];
    if (c == "dictation") {
      article.initIndex(this.playIndex, "dictation");
    }
    if (c == "fillword") {
      article.initIndex(this.playIndex, "fillword");
    }
  };
  Media.prototype.fullScreenControl = function() {
    var a = this.isFullScreen,
      c = false,
      b = $("#fullScreenPlay").attr("class");
    Qt.setVideoFullscreen("");
  };
  Media.prototype.translateControl = function() {
    var a = this.translateState;
    if (/translateOn/.test(a)) {
      this.translateState = "translateTap,点击显示译文";
      article.setLrc("tap");
      Qt.setTranslationState("tap");
    }
    if (/translateTap/.test(a)) {
      this.translateState = "translateOff,已关闭译文";
      article.setLrc("off");
      Qt.setTranslationState("off");
    }
    if (/translateOff/.test(a)) {
      this.translateState = "translateOn,已打开译文";
      article.setLrc("on");
      Qt.setTranslationState("on");
    }
  };
  Media.prototype.desktopControl = function() {
    var b = this.desktopState,
      a;
    if (/desktopOn/.test(b)) {
      b = "已关闭桌面显示文章段落";
      a = "desktopOff";
    }
    if (/desktopOff/.test(b)) {
      b = "已打开桌面显示文章段落";
      a = "desktopOn";
    }
    this.setDesktopState(a + "," + b);
    Qt.setDesktopState(a);
  };
  Media.prototype.detectDesktopStateSeted = function(a) {
    var b = this.desktopState.split(",")[0];
    if (a) {
      if (!this.desktopStateSeted) {
        this.desktopStateSeted = a;
        if (b == "desktopOn") {
          Qt.setDesktopState(b);
        }
      }
    } else {
      if (this.desktopStateSeted) {
        this.desktopStateSeted = a;
        Qt.setDesktopState("off");
      }
    }
  };
  Media.prototype.setDesktopState = function(b) {
    this.desktopState = b;
    var a = b.split(",")[0],
      c = b.split(",")[1];
    this.$desktopButton.parent().attr("class", a);
    this.$desktopButton.attr("title", c + "，可使用 D 键切换");
    Tools.setLocalStorage("desktopState", this.desktopState);
    Qt.saveData("desktopState", this.desktopState);
  };
  Media.prototype.setTranslationState = function(a) {
    this.translateState = a;
    this.$translateButton.parent().attr("class", this.translateState.split(",")[0]);
    this.$translateButton.attr("title", this.translateState.split(",")[1] + "，可使用 T 键切换");
  };
  Media.prototype.repeatControl = function() {
    this.repeatIndex += 1;
    if (this.repeatIndex == this.repeatStates.length) {
      this.repeatIndex = 0;
    }
    this.repeatState = this.repeatStates[this.repeatIndex];
    Qt.setState("repeat", this.repeatState.split(",")[0]);
    this.$repeatButton.parent().attr("class", this.repeatState.split(",")[0]);
    this.$repeatButton.attr("title", this.repeatState.split(",")[1] + "，可使用 R 键切换");
    Tools.setLocalStorage("repeatState", this.repeatState);
    Qt.saveData("repeatState", this.repeatState);
  };
  Media.prototype.modeControl = function() {
    var a;
    if (/read/.test(this.modeState)) {
      a = "dictation,听写模式";
    }
    if (/dictation/.test(this.modeState)) {
      a = "fillword,测验模式";
    }
    if (/fillword/.test(this.modeState)) {
      a = "read,阅读模式";
    }
    this.modeState = a;
    article.setMode(this.modeState.split(",")[0]);
    Qt.setState("mode", this.modeState.split(",")[0]);
    this.$modeButton.parent().attr("class", this.modeState.split(",")[0]);
    this.$modeButton.attr("title", this.modeState.split(",")[1] + "，可使用 M 键切换");
    Tools.setLocalStorage("modeState", this.modeState);
    Qt.saveData("modeState", this.modeState);
  };
  Media.prototype.pre = function() {
    var b = this.articleIndex,
      c = articleList.getData("data").length,
      a;
    b = b - 1;
    if (b == -1) {
      Qt.showInfo("该文章已是本频道的第一篇文章了");
      return;
    }
    this.cancelPlay();
    a = articleList.getData("data")[b];
    article.setData("index", b);
    article.setData("data", a);
    article.setData("id", a.uuid);
    var d = $("#level3").find("dl").eq(b).find(".sp-title");
    article.init(d);
  };
  Media.prototype.next = function() {
    var b = this.articleIndex,
      c = articleList.getData("data").length,
      a, d;
    b = b + 1;
    this.articleIndex = b;
    if (b == c) {
      Qt.showInfo("该文章已是本频道的最后一篇听力了");
      return;
    }
    this.cancelPlay();
    a = articleList.getData("data")[b];
    d = a.downloadState;
    if (d != "downloaded") {
      this.next();
    } else {
      article.setData("index", b);
      article.setData("data", a);
      article.setData("id", a.uuid);
      var e = $("#level3").find("dl").eq(b).find(".sp-title");
      article.init(e);
    }
  };
  Media.prototype.setBuffering = function(a) {
    a = a + "%";
    this.$buffering.css({
      width: a
    });
  };
  Media.prototype.loadingStart = function() {
    this.$playButton.parent().attr("class", "play");
    this.$loading.text("音频加载中……").show();
  };
  Media.prototype.loadingEnd = function() {
    this.$playButton.parent().attr("class", "pause");
    this.$loading.hide();
  };
  Media.prototype.bufferingStart = function() {
    this.$loading.text("音频缓冲中……").show();
  };
  Media.prototype.bufferingEnd = function() {
    this.$loading.hide();
  };
  Media.prototype.setPlaying = function(a) {
    a = a + "%";
    this.$playing.css({
      width: a
    });
    this.$positionControl.css({
      left: a
    });
  };
  Media.prototype.playEnd = function() {
    switch (this.repeatState.split(",")[0]) {
      case "repeatSen":
        var a = $(".sentence"),
          b = a.eq(a.size() - 1).attr("data-starttime");
        b = this.getTransformTimes(b);
        this.play(b);
        break;
      case "repeat":
        this.next();
        break;
      case "repeated":
        $(".wrap").scrollTop(0);
        this.play(0);
        break;
    }
  };
  Media.prototype.setVolume = function() {
    var a = this.volume,
      b = 100 - a + 10;
    this.$sounds.css({
      height: a,
      top: b
    });
    this.$volumeControl.css({
      top: b - 10
    });
    Qt.setVolume(this.volume);
  };
  Media.prototype.showVideoFrame = function() {
    $("#fullScreenPlay").show();
    $(".playInfo .bufferC").addClass("video");
    var a = document.getElementById("videoFrame");
    a.style.display = "block";
    var b = a.getBoundingClientRect();
    return b.left + "," + b.top + "," + b.width + "," + b.height;
  };
  Media.prototype.hideVideoFrame = function() {
    $("#fullScreenPlay").hide();
    $(".playInfo .bufferC").removeClass("video");
    var a = document.getElementById("videoFrame");
    a.style.display = "none";
  };
  var media = new Media();