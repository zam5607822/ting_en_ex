var userInfo, zipDir = "",
  prepare = "";
var ChannelList = function() {
  var a = this;
  this.id = "";
  this.data = null;
  this.channelData = null;
  this.$container = $("#level2");
  this.$contentContainer = this.$container.find(".navItem");
  this.$itemState = this.$container.find(".itemState");
  this.$contentContainer.delegate("dl", "click", function() {
    a.id = $(this).attr("data");
    var c = a.data[a.id];
    a.channelData = c;
    articleList.setData("id", a.id);
    var b = downloadData.getData("articleData");
    if (b) {
      articleList.init();
    } else {
      prepare = "article";
    }
  });
  this.$contentContainer.delegate(".delete", "click", function(f) {
    f.stopPropagation();
    if (confirm("是否删除该频道下的所有听力文章？")) {
      if (a.$contentContainer.find(".special").length == 1) {
        Qt.gotoOnline();
        WebApi.saveData("downloadState", "no");
      }
      ui.pushMessage("当前听力频道已删除");
      var d = $(this).parent().attr("data"),
        c = downloadData.getData("channelData"),
        b = downloadData.getData("articleData");
      delete c[d];
      downloadData.setData("channelData", c);
      delete b[d];
      downloadData.setData("articleData", b);
      $(this).parent().remove();
      downloadData.deleteChannelData(d);
      Qt.deleteChannelData(d);
    }
  });
};
ChannelList.prototype.setData = function(a, b) {
  this[a] = b;
};
ChannelList.prototype.getData = function(a) {
  return this[a];
};
ChannelList.prototype.init = function() {
  this.reset();
  articleList.reset();
  this.$container.show();
  var f, g, b, c, d;
  var a = downloadData.getData("channelData");
  this.data = a;
  if (a) {
    for (var e in a) {
      f = a[e];
      g = Mapping.convert(f, "title");
      b = Mapping.convert(f, "thumbImg");
      c = b.indexOf("MediaPool");
      b = zipDir + b.substring(c + 10);
      d = Mapping.convert(f, "downloadCount");
      $('<dl class="special" data="' + e + '"><dt class="sp-title">' + g + '</dt><dd class="sp-image"><img src="' + b + '" alt="' + g + '" /></dd><dd class="sp-relative"><span class="spr-times">' + d + '</span><span class="spr-date">' + f.create_time.split("T")[0] + '</span></dd><dd class="delete"></dd></dl>').appendTo(this.$contentContainer);
    }
    this.$itemState.hide();
  }
};
ChannelList.prototype.reset = function() {
  this.$itemState.show();
  this.$contentContainer.text("");
  this.$container.hide();
};
ChannelList.prototype.deleteChannelData = function(a) {
  this.init();
  if (this.$contentContainer.find(".special").length == 0) {
    Qt.gotoOnline();
    WebApi.saveData("downloadState", "no");
  }
  Qt.deleteChannelData(a);
};
var channelList = new ChannelList();
var ArticleList = function() {
  var a = this;
  this.id = "";
  this.data = [];
  this.articleIndex = {};
  this.exportState = false;
  this.$export = $("#export");
  this.$container = $("#level3");
  this.$title = this.$container.find(".sn-titleBar");
  this.articleTitle = "";
  this.$channelInfo = this.$container.find(".channelInfo");
  this.$itemState = this.$container.find(".itemState");
  this.$contentContainer = this.$container.find(".navItem");
  this.$container.click(function() {
    a.resetExport();
  }).delegate("dl", "click", function() {
    if (!$(this).hasClass("downloading")) {
      var c = $(this).index();
      var b = a.data[c];
      article.setData("index", c);
      article.setData("id", b.uuid);
      $(".sp-title.cur").removeClass("cur");
      article.init($(this).find(".sp-title"), b);
    }
  }).delegate("dl", "mousedown", function(b) {
    if (b.which == 3) {
      a.articleTitle = $(this).find(".sp-title").text();
      a.src = zipDir + $(this).attr("data") + ".rar";
      a.exportState = true;
    }
  }).delegate("dl", "mouseup", function(b) {
    if (a.exportState) {
      a.$export.css({
        left: b.clientX + "px",
        top: b.clientY - 80 + "px"
      });
      a.$export.show();
    }
  });
  this.$export.click(function(d) {
    d.stopPropagation();
    if ($(this).hasClass("enable")) {
      a.articleTitle = a.articleTitle.replace(/\//g, "-");
      var c = $(this).index();
      var b = a.data[c];
      if (b.item_type == 4) {
        Qt.saveExportFile(resetZipDir(a.src), a.articleTitle + ".mp4");
      } else {
        Qt.saveExportFile(resetZipDir(a.src), a.articleTitle + ".mp3");
      }
      a.resetExport();
    } else {
      Qt.showInfo("导出文件功能目前仅对终身VIP用户开放");
    }
  });
  this.$container.delegate(".delete", "click", function(k) {
    k.stopPropagation();
    if (confirm("是否删除该篇听力文章？")) {
      var f = "hasContent",
        c = $(this).parent().attr("data");
      a.updateArticleIndex(c);
      var f = a.id,
        b = downloadData.getData("articleData"),
        m = b[f],
        j;
      for (var h = 0, g = m.length; h < g; h++) {
        j = m[h];
        if (j.uuid == c) {
          m.splice(h, 1);
          break;
        }
      }
      b[f] = m;
      downloadData.setData("articleData", b);
      var d = article.getData("id");
      if (d && d == c) {
        article.removeContent();
        Qt.resetMedia();
      }
      if (a.$contentContainer.find(".special").length == 1) {
        f = a.id;
      }
      ui.pushMessage("当前听力文章已删除");
      Qt.deleteArticleData(c, f);
      downloadData.deleteArticleData(c, a.id);
      $(this).parent().remove();
    }
  });
  this.$title.click(function() {
    a.reset();
    channelList.init();
  });
};
ArticleList.prototype.setExportEnable = function(a) {
  this.$export.attr("class", a);
};
ArticleList.prototype.resetExport = function() {
  this.exportState = false;
  this.$export.hide();
};
ArticleList.prototype.setData = function(a, b) {
  this[a] = b;
};
ArticleList.prototype.getData = function(a) {
  return this[a];
};
ArticleList.prototype.init = function() {
  channelList.reset();
  this.reset();
  var d = channelList.getData("channelData");
  if (d == null) {
    var c = downloadData.getData("channelData");
    for (var h in c) {
      if (h == this.id) {
        d = c[h];
        break;
      }
    }
  }
  var o = d.name;
  if (!o) {
    o = d.title;
  }
  this.$title.find("h3").find("span").eq(0).text(o);
  this.$channelInfo.find(".desc").text(d.description);
  this.$channelInfo.find(".spr-times").text(Mapping.convert(d, "downloadCount"));
  this.$channelInfo.find(".spr-date").text(d.create_time.split("T")[0]);
  this.$container.show();
  var j, p, b, m, a, f = this.id,
    g, n, k = downloadData.getData("articleData")[f];
  this.data = k;
  this.articleIndex = [];
  if (k) {
    for (var h = 0, e = k.length; h < e; h++) {
      g = k[h];
      this.articleIndex[a] = h;
      a = g.uuid;
      j = Mapping.convert(g, "thumbImg");
      p = Mapping.convert(g, "createTime");
      b = Mapping.convert(g, "downloadCount");
      m = j.toLowerCase().indexOf("pool/");
      j = zipDir + j.substring(m + 5);
      n = g.downloadState;
      $('<dl class="special ' + n + '" data="' + a + '"><dt class="sp-title">' + g.title + '</dd><dd class="sp-image"><img src="' + j + '" alt="' + g.title + '" /></dd><dd class="sp-relative"><span class="spr-times">' + b + '</span><span class="spr-date">' + p.split("T")[0] + '</span></dd><dd class="delete"></dd></dl>').appendTo(this.$contentContainer);
    }
    this.$itemState.hide();
  }
};
ArticleList.prototype.reset = function() {
  this.$itemState.show();
  this.$contentContainer.text("");
  this.$container.hide();
};
ArticleList.prototype.updateDownloadingProgress = function(a, d) {
  var c = this.articleIndex[d];
  if (c) {
    var b = this.$contentContainer.find("dl");
    b.eq(c).find(".delete").text(a);
  }
};
ArticleList.prototype.setDownloadFinished = function(f) {
  var d = this.articleIndex[f];
  if (d) {
    var b = this.$contentContainer.find("dl").eq(d);
    b.attr("class", "special downloaded");
    b.find(".delete").text("");
  }
  var g = this.id,
    c = downloadData.getData("articleData")[g],
    h;
  if (c) {
    for (var e = 0, a = c.length; e < a; e++) {
      h = c[e];
      if (h.uuid == f) {
        h.downloadState = "downloaded";
        break;
      }
    }
  }
};
ArticleList.prototype.updateArticleIndex = function(c) {
  articleIndex = this.articleIndex;
  var a = articleIndex[c],
    b, d;
  for (b in articleIndex) {
    d = articleIndex[b];
    if (d > a) {
      d = d - 1;
      articleIndex[b] = d;
    }
  }
  delete articleIndex[c];
  this.articleIndex = articleIndex;
};
var articleList = new ArticleList();
var Article = function() {
  this.id = "";
  this.$tempData = $("#tempData");
  this.src = "";
  this.index = 0;
  this.escapeTop = 0;
  this.translationState = Tools.getLocalStorage("translationState");
  this.explainState = Tools.getLocalStorage("explainState");
  this.explain = null;
  this.firstWords = 0;
  this.wordsArr = [];
  this.firstArray = [];
  this.$choised = $(".choised");
  this.choisedIndex = 0;
  this.choisedItem = 9;
  this.$fillwordEscape = [];
  this.choisedState = true;
  this.title = "";
};
Article.prototype.setData = function(a, b) {
  this[a] = b;
};
Article.prototype.getData = function(a) {
  return this[a];
};
Article.prototype.removeContent = function() {
  $(".article .contents, .article .contentInfo").hide();
  $(".article .itemState").show();
};
Article.prototype.init = function(g, e) {
  $(".dictArea").html('<p class="origin"></p><div class="translation"></div>');
  media.detectDesktopStateSeted(true);
  $(".sp-title.cur").removeClass("cur");
  g.addClass("cur");
  this.src = zipDir + this.id + ".rar";
  var i = this,
    j = WebApi.getFileContent(this.id, "article"),
    c = WebApi.getFileContent(this.id, "lrc");
  if (j != "error") {
    var a = j.match(/<body>(\s*.+)*/)[0].replace(/<body>/, "").replace(/<\/body>\s*<\/html>/, "");
    var d = document.createElement("div");
    d.innerHTML = a;
    var f = $(d).find("h1").text();
    this.title = f;
    if ($(d).find(".img-border").length > 0) {
      var h = zipDir + "articleContent/" + $(d).find(".img-border img").attr("src");
      $(d).find(".img-border img").attr("src", "");
      $(".contentInfo img, .playInfo .playContent img").attr("src", h).attr("alt", f);
      $(".contentInfo img, .playInfo .playContent img").show();
      $(".playInfo").removeClass("noImage");
    } else {
      $(".contentInfo img, .playInfo .playContent img").hide();
      $(".playInfo").addClass("noImage");
    }
    $(".contentInfo .title, .playInfo .playContent .title").text(f);
    $(".playInfo .playContent .title").attr("title", f);
    $(".contents .wrap").html($(d).find("#article p")).append($(d).find("input")).append($(d).find(".copyright"));
    $(".article .itemState").hide();
    $(".contentInfo, .contents").show();
    $(".article .playInfo").addClass("noTranslate");
    Qt.saveData("hasTranslation", false);
    media.setTranslationState(this.translationState);
    if (c && c != "error") {
      this.insertLrc(c);
    }
    this.$tempData.html($(".contents .wrap").html());
    $(".wrap").html($(".wrap").html().replace(/<w>/g, "").replace(/<\/w>/g, "").replace(/<d>/g, "").replace(/<\/d>/g, ""));
    this.initHtmlData();
    this.captureWord();
    if (e != null) {
      this.mediaType = e.item_type;
    }
    media.initPlay(this.src, "local", this.mediaType);
    slideNav.slideOut();
    this.prepareSentence();
    var b = media.getData("modeState").split(",")[0];
    this.setMode(b);
    this.choisedState = true;
    this.$choised.unbind("click").bind("click", function(l) {
      var k = $(l.target);
      if (k.hasClass("cword")) {
        i.choisedAction(k);
      }
    });
    this.adjustContentHeight();
  }
};
Article.prototype.adjustContentHeight = function() {
  var b = $(window).height();
  $(".contentContainer2").css({
    height: b
  });
  var a = $("#videoFrame").css("display");
  if (a == "block") {
    $(".contentInfo").css({
      width: "480px"
    });
    $(".playTip").css({
      left: "410px"
    });
    $("#fullScreenPlay").show();
    $(".playInfo .bufferC").addClass("video");
  } else {
    $(".contentInfo").css({
      width: "280px"
    });
    $(".playTip").css({
      left: "170px"
    });
    $("#fullScreenPlay").hide();
    $(".playInfo .bufferC").removeClass("video");
  }
  this.escapeTop = $(".wrap").offset().top;
};
Article.prototype.insertLrc = function(b) {
  b = JSON.parse(b);
  if (b.wordstate == "yes") {
    this.explain = b.words;
    this.setExplain(this.explainState);
  }
  var g = userInfo.isvip,
    a = userInfo.maxRead,
    f = userInfo.isOverRead,
    c = userInfo.readedTime;
  if (!g) {
    this.hideExplain();
    if (!f) {
      if (c <= a) {
        c++;
        userInfo.readedTime = c;
        if (c >= a) {
          f = true;
          userInfo.isOverRead = f;
          userInfo.maxRead = a;
        }
        Tools.setLocalStorage("userInfo", userInfo);
      }
    } else {
      b = "buy";
    }
  }
  if (b != "buy") {
    if ("state" in b) {
      if (b.state == "yes") {
        Qt.saveData("hasTranslation", true);
        $(".article .playInfo").removeClass("noTranslate");
        b = b.list;
        var d = 0;
        $(".paragraph").each(function(h) {
          if (b[d] && b[d]["order"] == h + 1) {
            $('<div class="lrc prev"><p class="chinese" data="' + b[d]["hashvalue"] + '">' + b[d]["text"] + '</p><span class="displayTip" onclick="article.displayTip(this);">点击显示译文</span></div>').insertAfter($(this)[0]);
            d++;
          }
        });
        $(".article").removeClass("hideLrc");
      }
    }
    if ("has_translation" in b) {
      if (b.has_translation && b.translation && b.translation.length > 0) {
        Qt.saveData("hasTranslation", true);
        $(".article .playInfo").removeClass("noTranslate");
        (function e(h) {
          var j = -1,
            k, m, p, q, r, s;
          for (var o = 0, n = h.length; o < n; o++) {
            k = h[o];
            m = k.order;
            m -= 1;
            p = k.timestamp;
            r = k.text;
            q = k.hashvalue;
            if (m != j) {
              if (j != -1) {
                s += '</p><span class="displayTip" onclick="article.displayTip(this);">点击显示译文</span></div>';
                $(s).insertAfter($(".paragraph").eq(m - 1));
              }
              s = '<div class="lrc"><p class="chinese"><span class="segment" id="S_' + p + '" data="' + q + '">' + r + "</span>";
            } else {
              s += '<span class="segment" id="S_' + p + '" data="' + q + '">' + r + "</span>";
            }
            j = m;
          }
          s += '</p><span class="displayTip">点击显示译文</span></div>';
          $(s).insertAfter($(".paragraph").eq(m));
          $(".article").removeClass("hideLrc");
        }(b.translation));
      }
    }
  } else {
    $(".paragraph").each(function() {
      $('<div class="lrc"><p class="chinese" onclick="article.preventVip();">翻译功能已禁用，点击开启VIP权限</p></div>').insertAfter($(this)[0]);
    });
  }
  this.setLrc(this.translationState);
  this.initHtmlData();
};
Article.prototype.initHtmlData = function() {
  var c = $(".contentInfo .title").text(),
    a = '<div class="titleArea"><p class="title">' + c + '</p><p class="specialtitle">' + $(".contentInfo .specialtitle").text() + '</p></div><div class="content">' + $(".wrap").html() + "</div>";
  var b = '<!doctype html><html><head><meta charset="utf-8"><title>' + c + '</title><style type="text/css">html, body, p{margin:0; padding:0;}body{font-size:11pt; padding:30px 50px;}.titleArea, .chinese{font-family: "微软雅黑", "黑体", sans-serif;}.titleArea{margin-bottom:30px;}.title{font-size:12pt;}.content{margin-top:30px;}.specialtitle{font-size:10pt;}.paragraph{margin-top:10px; margin-bottom:5px;}.chinese{font-size:10pt; color:rgb(71, 71, 71); line-height:11pt;}.copyright{margin-top:20px;}#J_CIKU_sentence_time_range, .displayTip{color:transparent;height:0;line-height:0;font-size:0;}</style></head><body>';
  b += a;
  b += "</body></html>";
  Qt.setHtmlPage(b, c);
};
Article.prototype.setLrc = function(a) {
  var b;
  this.translationState = a;
  Tools.setLocalStorage("translationState", a);
  switch (a) {
    case "on":
      $(".article").removeClass("hideLrc");
      $(".article, .translation").removeClass("showTip");
      b = "translateOn,已打开译文";
      break;
    case "tap":
      $(".article").removeClass("hideLrc");
      $(".article, .translation").addClass("showTip");
      b = "translateTap,点击显示译文";
      break;
    case "off":
      $(".article").addClass("hideLrc");
      b = "translateOff,已关闭译文";
      break;
  }
  if (window.media) {
    media.setTranslationState(b);
  }
  Qt.saveData("translateState", b);
};
Article.prototype.setHideDisplayTipIndex = function(a) {
  $(".dictArea .translation").addClass("showTranslation");
  $(".lrc").eq(a).addClass("showTranslation");
};
Article.prototype.hideExplain = function() {
  var a = $(".wrap").html();
  a = a.replace(new RegExp("<span class=(.)transHighlight(.>)(.*?)<\\/span>($|\\s)<span class=(.)trans(.*?)<\\/span>", "g"), function(b, h, g, f, e, d, c) {
    return f + e;
  });
  $(".wrap").html(a);
  this.prepareSentence();
};
Article.prototype.showExplain = function(f) {
  var e = $(".wrap").html(),
    b, d;
  for (var c = 0, a = f.length; c < a; c++) {
    b = f[c]["word"];
    d = f[c]["exp"];
    e = e.replace(new RegExp("(^|\\s)" + b + "($|\\s)", "g"), function(h, i, g) {
      return i + '<span class="transHighlight">' + b + "</span>" + g + '<span class="trans"> (' + d + ") </span>";
    });
  }
  $(".wrap").html(e);
  this.prepareSentence();
};
Article.prototype.setExplain = function(b) {
  this.explainState = b;
  Tools.setLocalStorage("explainState", b);
  this.hideExplain();
  if (!this.explain || !this.explain.length) {} else {
    var a = [];
    if (b == "primary") {
      a = this.explain[0]["items"].concat(this.explain[1]["items"]).concat(this.explain[2]["items"]);
    }
    if (b == "middle") {
      a = this.explain[1]["items"].concat(this.explain[2]["items"]);
    }
    if (b == "senior") {
      a = this.explain[2]["items"];
    }
    this.showExplain(a);
  }
};
Article.prototype.preventVip = function() {
  Qt.openWindow(SoftWare[downloadData.getData("lang")]["purchase"]);
};
Article.prototype.displayTip = function(e) {
  var d = $(e).parent(),
    b = $(e).prev().text(),
    a, c;
  d.addClass("showTranslation");
  if (/translation/.test(d.attr("class"))) {
    a = parseInt(d.attr("index"));
    c = $(".sentence").eq(a).parent().next();
    c.addClass("showTranslation");
    b = b.replace(/'/g, "======").replace(/"/g, ";;;;;;");
    Qt.setParagaraph("chinese", '{"chinese":"' + b + '", "index":' + a + ', "state":true}');
  }
};
Article.prototype.captureWord = function() {
  var h, g, d = false,
    e = 2,
    c = 5;
  var f;
  $(".wrap").bind("mouseout", function() {
    clearTimeout(f);
  });
  $(".wrap").bind("mousemove", function(i) {
    clearTimeout(f);
    h = i.clientX;
    g = i.clientY;
    d = false;
    f = setTimeout(function() {
      b();
    }, 500);
  });

  function a(j) {
    var i = /[^\u4e00-\u9fa5]/.test(j);
    return (!i || j == " ");
  }

  function b() {
    if (d) {
      return;
    }
    var i = document.caretRangeFromPoint(h, g);
    var o = i.startContainer.length;
    if (!i || !i.startContainer.data || (i.startOffset == 0 && i.endOffset == 0) || i.endOffset == o) {
      return;
    }
    d = true;
    var t = i.startOffset;
    var p = i.startOffset - 1;
    var k = i.endOffset;
    var u = cRight = 0;
    var q = "";
    var l = i.startContainer;
    if (l.nodeType == 3) {
      q = l.textContent;
    } else {
      q = l.innerText;
    }
    i.detach();
    for (; p >= 0; p--) {
      if (a(q.substring(p, p + 1))) {
        u++;
      }
      if (u > e) {
        break;
      }
    }
    for (; k <= o; k++) {
      if (a(q.substring(k - 1, k))) {
        cRight++;
      }
      if (cRight > c) {
        break;
      }
    }
    var s = q.substring(p, k);
    var m = (t - p - 2);
    if ((m + 3) < s.length) {
      var n = 32071 + SoftWare[downloadData.getData("lang")]["productid"];
      var j = "http://127.0.0.1:" + n + "/eudic_capture_word?word=" + s + "&curpos=" + m + "&src=ting_desktop";
      Qt.captureWord(j);
    }
  }
};
var browser = function() {
    // Return cached result if avalible, else get result then cache it.
    if (browser.prototype._cachedResult)
        return browser.prototype._cachedResult;

    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    return browser.prototype._cachedResult =
        isOpera ? 'Opera' :
        isFirefox ? 'Firefox' :
        isSafari ? 'Safari' :
        isChrome ? 'Chrome' :
        isIE ? 'IE' :
        isEdge ? 'Edge' :
        isBlink ? 'Blink' :
        "Don't know";
};

Article.prototype.prepareSentence = function() {
  var a = this;
  $(".sentence").hover(function(b) {
    if (window.event.ctrlKey){
      $(this).css({
        cursor:'pointer'
      });
    }
    if (!$(this).hasClass("high_light")) {
      $(".playTip").css({
        top: $(this).offset()["top"] - 122
      }).show();
    }
  }, function() {
    $(".playTip").hide();
    $(this).css({
        cursor:'text'
      });
  }).click(function() {
  is_ctrl_down = window.event.ctrlKey
  if(is_ctrl_down){
    var c = media.getData("repeatState").split(",")[0];
    var e = $(this).attr("id").split("_")[1],
      d = media.getTransformTimes(e);
    Qt.setLoadPositionState("true");
    Qt.setClickState("true");
    media.play(d, false);
    Qt.setClickState("false");
    a.highlight($(this));
    var b = $(".sentence").index($(".high_light"));
    media.setData("playIndex", b);
    Qt.setPlayIndex(b);
  } else {
    s = window.getSelection();
    var range = s.getRangeAt(0);
    var node = s.anchorNode;
    data_str = range.commonAncestorContainer.data;
    const re_isalpha = /^[a-zA-Z']$/
    while (re_isalpha.test(data_str.charAt(range.startOffset))) {
    range.setStart(node, (range.startOffset - 1));
    }
    range.setStart(node, range.startOffset + 1);
   
    while (re_isalpha.test(data_str.charAt(range.endOffset)))
    {
    range.setEnd(node, range.endOffset + 1);
    }
    s.removeAllRanges();
    s.addRange(range);
  }
  });
};
Article.prototype.highlight = function(d) {
  if (d) {
    var e;
    if (typeof(d) == "string") {
      e = document.getElementById("J_" + d);
    } else {
      e = d[0];
    }
    var g = $(e).html(),
      c = $(e).parent().next(),
      f = c.find(".chinese").text();
    if (g == null) {
      return;
    }
    g = g.replace(/'/g, "======").replace(/"/g, ";;;;;;");
    var a = false,
      h = $(".lrc").index(c);
    if (c.hasClass("showTranslation")) {
      a = true;
    }
    Qt.setParagaraph("sentence", g);
    f = f.replace(/'/g, "======").replace(/"/g, ";;;;;;");
    Qt.setParagaraph("chinese", '{"chinese":"' + f + '","index":' + h + ',"state":' + a + "}");
    var b = $(".high_light");
    if (b) {
      b.removeClass("high_light");
    }
    e.className = e.className + " high_light";
    var i = $(".wrap").scrollTop();
    if ($(e).offset()["top"] + $(e).height() - this.escapeTop > $(".wrap").height() || $(e).offset()["top"] - this.escapeTop < 0) {
      $(".wrap").scrollTop(i + $(e).offset()["top"] - this.escapeTop);
    }
  }
};
Article.prototype.setMode = function(c) {
  var b, e, d, a = $(".sentence").index($(".high_light"));
  if (a < 0) {
    a = 0;
  }
  switch (c) {
    case "read":
      b = "block";
      e = "none";
      d = "none";
      break;
    case "dictation":
      e = "block";
      b = "none";
      d = "none";
      this.initIndex(a, "dictation");
      Qt.setDictationIndex(a);
      break;
    case "fillword":
      d = "block";
      b = "none";
      e = "none";
      this.initIndex(a, "fillword");
      Qt.setFillwordIndex(a);
      break;
  }
  $(".wrap").css("display", b);
  $(".dictArea").css("display", e);
  $(".fillwordArea").css("display", d);
};
Article.prototype.initDictation = function(a) {
  this.initIndex(a, "dictation");
};
Article.prototype.initIndex = function(g, i) {
  var f, e;
  switch (i) {
    case "dictation":
      f = $(".dictArea .origin");
      e = $(".dictArea .translation");
      break;
    case "fillword":
      media.setFillwordState(false);
      f = $(".fillwordArea .origin");
      e = $(".fillwordArea .translation");
      break;
  }
  var b = this.$tempData.find(".sentence"),
    d = b.eq(g),
    h = d.parent().next();
  if (!h.hasClass("prev")) {
    var k = d.attr("data-starttime"),
      j = d.html().replace(new RegExp("<span class=(.)transHighlight(.>)(.*?)<\\/span>($|\\s)<span class=(.)trans(.*?)<\\/span>", "g"), function(l, s, r, q, p, o, n) {
        return q + p;
      }),
      c = $(document.getElementById("S_" + k)).html();
    if (!c) {
      c = "";
    }
    f.html(j);
    if (!/翻译功能已禁用/.test(c)) {
      var a = false;
      e.html('<span class="chinese">' + c + '</span><span class="displayTip" onclick="article.displayTip(this);">点击显示译文</span>');
      if (d.parent().next().hasClass("showTranslation")) {
        e.attr("class", "translation showTranslation");
        a = true;
      } else {
        e.attr("class", "translation");
      }
      e.attr("starttime", k);
      Qt.setParagaraph("trans", '{"chinese":"' + c + '","state":' + a + ',"index":' + g + "}");
    }
  } else {
    j = d.html().replace(new RegExp("<span class=(.)transHighlight(.>)(.*?)<\\/span>($|\\s)<span class=(.)trans(.*?)<\\/span>", "g"), function(l, s, r, q, p, o, n) {
      return q + p;
    }), trans = h.html(), c = h.find(".chinese").text(), $dictArea = $(".dictArea .translation, .fillwordArea .translation");
    if (!c) {
      c = "";
    }
    $(".dictArea .origin, .fillwordArea .origin").html(j);
    if (h.hasClass("lrc") && trans && !/翻译功能已禁用/.test(trans)) {
      var a;
      $dictArea.html(trans);
      if (/showTranslation/.test(h.attr("class"))) {
        $dictArea.attr("class", "translation showTranslation");
        a = true;
      } else {
        $dictArea.attr("class", "translation");
        a = false;
      }
      $dictArea.attr("index", g);
      Qt.setParagaraph("dictTrans", '{"chinese":"' + c + '","state":' + a + ',"index":' + g + "}");
    }
  }
  switch (i) {
    case "dictation":
      this.setPlayTimes(g, 0);
      break;
    case "fillword":
      this.setFillword();
      break;
  }
};
Article.prototype.setPlayTimes = function(k, b) {
  var c = $(".dictArea .origin").find($("w")),
    m = c.size(),
    r = parseInt(m / 3 * 2),
    h = [],
    p = [],
    n = true,
    a, q, j, e;
  for (var g = 0; g < m; g++) {
    a = c.eq(g).text();
    h.push(g);
    if (a.length > 5) {
      p.push(g);
    }
  }
  if (p.length < r) {
    n = false;
  }
  if (n) {
    m = p.length;
  }
  b = parseInt(b);
  switch (b) {
    case 0:
      q = parseInt(m * 0.3);
      if (q < 1) {
        q = 1;
      }
      this.firstWords = q;
      this.wordsArr = n ? p : h;
      for (var g = 0; g < q; g++) {
        j = Math.round(Math.random() * m);
        e = n ? c.eq(p[j]) : c.eq(j);
        e.addClass("fill");
        this.firstArray.push(j);
        this.wordsArr.splice(j, 1);
      }
      break;
    case 1:
      q = parseInt(m * 0.7);
      if (q < 2) {
        if (q < 1) {
          q = 1;
        } else {
          q = 2;
        }
      }
      if (q >= this.firstWords) {
        q = q - this.firstWords;
      }
      var o = m - this.firstWords;
      for (var g = 0; g < q; g++) {
        j = Math.round(Math.random() * o);
        if (n) {
          c.eq(this.wordsArr[j]).addClass("fill");
        } else {
          c.eq(j).addClass("fill");
        }
      }
      for (var g = 0, d = this.firstArray.length; g < d; g++) {
        c.eq(this.firstArray[g], "fill");
      }
      break;
    case 2:
    default:
      for (var g = 0, d = c.length; g < d; g++) {
        c.eq(g).addClass("fill");
      }
      break;
  }
  var f = $(".origin").html();
  f = f.replace(/'/g, "======").replace(/"/g, ";;;;;;");
  Qt.setParagaraph("dictation", f);
};
Article.prototype.setFillword = function() {
  var f = {},
    d = $(".fillwordArea .origin w");
  this.choisedIndex = 0;
  d.attr("class", "fill");
  var h = d.length,
    j = 9,
    a = "",
    g, e;
  if (h < 9) {
    j = h;
  }
  this.choisedItem = j;
  for (var c = 0; c < j; c++) {
    do {
      g = parseInt(Math.random() * h);
    } while (f["index" + g] == "added");
    f["index" + g] = "added";
  }
  for (var b in f) {
    g = b.replace(/index/, "");
    a += '<span class="cword">' + d.eq(g).html() + "</span>";
    e = d.eq(g);
    e.removeClass("fill").addClass("escape");
  }
  Qt.setParagaraph("fillword", '{"text":"' + $(".fillwordArea .origin").html().replace(/'/g, "======").replace(/"/g, ";;;;;;") + '", "item":' + this.choisedItem + "}");
  this.$fillwordEscape = $(".escape");
  this.$choised.html(a);
  Qt.setParagaraph("choised", a);
};
Article.prototype.choisedAction = function(c) {
  var d = c.text(),
    b = this.$fillwordEscape.eq(0),
    a = b.text();
  if (d == a) {
    if (this.choisedState) {
      b.addClass("correct");
    } else {
      b.addClass("error");
      this.choisedState = true;
    }
    b.addClass("fill").removeClass("escape");
    this.$fillwordEscape = $(".escape");
    this.choisedIndex++;
    if (this.choisedIndex == this.choisedItem) {
      b.addClass("correct");
      setTimeout(function() {
        Qt.fillwordSuccessAction();
      }, 1000);
    }
  } else {
    this.choisedState = false;
    c.addClass("animError");
    setTimeout(function() {
      c.removeClass("animError");
    }, 500);
  }
};
Article.prototype.paragraphFillwordSuccess = function() {
  Qt.fillwordSuccessAction();
};
var article = new Article();
var DownloadData = function() {
  this.articleData = {};
  this.channelData = {};
  this.ratioData = {};
  this.lang = "";
};
DownloadData.prototype.appendData = function(b, e, d) {
  e = e.replace(/@@@@@/g, "'");
  e = JSON.parse(e);
  if (b == "articleData") {
    e.downloadState = d;
    var a = this.articleData,
      c = e.channel_id;
    if (!c) {
      c = e.parent_uuid;
    }
    if (!a[c]) {
      a[c] = [];
    }
    a[c] = a[c].concat(e);
    this.articleData = a;
  }
  if (b == "channelData") {
    var c = Mapping.convert(e, "channelId");
    this.channelData[c] = e;
  }
};
DownloadData.prototype.getData = function(a) {
  return this[a];
};
DownloadData.prototype.setData = function(a, b) {
  this[a] = b;
};
DownloadData.prototype.deleteArticleData = function(b, e) {
  var h = this.articleData,
    a = h[e],
    j, g = -1;
  if (a.length == 0) {
    var c = this.channelData;
    delete c[e];
    this.channelData = c;
    delete h[e];
    this.articleData = h;
    channelList.deleteChannelData(e);
  } else {
    for (var f = 0, d = a.length; f < d; f++) {
      j = a[f];
      if (j.uuid == b) {
        g = f;
        break;
      }
    }
    if (g > 0) {
      a.splice(g, 1);
      h[e] = a;
      this.articleData = h;
    }
  }
};
DownloadData.prototype.deleteChannelData = function(c) {
  var b = this["channelData"];
  delete b[c];
  this.channelData = b;
  var a = this["articleData"];
  delete a[c];
  this.articleData = a;
};
DownloadData.prototype.getDataFinished = function(a) {
  if (a == "article" && prepare == "article") {
    articleList.init();
  }
  if (a == "channel" && prepare == "channel") {
    channelList.init();
  }
};
DownloadData.prototype.downloadProgress = function(f, i, h, a) {
  var j, g = parseInt(f / i * 100);
  switch (h) {
    case "lrc":
    case "archive":
      if (g >= 100) {
        g = 30;
      } else {
        g = parseInt(g / 3);
      }
      break;
    case "mp3":
      if (g >= 100) {
        g = 40;
      } else {
        g = parseInt(g / 4);
      }
      break;
  }
  var c = this.ratioData[a];
  if (!c) {
    c = {
      lrc: 0,
      archive: 0,
      mp3: 0
    };
  }
  c[h] = g;
  var b = c.mp3,
    e = c.lrc,
    d = c.archive;
  this.ratioData[a] = c;
  j = b + e + d;
  if (j > 100) {
    j = 100;
  }
  j = j + "%";
  articleList.updateDownloadingProgress(j, a);
};
DownloadData.prototype.downloadFinished = function(a) {
  articleList.setDownloadFinished(a);
};
var downloadData = new DownloadData();
(function init() {
  slideNav.In();

  function j() {
    var k = parseInt($(".sideNav").css("height")) - 150,
      i = 200 + $(".channelInfo").height(),
      m = parseInt($(".sideNav").css("height")) - i,
      l = parseInt($(".playPage").css("margin-right")) - 3;
    $("#level2 .navItem, #myChannel .navItem").css({
      height: k
    });
    $("#level3 .navItem").css({
      height: m
    });
    $(".rightSide").css({
      "margin-right": l
    });
  }
  j();
  $(window).bind("resize", function() {
    j();
  });
  var d = "",
    a = "",
    c = "";
  var h = window.location.href.split("?")[1].split("&");
  var f;
  for (var g = 0, e = h.length; g < e; g++) {
    f = h[g].split("=");
    switch (f[0]) {
      case "lang":
        c = f[1];
        break;
      case "channelId":
        d = f[1];
        break;
      case "articleId":
        a = f[1];
        break;
    }
  }
  var b;
  switch (c) {
    case "en":
    case "betaen":
    case "local":
      c = "en";
      b = "每日英语听力";
      break;
    case "fr":
    case "betafr":
      c = "fr";
      b = "每日法语听力";
      break;
    case "de":
    case "betade":
      b = "每日德语听力";
      break;
    case "es":
    case "betaes":
      b = "每日西语听力";
      break;
  }
  $(".logo a").text(b);
  $("body").attr("id", c);
  downloadData.setData("lang", c);
  if (!d && !a) {
    prepare = "channel";
  }
  if (d && a) {
    prepare = "article";
    articleList.setData("id", d);
    article.setData("id", a);
  }
  Qt.pageLoaded();
  $(".gotoOnline").click(function() {
    Qt.gotoOnline();
    WebApi.saveData("downloadState", "yes");
  });
}());

function setSet(b, f, e, g, d, a, c) {
  $("body").attr("class", b + " " + f);
  $("body").attr("class", b + " " + f);
  $(".wrap").css({
    "text-align": c,
    "font-family": a
  });
  if (window.article) {
    article.setLrc(e);
    article.setExplain(g);
  } else {
    Tools.setLocalStorage("translationState", e);
    Tools.setLocalStorage("explainState", g);
  }
  switch (d) {
    case "highlight":
      if (!$(".article").hasClass("transHighlightSet")) {
        $(".article").addClass("transHighlightSet");
      }
      break;
    case "explain":
      $(".article").removeClass("transHighlightSet");
      break;
  }
}

function setData(a, b) {
  if (a == "userInfo") {
    userInfo = JSON.parse(b);
    if (userInfo.lifelong) {
      articleList.setExportEnable("enable");
    } else {
      articleList.setExportEnable("disable");
    }
  }
}

function setZipDir(a) {
  zipDir = "file:///" + a + "/";
}

function resetZipDir(a) {
  a = a.replace(/file:\/\/\//, "");
  return a;
}