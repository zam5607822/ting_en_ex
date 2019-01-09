var Mapping = {
    isVisible: ["visible"],
    channelType: ["channel_type", "purchase_type"],
    parentUuid: ["cateid", "parent_uuid"],
    mediaType: ["media_type", "item_type"],
    title: ["name", "title"],
    channelId: ["channel_id", "uuid"],
    articleCount: ["article_count", "child_count"],
    description: ["description", "excerpt"],
    thumbImg: ["thumbnail_url", "image_url_thumbnail"],
    downloadCount: ["downloads_count", "download_count"],
    createTime: ["create_time", "res_create_time"],
    updateTime: ["res_update_time", "update_time"],
    convert: function(g, b) {
      switch (b) {
        case "mediaType":
          var f;
          if ("item_type" in g) {
            f = "item" + g.item_type;
          } else {
            if ("media_type" in g) {
              f = "media" + g.media_type;
            }
          }
          return f;
          break;
        case "isVisible":
          return true;
        default:
          var e = this[b],
            d = 2,
            c;
          for (var a = 0; a < d; a++) {
            c = e[a];
            if (c in g) {
              if (g[c] == null) {
                return "";
              } else {
                return g[c].toString();
              }
            }
          }
          break;
      }
    }
  };
  var UI = function() {
    this.$pushContainer = null;
    this.initPush();
  };
  UI.prototype.initPush = function() {
    var b = document.createElement("div");
    b.className = "pushContainer";
    b.innerHTML = '<p class="pushMsg"></p>';
    var a = $(b);
    $(".sideNav").append(a);
    this.$pushContainer = a;
  };
  UI.prototype.pushMessage = function(b) {
    var a = this;
    this.$pushContainer.find(".pushMsg").text(b).fadeIn();
    setTimeout(function() {
      a.$pushContainer.find(".pushMsg").fadeOut();
    }, 600);
  };
  var ui = new UI();
  var Qt = {
    openWindow: function(a) {
      WebApi.openBrowser(a);
    },
    showInfo: function(a) {
      WebApi.showInfo(a);
    },
    captureWord: function(a) {
      WebApi.captureWord(a);
    },
    saveData: function(a, b) {
      WebApi.saveData(a, b);
    },
    pageLoaded: function() {
      WebApi.pageLoaded("");
      WebApi.getZipDir();
    },
    downloadArticle: function(a) {
      WebApi.downloadArticle(a);
    },
    downloadChannel: function(a) {
      WebApi.downloadChannel(a);
    },
    updateArticleData: function(b, a) {
      WebApi.updateArticleData(b, a);
    },
    deleteArticleData: function(a, b) {
      WebApi.deleteArticleData(a, b);
    },
    deleteChannelData: function(a) {
      WebApi.deleteChannelData(a);
    },
    gotoOnline: function() {
      WebApi.cancelPlay();
      WebApi.gotoOnline();
      WebApi.setPrintAble(false);
    },
    setHtmlPage: function(b, a) {
      WebApi.setHtmlPage(b, a);
    },
    setParagaraph: function(a, b) {
      WebApi.setParagaraph(a, b);
    },
    setPrintAble: function(a) {
      WebApi.setPrintAble(a);
    },
    resetMedia: function() {
      WebApi.resetMedia();
    },
    initPlay: function(d, c, b, a) {
      WebApi.initPlay(d, c, b, a);
    },
    play: function(a) {
      WebApi.play(a);
    },
    pause: function() {
      WebApi.pause();
    },
    setClickState: function(a) {
      WebApi.setClickState(a);
    },
    setVolume: function(a) {
      WebApi.setVolume(a);
    },
    cancelPlay: function() {
      WebApi.cancelPlay();
    },
    loadPosition: function(a) {
      WebApi.loadPosition(a);
    },
    setState: function(b, a) {
      WebApi.setState(b, a);
    },
    setLoadPositionState: function(a) {
      WebApi.setLoadPositionState(a);
    },
    setDictationIndex: function(a) {
      WebApi.setDictationIndex(a);
    },
    setDictationIndex: function(a) {
      WebApi.setDictationIndex(a);
    },
    setFillwordIndex: function(a) {
      WebApi.setFillwordIndex(a);
    },
    fillwordSuccessAction: function() {
      WebApi.fillwordSuccessAction();
    },
    setPlayIndex: function(a) {
      WebApi.setPlayIndex(a);
    },
    setTranslationState: function(a) {
      WebApi.setTranslationState(a);
    },
    setVideoFullscreen: function(a) {
      WebApi.setVideoFullscreen(a);
    },
    setDesktopState: function(a) {
      WebApi.setDesktopState(a);
    },
    raiseVideoFrame: function() {
      WebApi.raiseVideoFrame();
    },
    lowerVideoFrame: function() {
      WebApi.lowerVideoFrame();
    },
    saveExportFile: function(a, b) {
      WebApi.saveExportFile(a, b);
    }
  };
  var Tools = {
    getLocalStorage: function(b) {
      var a = JSON.parse(window.localStorage.getItem("listen"));
      if (!a) {
        return null;
      } else {
        return a[b];
      }
    },
    setLocalStorage: function(b, c) {
      var a;
      if (window.localStorage.getItem("listen")) {
        a = JSON.parse(window.localStorage.getItem("listen"));
      } else {
        a = {};
      }
      a[b] = c;
      window.localStorage.setItem("listen", JSON.stringify(a));
    },
    removeLocalStorage: function(b) {
      var a = JSON.parse(window.localStorage.getItem("listen"));
      a[b] = "";
      window.localStorage.setItem("listen", JSON.stringify[a]);
    },
    setCookie: function(c, f) {
      var b = new Date(),
        e = "";
      b.setTime(b.getTime() + 24 * 60 * 60 * 365 * 50000);
      for (var d = 0, a = c.length; d < a; d++) {
        e = e + c[d] + "=" + f[d] + ";";
      }
      document.cookie = e + "expires=" + b.toGMTString();
    },
    getCookie: function(b) {
      var d = document.cookie.split(";"),
        a = d.length,
        e;
      for (var c = 0; c < a; c++) {
        e = d[c].split("=")[0].replace(/\s*/, "");
        if (b == e) {
          return d[c].split("=")[1];
          break;
        }
      }
    }
  };
  var SoftWare = {
    fr: {
      name: "法语助手",
      url: "http://frdic.com/ting",
      purchase: "http://ting.frdic.com/ting/purchase",
      productid: 1
    },
    de: {
      name: "德语助手",
      url: "http://www.godic.net/ting",
      purchase: "http://www.godic.net/ting/purchase",
      productid: 9
    },
    es: {
      name: "西语助手",
      url: "http://www.esdict.cn/ting",
      purchase: "http://www.esdict.cn/ting/purchase",
      productid: 31
    },
    en: {
      name: "欧路词典",
      url: "http://dict.eudic.net/ting",
      purchase: "http://dict.eudic.net/ting/purchase",
      productid: 23
    }
  };
  var SlideNav = function() {
    var a = this;
    this.$slideControl = $("#slideControl");
    $("#sideBar").click(function(b) {
      if ($(b.target).attr("id") == "sideBar") {
        a.slideOut();
      }
    });
    $(".sideNav").click(function(b) {
      if ($(b.target).attr("class") == "sideNav") {
        a.slideOut();
      }
    });
    $(".slideWidget").click(function() {
      switch ($(".slideWidget #slideControl").attr("class")) {
        case "slideOut":
          a.slideIn();
          break;
        case "slideIn":
          a.slideOut();
          break;
      }
    });
  };
  SlideNav.prototype.slideIn = function() {
    if ($("#slideControl").hasClass("slideOut")) {
      Qt.lowerVideoFrame();
      $(".sideNav").css({
        "margin-left": "320px"
      });
      this.$slideControl.attr("class", "slideIn");
      $("#sideBar").fadeIn();
    }
    this.slideState = "in";
  };
  SlideNav.prototype.slideOut = function() {
    if ($("#slideControl").hasClass("slideIn")) {
      $("#sideBar").fadeOut();
      $(".sideNav").css({
        "margin-left": "0"
      });
      this.$slideControl.attr("class", "slideOut");
      setTimeout(function() {
        Qt.raiseVideoFrame();
      }, 400);
    }
    this.slideState = "out";
  };
  SlideNav.prototype.In = function() {
    this.$slideControl.attr("class", "slideIn");
    $(".sideNav").css({
      "margin-left": "320px"
    });
    $("#sideBar").show();
  };
  var slideNav = new SlideNav();
  
  function setData(a, b) {
    Tools.setLocalStorage(a, b);
  }