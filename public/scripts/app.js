// USE FOR ON PAGE EVENTS ONLY
$(() => {
  if (document.getElementById('sortable')) {
    let orderArray = [];
    $( "#sortable" ).sortable({
    update: function(event, ui) {
      var order =   $(this).sortable('toArray');
      orderArray = order;
      }
    });
    $( "#sortable" ).disableSelection();

    $( "#voteSubmit").on("click", function() {
      $.ajax({
        method: 'POST',
        url: '/polls/:url/',
        data: JSON.stringify({oa: orderArray, url: window.location.href}),
      contentType: 'application/json',
      success:function(result){
        window.location = result.result;
      },
      error:function(err){
        console.log("err");
      }
      });
    });
  }
});
