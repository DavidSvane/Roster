var myApp = new Framework7();
var $$ = Dom7;
//var mainView = myApp.addView('.view-main', { dynamicNavbar: true });

function generatePlanForm() {

  var month_names = ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'];
  var day_names = ['M','T','O','T','F','L','S'];

}

$$(document).on('deviceready', function() {

  // ADD THIS AND TWO SUBSEQUENT YEARS AS OPTIONS
  var d = new Date();
  var y = d.getFullYear();
  $('.a-year button').each(function(i) {
    $(this).text(y+i);
    $(this).val(y+i);
  });

  // CONTROLS FOR ADDING NEW PLAN
  $('.add-plan button').click(function() {
    if ($(this).parent().hasClass("add-plan")) {
      if ($('.a-year .select').length > 0 && $('.a-month .select').length > 0 && $('.a-week .select').length > 0 && $('.a-day .select').length > 0 && $('.a-type .select').length > 0 && parseInt($('.stepper :nth-child(2)').text()) > 0) {
        var r = [];
        $('.add-plan .select').each(function() {
           r.push( $(this).parent().attr("class") +":"+ $(this).val() );
        });
        r.push( 'a-num' +":"+ $('.stepper :nth-child(2)').text() );
        console.log(r);
      }
      return;
    }
    if ($(this).parent().hasClass("a-week")) {
      $('.a-week button').each(function() {
        $(this).removeClass("select");
      });
    }
    $(this).toggleClass("select");
  });
  $('.stepper :nth-child(1)').click(function() {
    var c = parseInt( $('.stepper :nth-child(2)').text() );
    c > 0 ? $('.stepper :nth-child(2)').text( c-1 ) : 0;
  });
  $('.stepper :nth-child(3)').click(function() {
    var c = parseInt( $('.stepper :nth-child(2)').text() );
    $('.stepper :nth-child(2)').text( c+1 );
  });

});
