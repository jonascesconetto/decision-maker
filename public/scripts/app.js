// USE FOR ON PAGE EVENTS ONLY
$(() => {
  let orderArray = [];
  $( "#sortable" ).sortable({
  update: function(event, ui) {
    var order =   $(this).sortable('toArray');
    orderArray = order;
    // console.log('1', orderArray);
    }
  });
  $( "#sortable" ).disableSelection();

  $( "#voteSubmit").on("click", function() {
    $.ajax({
      method: 'POST',
      url: '/polls/vote/',
      data: JSON.stringify({orderArray}),
      contentType: 'application/json',
      success:function(result){
        console.log("we are working");
        window.location = "http://localhost:8080" ;
      },
      error:function(err){
        console.log("something happened");
      }
    });
    // console.log(orderArray);
  });
});
