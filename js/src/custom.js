var browserHeight = document.documentElement.clientHeight || document.body.clientHeight;
var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;


function FigureHover(figure) {
  $("[copyFlag]").removeAttr("copyFlag");
  $(figure).find(".code").attr("copyFlag", 1);
  $copyBtn = $("#copyBtn");
  if ($copyBtn.length != 0) {
    $copyBtn.stop();
    $copyBtn.css("opacity", 0.8);
    $copyBtn.css("display", "block");

    function setCopyBtnpos(obj) {
      var targeRect = obj.getBoundingClientRect();
      var vtop = targeRect.top > 0 ? targeRect.top : 0;
      vtop = vtop < (targeRect.bottom - $copyBtn.height()) ? vtop : (targeRect.bottom - $copyBtn.height());
      $copyBtn.css("top", vtop + 6);
      $copyBtn.css("left", targeRect.left - $copyBtn.width() - 3);
    }

    setCopyBtnpos(figure);
    resizePos(figure, setCopyBtnpos);
  }
  var block = $(figure).attr("block");
  if (block != 1) {
    var codeArea = $(figure).find(".code")[0];
    var width_code = codeArea.clientWidth;
    var width_Scroll = codeArea.scrollWidth;
    var width_Margin = -parseInt($(figure).css("marginRight"));
    $codePinBtn = $(figure).find(".codePinBtn");

    var width_Hide = width_Scroll - (width_code - width_Margin);
    if (width_Hide > 0) {
      $(figure).stop();

      $codePinBtn.stop();
      var width_Main = $("#main").width();
      var width_Base = $(".main-inner").width();
      var width_Blank = (width_Main - width_Base) / 2 - 10;

      if (width_Blank > 0) {
        if (width_Hide < width_Blank) {
          width_Margin = width_Hide; //空白区域足够直接显示 全部
        } else {
          width_Margin = width_Blank * 0.8;
        }
        $(figure).animate({marginRight: -width_Margin});
        $codePinBtn.animate({opacity: 1});
      }
    }
    ;
  }
  ;
};

function FigureHoverOut(figure) {
  $("#copyBtn").animate({
    opacity: 0
  }, 2000);
  var block = $(figure).attr("block");
  if (block != 1) {
    $(figure).stop();
    $(figure).animate({marginRight: "0"});
    var $codePinBtn = $(figure).find(".codePinBtn");
    $codePinBtn.stop();
    $codePinBtn.css({opacity: 0});
  }
};

$("figure").hover(
  function () {
    FigureHover(this);
    var block = $(this).attr("block");
    if (block == 1) {
      BindScrollTo($(this).find(".code")[0]);
    }
  },
  function () {
    FigureHoverOut(this);
    UnBindScroll();
  }
);


$("figure").unbind("dblclick").bind("dblclick", function () { //双击事件
  var block = $(this).attr("block");
  if (block != 1) {
    $(".post-body").css("transform","none");
    BindScrollTo($(this).find(".code")[0]);
    $(this).attr("block", 1);
    $(this).find(".codePinBtn img").attr("src", "/article_images/png/Pin_red.png");
  } else {
    UnBindScroll();
    $(this).attr("block", 0);
    $(this).find(".codePinBtn img").attr("src", "/article_images/png/Pin_green.png");
  }
})

$(window).resize(function () {
  var block;

  var width_Main = $("#main").width();
  var width_Base = $(".main-inner").width();
  var width_Blank = (width_Main - width_Base) / 2 - 10;
  $copyBtn = $("#copyBtn");
  if (width_Blank < $copyBtn.width()) {
    $copyBtn.css("display", "none");
  } else {
    $copyBtn.css("display", "block");
  }

  $("figure[block='1']").each(function () {
    block = $(this).attr("block");
    if (block == 1) {
      var width_This = $(this).width();
      var width_Scroll = $(this)[0].scrollWidth;
      var width_Margin = -parseInt($(this).css("marginRight"));

      var width_Hide = width_Scroll - (width_This - width_Margin);
      if (width_Hide > 0) {
        //var width_Main  = $("#main").width();
        //var width_Base  = $(".main-inner").width();
        //width_Blank = (width_Main - width_Base) / 2 - 10;

        if (width_Blank > 0) {
          if (width_Hide < width_Blank) {
            width_Margin = width_Hide; //空白区域足够直接显示 全部
          } else {
            width_Margin = width_Blank * 0.8;
          }
          $(this).css({
            marginRight: -width_Margin
          });
          $(this).find(".codePinBtn").animate({
            opacity: 1,
            left: $(".post-body")[0].getBoundingClientRect().right + width_Margin - $(this).find(".codePinBtn").width()
          });
        }
      }
    }
  });
});



