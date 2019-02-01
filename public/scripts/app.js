// USE FOR ON PAGE EVENTS ONLY
$(() => {
<<<<<<< HEAD
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
=======
  if (document.getElementById('sortable')) {
    let orderArray = [];
    $( "#sortable" ).sortable({
    update: function(event, ui) {
      var order =   $(this).sortable('toArray');
      orderArray = order;
      // console.log(orderArray);
      }
    });
    $( "#sortable" ).disableSelection();

    $( "#voteSubmit").on("click", function() {
      $.ajax({
        method: 'POST',
        url: '/polls/:v_url/',
        data: orderArray
      });
      console.log(orderArray);
    });
  }
>>>>>>> e9e915193e228aca7efead11ab9950019c832db9
});
