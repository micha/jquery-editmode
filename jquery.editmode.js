$(function() {
  var q       = {};
  var mode    = 0;
  var search  = window.location.search.replace(/^\?/,"").split("&");
  var site    = window.location.hostname;
  var path    = window.location.pathname;
  var redir   = "https://my.simplemiami.com/"+site+"/?page="+path;

  for (var i=0; i<search.length; i++) {
    search[i] = decodeURIComponent(search[i]);
    q[search[i].replace(/=.*$/,"")] = search[i].replace(/^[^=]*=/,"");
  }

  $.eip.enabled(false);

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

  var tb = $("<div/>").attr("id", "eipmodes").append(
    $("<table/>")
      .attr("cellspacing", "0")
      .attr("cellpadding", "0")
      .attr("width", "100%")
      .append(
        $("<tr/>").append(
          $("<td/>").append(
            $("<div/>").addClass("message").text("Hello world.")
          )
        ).append(
          $("<td/>").attr("align", "right").append(
            $("<div/>").addClass("controls").append(
              $("<input/>").attr("type", "button").val("doit")
            ).append(
              $("<a/>").attr("href", "#").text("cancel")
            )
          )
        )
      )
  );

  $("body").append(tb);

  /*
  function toggleMode() {
    if (++mode % 2) {
      if (q.pol && q.sig && q.key) {
        $("form#eipmodes")
          .attr("action", "http://tremendogay.com.s3.amazonaws.com/")
          .attr("method", "post")
          .attr("enctype", "multipart/form-data")
          .attr("encoding", "multipart/form-data")
          .submit(function() {
            $("input[name='AWSAccessKeyId']").val(q.key);
            $("input[name='policy']").val(q.pol);
            $("input[name='signature']").val(q.sig);
            $("input[name='acl']").val("public-read");
            $("input[name='key']").val("uploaded.txt");
            $("input[name='success_action_redirect']").val(redir);
            $("input[name='Content-Type']").val("text/plain");
            $("input[name='file']").val(new Date());
          });
      } else {
        alert("uh oh");
      }
    } else {
    }
  }
  //    <form>
  //      <input type="hidden" name="AWSAccessKeyId" /> 
  //      <input type="hidden" name="policy" />
  //      <input type="hidden" name="signature" />
  //      <input type="hidden" name="acl" /> 
  //      <input type="hidden" name="key" />
  //      <input type="hidden" name="success_action_redirect" />
  //      <input type="hidden" name="Content-Type" />
  //       
  //
  //      File to upload to S3: 
  //      <input name="file" type="hidden"> 
  //      <br> 
  //      <input type="submit" value="Upload File to S3"> 
  //    </form> 
  */
});
