$(function($) {

  var q       = {};
  var mode    = false;
  var search  = window.location.search.replace(/^\?/,"").split("&");
  var site    = window.location.hostname;
  var path    = window.location.pathname;
  var s3url   = "http://"+site+".s3.amazonaws.com/";
  var s3key   = path.replace(/^\/*/, "");
  var redir   = "https://my.simplemiami.com/"+site+"/?page="+path;
  var cancel  = "http://"+site+path;
  var discard = window.location.href;

  for (var i=0; i<search.length; i++) {
    search[i] = decodeURIComponent(search[i]);
    q[search[i].replace(/=.*$/,"")] = search[i].replace(/^[^=]*=/,"");
  }

  if (!q.key || !q.pol || !q.sig) return;

  //$.eip.enabled(false);

  $("head").append($(
    "<style type='text/css'> "+
      "div#eipmodes { "+
        "position: fixed; "+
        "bottom: 0px; "+
        "left: 0px; "+
        "z-index: 99999 !important; "+
        "background: black; "+
        "color: white; "+
        "width: 100%; "+
        "opacity: 0.75; "+
        "filter: alpha(opacity = 75); "+
      "} "+
      "div#eipmodes .message, div#eipmodes .controls { "+
        "padding: 7px 10px; "+
      "} "+
      "div#eipmodes a { "+
        "color: red; "+
        "margin-left: 10px; "+
      "} "+
    "</style>"
  ));

  function hidden(name) {
    return $("<input/>").attr("type", "hidden").attr("name", name);
  }

  var tb = $("<div/>").attr("id", "eipmodes").append(
    $("<table/>")
      .attr("cellspacing", "0")
      .attr("cellpadding", "0")
      .attr("width", "100%")
      .append(
        $("<tr/>").append(
          $("<td/>").append(
            $("<div/>").addClass("message").text(
              "Press the 'edit' button to start editing this page. --->"
            )
          )
        ).append(
          $("<td/>").attr("align", "right").append(
            $("<div/>").addClass("controls").append(
              $("<form/>")
                .attr("action", s3url)
                .attr("method", "post")
                .attr("enctype", "multipart/form-data")
                .attr("encoding", "multipart/form-data")
                .append(hidden("AWSAccessKeyId").val(q.key))
                .append(hidden("policy").val(q.pol))
                .append(hidden("signature").val(q.sig))
                .append(hidden("acl").val("public-read"))
                .append(hidden("key").val(s3key))
                .append(hidden("success_action_redirect").val(redir))
                .append(hidden("Content-Type").val("text/html"))
                .append(hidden("file").val("hello world!"))
                .append($("<input/>").attr("type", "submit").val("edit"))
                .append($("<a/>").attr("href", cancel).text("cancel"))
            )
          )
        )
      )
  );

  $("form").submit((function(mode) {
    return function(event) {
      if ( (mode = !mode) ) {
        alert("one");
        $("input[type='submit']").val(discard);
        return false;
      } else {
        alert("two");
        return false;
      }
    }
  })(false));

  $("body").append(tb);

  function mode() {
    if (!mode) {
    }
    mode = !mode;
  }

})(jQuery);
