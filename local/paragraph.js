var Tools = {
    getLocalStorage: function(b) {
      var a = window.localStorage.getItem('listen')
      if (a) {
        a = JSON.parse(a);
        return a[b];
      } else {
        return null;
      }
    },
    setLocalStorage: function(b, c) {
      var a
      if (window.localStorage.getItem('listen')) {
        a = JSON.parse(window.localStorage.getItem('listen'));
      } else {
        a = {};
      }
      a[b] = c;
      window.localStorage.setItem('listen', JSON.stringify(a));
    },
    removeLocalStorage: function(b) {
      var a = JSON.parse(window.localStorage.getItem('listen'))
      a[b] = '';
      window.localStorage.setItem('listen', JSON.stringify(a));
    }
  }
  var SoftWare = {
    fr: {
      productid: 1
    },
    de: {
      productid: 9
    },
    es: {
      productid: 31
    },
    en: {
      productid: 23
    }
  }
  var Qt = {
    queryState: function(a) {
      ParagraphApi.queryState(a);
    },
    paraSetState: function(a, b) {
      ParagraphApi.paraSetState(a, b);
    },
    setHideDisplayTipIndex: function(a) {
      ParagraphApi.setHideDisplayTipIndex(a);
    },
    setDragState: function(a) {
      ParagraphApi.setDragState(a);
    },
    captureWord: function(a) {
      ParagraphApi.captureWord(a);
    },
    fillwordSuccessAction: function() {
      ParagraphApi.paragraphFillwordSuccess();
    }
  }
  var Paragraph = function(e, c, d, b, a) {
    this.lang = '';
    this.$container = e;
    this.$control = c;
    this.$displayTip = e.find('.displayTip');
    this.$content = e.find('#content');
    this.$pre = e.find('#pre');
    this.$playControl = e.find($('#playControl'));
    this.$next = e.find('#next');
    this.$transControl = e.find($('#transControl'));
    this.$repeatControl = e.find($('#repeatControl'));
    this.$modeControl = e.find($('#modeControl'));
    this.$desktopControl = e.find($('#desktopControl'));
    this.explainTipState = Tools.getLocalStorage('explainTipState');
    this.translateState = Tools.getLocalStorage('translateState');
    this.repeatState = Tools.getLocalStorage('repeatState');
    this.modeState = Tools.getLocalStorage('modeState');
    this.desktopState = Tools.getLocalStorage('desktopState');
    this.$paragraph = d;
    this.$translation = b;
    this.$dictation = a;
    this.choisedIndex = 0;
    this.choisedItem = 9;
    this.choisedState = false;
    this.$fillwordEscape = [];
    this.$choised = e.find('#choised');
    this.defaultParagraph = '暂无文章';
    this.defaultTranslation = '{"chinese":"暂无译文","index":0,"state":false}';
    this.dragTimeout = '';
    this.dragState = false;
    this.init();
    this.captureWord();
  }
  Paragraph.prototype.setLang = function(a) {
    this.lang = a;
  };
  Paragraph.prototype.captureWord = function() {
    var b, a, c = false,
      d = 2,
      e = 5
    var h, i = this
    $('#paragraph').bind('mouseout', function() {
      clearTimeout(h);
    });
    $('#paragraph').bind('mousemove', function(j) {
      clearTimeout(h);
      b = j.clientX;
      a = j.clientY;
      c = false;
      h = setTimeout(function() {
        g();
      }, 500);
    });
  
    function f(k) {
      var j = /[^\u4e00-\u9fa5]/.test(k)
      return (!j || k == ' ');
    }
  
    function g() {
      if (c) {
        return;
      }
      var j = document.caretRangeFromPoint(b, a)
      if (!j || !j.startContainer.data || (j.startOffset == 0 && j.endOffset == 0) || j.endOffset == p) {
        return;
      }
      var p = j.startContainer.length
      c = true;
      var u = j.startOffset
      var q = j.startOffset - 1
      var l = j.endOffset
      var v = cRight = 0
      var s = ''
      var m = j.startContainer
      if (m.nodeType == 3) {
        s = m.textContent;
      } else {
        s = m.innerText;
      }
      j.detach();
      for (; q >= 0; q--) {
        if (f(s.substring(q, q + 1))) {
          v++;
        }
        if (v > d) {
          break;
        }
      }
      for (; l <= p; l++) {
        if (f(s.substring(l - 1, l))) {
          cRight++;
        }
        if (cRight > e) {
          break;
        }
      }
      var t = s.substring(q, l)
      var n = (u - q - 2)
      if ((n + 3) < t.length) {
        var o = 32071 + SoftWare[i.lang]['productid']
        t = encodeURIComponent(t);
        var k = 'http://127.0.0.1:' + o + '/eudic_capture_word?word=' + t + '&curpos=' + n + '&src=ting_desktop'
        Qt.captureWord(k);
      }
    }
  };
  Paragraph.prototype.init = function() {
    var a = this
    if (!this.explainTipState) {
      Qt.queryState('explainTipState');
    }
    if (!this.translateState) {
      Qt.queryState('translateState');
    }
    if (!this.repeatState) {
      Qt.queryState('repeatState');
    }
    if (!this.modeState) {
      Qt.queryState('modeState');
    }
    if (!this.desktopState) {
      Qt.queryState('desktopState');
    }
    this.setModeState();
    this.$displayTip.click(function() {
      var b = $(this).parent().attr('index')
      a.$translation.addClass('showTrans');
      Qt.setHideDisplayTipIndex(b);
    });
    this.$pre.click(function() {
      a.$playControl.find('a').attr('class', 'play');
      Qt.paraSetState('play', 'pre');
    });
    this.$playControl.click(function() {
        return ;
      var b;
      switch ($(this).find('a').attr('class')) {
        case 'play':
          b = 'pause'
          break;
        case 'pause':
          b = 'play'
          break;
      }
      $(this).find('a').attr('class', b);
      Qt.paraSetState('play', b);
    });
    this.$next.click(function() {
      a.$playControl.find('a').attr('class', 'play');
      Qt.paraSetState('play', 'next');
    });
    this.$transControl.click(function() {
      Qt.paraSetState('translateState', '');
    });
    this.$repeatControl.click(function() {
      Qt.paraSetState('repeatState', '');
    });
    this.$modeControl.click(function() {
      Qt.paraSetState('modeState', '');
    });
    this.$desktopControl.click(function() {
      Qt.paraSetState('desktopState', '');
    });
    this.dragAction();
    this.setParagraph(this.defaultParagraph);
    this.setDictTrans(this.defaultTranslation);
    this.$choised.click(function(c) {
      var b = $(c.target)
      if (b.hasClass('cword')) {
        a.choisedAction(b);
      }
    });
  };
  Paragraph.prototype.dragAction = function() {
    var a = this,
      b
    this.$container.bind('mouseover', function() {
      $(this).addClass('hover');
      a.$control.css({
        visibility: 'visible'
      });
    }).bind('mouseout', function(c) {
      b = c.toElement;
      if (!b || b.nodeName.toLowerCase() == 'body') {
        $(this).removeClass('hover');
        a.$control.css({
          visibility: 'hidden'
        });
      }
    }).bind('mouseup', function() {
      a.dragState = false;
      $('body').removeClass('notSelect');
    });
    this.$paragraph.bind('mousedown', function() {
      a.dragState = true;
      $('body').addClass('notSelect');
      a.$control.css({
        visibility: 'hidden'
      });
      Qt.setDragState('start');
    });
  };
  Paragraph.prototype.saveState = function(a, b) {
    switch (a) {
      case 'hasTranslation':
        if (b == 'true') {
          $('body').removeClass('noTrans');
        }
        if (b == 'false') {
          $('body').addClass('noTrans');
        }
        break;
      case 'explainTipState':
        this.explainTipState = b;
        Tools.setLocalStorage('explainState', this.explainTipState);
        this.setExplainTipState()
        break;
      case 'translateState':
        this.translateState = b;
        Tools.setLocalStorage('translateState', this.translateState);
        this.setTranslateState()
        break;
      case 'repeatState':
        this.repeatState = b;
        Tools.setLocalStorage('repeatState', this.repeatState);
        this.setRepeatState()
        break;
      case 'modeState':
        this.modeState = b;
        Tools.setLocalStorage('modeState', this.modeState);
        this.setModeState()
        break;
      case 'desktopState':
        this.desktopState = b;
        Tools.setLocalStorage('desktopState', this.desktopState);
        this.setDesktopState()
        break;
    }
  };
  Paragraph.prototype.setParagraph = function(a) {
    a = a.replace(/======/g, "'").replace(/;;;;;;/g, '"');
    this.$paragraph.html(a);
  };
  Paragraph.prototype.setDictTrans = function(a) {
    a = JSON.parse(a);
    var b = a.chinese
    b = b.replace(/======/g, "'").replace(/;;;;;;/g, '"');
    this.$translation.find('.chinese').text(b);
    if (a.state) {
      this.$translation.attr('class', 'showTrans');
    } else {
      this.$translation.attr('class', '');
    }
    this.$translation.attr('index', a.index);
  };
  Paragraph.prototype.setChoised = function(a) {
    this.$choised.html(a);
  };
  Paragraph.prototype.setFillword = function(a) {
    a = JSON.parse(a);
    this.$paragraph.html(a.text.replace(/======/g, "'").replace(/;;;;;;/g, '"'));
    this.choisedItem = a.item;
    this.choisedIndex = 0;
    this.choisedState = true;
    this.$fillwordEscape = this.$paragraph.find('.escape');
  };
  Paragraph.prototype.setPlayState = function(a) {
    if (a == 'play') {
      this.$playControl.find('a').attr('class', 'play');
    }
    if (a == 'pause') {
      this.$playControl.find('a').attr('class', 'pause');
    }
  };
  Paragraph.prototype.setExplainTipState = function() {
    var a = this.explainTipState
    switch (a) {
      case 'highlight':
        $('body').addClass('transHighlightSet')
        break;
      case 'explain':
        $('body').removeClass('transHighlightSet')
        break;
    }
  };
  Paragraph.prototype.setTranslateState = function() {
    var a = this.translateState.split(',')[0]
    this.$transControl.find('a').attr('class', a);
    switch (a) {
      case 'translateOn':
        this.$container.removeClass('hideLrc');
        this.$content.removeClass('showTip')
        break;
      case 'translateTap':
        this.$container.removeClass('hideLrc');
        this.$content.addClass('showTip')
        break;
      case 'translateOff':
        this.$container.addClass('hideLrc')
        break;
    }
  };
  Paragraph.prototype.setRepeatState = function() {
    var a = this.repeatState.split(',')[0]
    this.$repeatControl.find('a').attr('class', a);
  };
  Paragraph.prototype.setModeState = function() {
    var a = 'read'
    if (this.modeState != null) {
      this.modeState.split(',')[0];
    }
    this.$modeControl.find('a').attr('class', a);
    switch (a) {
      case 'read':
        this.$choised.hide();
        this.$paragraph.insertBefore(this.$translation)
        break;
      case 'fillword':
        this.$choised.show();
        this.$translation.insertBefore(this.$paragraph)
        break;
    }
  };
  Paragraph.prototype.setDesktopState = function() {};
  Paragraph.prototype.choisedAction = function(c) {
    var d = c.text(),
      b = this.$fillwordEscape.eq(0),
      a = b.text()
    if (d == a) {
      if (this.choisedState) {
        b.addClass('correct');
      } else {
        b.addClass('error');
        this.choisedState = true;
      }
      b.addClass('fill').removeClass('escape');
      this.$fillwordEscape = $('.escape');
      this.choisedIndex++;
      if (this.choisedIndex == this.choisedItem) {
        b.addClass('correct');
        setTimeout(function() {
          Qt.fillwordSuccessAction();
        }, 1000);
      }
    } else {
      this.choisedState = false;
      c.addClass('animError');
      setTimeout(function() {
        c.removeClass('animError');
      }, 500);
    }
  }