function createCopyBtns() {
  var $figure = $("figure .figcode");
  if ($figure.length > 0) {
    //$(".post-body").before('<div id="copyBtn" ><span id="imgCopy" ><i class="fa fa-paste fa-fw"></i></span><span id="imgSuccess" style="display: none;color: #6FB76F;"><i class="fa fa-check-circle fa-fw" aria-hidden="true"></i></span>');
    $figure.append('<div class="codePinBtn"><img id="imgSuccess" src="/article_images/png/Pin_green.png" style="border:none; width: 24px;"></div>');
  }
  /*var $codeArea = $("figure .code");
  if ($codeArea.length > 0) {
    function changeToSuccess(item) {
      $imgOK = $("#copyBtn").find("#imgSuccess");
      if ($imgOK.css("display") == "none") {
        $imgOK.css({
          opacity: 0,
          display: "block"
        });
        $imgOK.animate({
          opacity: 1
        }, 1000);
        setTimeout(function () {
          $imgOK.animate({
            opacity: 0
          }, 2000);
        }, 2000);
        setTimeout(function () {
          $imgOK.css("display", "none");
        }, 4000);
      }
      ;
    };

    var clipboard = new Clipboard('#copyBtn', {
      target: function () {
        var node =  document.querySelector("[copyFlag]");
        var child = node.querySelector(".diff-deletion");
        if (child != null ){
          var pre = node.querySelector("pre").cloneNode(true);
          child = pre.querySelector(".diff-deletion");
          while ( child != null ){
            pre.removeChild(child)
            child = pre.querySelector(".diff-deletion");
          }
          var node = document.getElementById('tmpcopy');
          if (node == null){
            node = document.createElement('div');
            node.id = 'tmpcopy';
            node.style.position = 'fixed';
            node.style.width = '0';
            node.style.height = '0';
            document.body.appendChild(node);
          }
          node.innerHTML = '';
          node.appendChild(pre);
        }
        return  node;
      },
      isSupported: function () {
        alert(this.support);
        return document.querySelector("[copyFlag]");
      }
    });

    clipboard.on('success',
      function (e) {
        e.clearSelection();
        changeToSuccess(e);
        var node = document.getElementById("tmpcopy");
        if (node != null) node.innerHTML = '';
      });

    clipboard.on('error',
      function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
      });
    $("#copyBtn").hover(
      function () {
        $(this).stop();
        $(this).css("opacity", 1);
      },
      function () {
        $(this).animate({
          opacity: 0
        }, 2000);
      }
    );
  }*/
}

function btnPinClick() {
  var figure = this.parentElement.parentElement;
  var block = $(figure).attr("block");
  if (block != 1) {
    $(".post-body").css("transform","none");
    BindScrollTo($(figure).find(".code")[0]);
    $(figure).attr("block", 1);
    $(this).find("img").attr("src", "/article_images/png/Pin_red.png");
  } else {
    UnBindScroll();
    $(figure).attr("block", 0);
    $(this).find("img").attr("src", "/article_images/png/Pin_green.png");
  }
}

$(document).ready(function () {
  //缓存控制是否显示 侧边栏 1：显示；0：隐藏；默认显示
  if (localStorage.sidebar_show) {
    if (Number(localStorage.sidebar_show) == 1) {
      NexT.utils.displaySidebar();
    } else {
      localStorage.sidebar_show = 0;
    }
    ;
  } else {
    NexT.utils.displaySidebar();
  }

  createCopyBtns();

  $(".codePinBtn").unbind("click").bind("click", btnPinClick);

  // console.log('navigator.userAgent', navigator.userAgent);
  // console.log(getBrowser(1));

  //$(".footer-inner .fa-heart").addClass("fa-" + getBrowser().toLowerCase());
});

