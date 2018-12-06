var myApp = new Framework7();
var $$ = Dom7;
//var mainView = myApp.addView('.view-main', { dynamicNavbar: true });



// GENERAL PURPOSE VARIABLES
var months = ['Januar','Februar','Marts','April','Maj','Juni','Juli','August','September','Oktober','November','December'];
var weekdays = ['søndag','mandag','tirsdag','onsdag','torsdag','fredag','lørdag','søndag'];
var shortdays = ['','M','T','O','T','F','L','S'];
var weektypes = {a: 'alle uger', l: 'lige uger', u: 'ulige uger'};
var shifttypes = {d: 'DV', a: 'AV', n: 'NV'};



// FUNCTIONAL MODULES
function showpage(p) {
  $('#cb > *').hide();
  $('.'+p).css('display','grid');

  if (p == 'main-menu') {
    $('.btn_main').hide();
  } else {
    $('.btn_main').show();
  }
}
function subplan(r) {
  var txt = "";
  for (var i = 0; i < r.length; i++) {
    if (i > 0) { txt += ", "; }
    switch( r[i].split(":")[0] ) {
      case 'a-year': txt += r[i].split(":")[1]; break;
      case 'a-month': txt += months[ r[i].split(":")[1]-1 ]; break;
      case 'a-week': txt += weektypes[ r[i].split(":")[1] ]; break;
      case 'a-day': txt += weekdays[ r[i].split(":")[1] ]; break;
      case 'a-type': txt += shifttypes[ r[i].split(":")[1] ]; break;
      case 'a-num': txt += r[i].split(":")[1] + ' af hver'; break;
    }
  }
  $('plan-list-cnt').append('<div><button>'+txt+'</button><i>___'+r+'</i><button>Slet</button></div>');
  $('plan-list-cnt div:last-child button:last-child').click(function() { $(this).parent().remove(); });
}
function clearplan() {
  $('.add-plan .select').each(function() {
    $(this).removeClass('select');
  });
  $('.add-plan .num').text(0);
  $('.add-plan > button').text('Vis tilføjede');
}
function addplan(initials, admin, pass, open, list) {
  showpage('loading');
  $$.post('http://davidsvane.com/roster/addplan.php', {i: initials, a: admin, p: pass, o: open, l: list}, function (d) {
    var obj = JSON.parse(d);

    $('.success').empty();
    $('.success').append('<h3>Plan ID: <b>'+ obj.id +'</b></h3>');
    $('.success').append('<h3>Admin kode: <b>'+ obj.admin +'</b></h3>');
    $('.success').append('<h3>Bruger kode: <b>'+ obj.pass +'</b></h3>');
    $('.success').append('<h3>Gem oplysningerne!</h3>')

    showpage('success');
    $('plan-list-cnt').empty();
    clearplan();
  });
}
function weeksinmonth(year, month_number) {

  var firstDayOfWeek = 1;

  var firstOfMonth = new Date(year, month_number-1, 1);
  var lastOfMonth = new Date(year, month_number, 0);

  var numberOfDaysInMonth = lastOfMonth.getDate();
  var firstWeekDay = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;

  var used = firstWeekDay + numberOfDaysInMonth;

  return Math.ceil( used / 7);

  /*var d1 = new Date(y, m-1, 1);
  var d2 = new Date(y, m, 0);
  return Math.floor( (d1.getDay() + 6 + d2.getDate()) / 7 );*/

}
Date.prototype.getWeekNumber = function(){
  var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};
function getplan(id, pass, initials) {
  showpage('loading');
  $$.post('http://davidsvane.com/roster/getplan.php', {i: id, p: pass, initi: initials}, function (d) {
    if (d.length < 10) {
      showpage('vote-menu');
      return;
    } else if (d.length < 42) {
      $('.success').html('<h3></h3><h3>'+d+'</h3><h3></h3>')
      showpage('success');
      return;
    }

    console.log(d);

    var obj = JSON.parse(d);
    var cal = obj['plan'].cal;
    var raw = obj['plan'].raw;

    $('.add-vote-cnt').empty();
    var counter = -1;

    var years = Object.keys(cal);
    for (var y = 0; y < years.length; y++) {
      $('.add-vote-cnt').append('<div class="years y_'+years[y]+'"><div>'+years[y]+'</div></div>');

      var c_months = Object.keys(cal[years[y]]);
      for (var m = 0; m < c_months.length; m++) {
        $('.add-vote-cnt .y_'+years[y]).append('<div class="c_months m_'+c_months[m]+'"><div>'+months[c_months[m]-1]+'</div><div class="titles"><div>Uge</div><div>M</div><div>T</div><div>O</div><div>T</div><div>F</div><div>L</div><div>S</div></div></div>');

        for (var w = 0; w < weeksinmonth(years[y], c_months[m]); w++) {
          var curr = new Date(years[y], c_months[m]-1, 1);
          $('.add-vote-cnt .y_'+years[y]+' .m_'+c_months[m]).append('<div class="weeks w_'+(curr.getWeekNumber()+w)+'"><div class="week">'+(curr.getWeekNumber()+w)+'</div></div>');
        }

        var date = new Date(years[y], c_months[m]-1, 1);
        var fill = (date.getDay() + 6) % 7;
        for (var f = 0; f < fill; f++) {
          $('.add-vote-cnt .y_'+years[y]+' .m_'+c_months[m]+' .weeks:nth-child(3)').append('<div class="fills"></div>');
        }

        var days = Object.keys(cal[years[y]][c_months[m]]);
        for (var d = 0; d < days.length; d++) {
          var curr = new Date(years[y], c_months[m]-1, days[d]);
          var w = curr.getWeekNumber();

          $('.add-vote-cnt .y_'+years[y]+' .m_'+c_months[m]+' .w_'+w).append('<div class="days d_'+days[d]+'"></div>');

          $('.add-vote-cnt .y_'+years[y]+' .m_'+c_months[m]+' .w_'+w+' .days:last-child').append('<div class="type type_d"><div class="empty"></div></div>');
          $('.add-vote-cnt .y_'+years[y]+' .m_'+c_months[m]+' .w_'+w+' .days:last-child').append('<div class="type type_a"><div class="empty"></div></div>');
          $('.add-vote-cnt .y_'+years[y]+' .m_'+c_months[m]+' .w_'+w+' .days:last-child').append('<div class="type type_n"><div class="empty"></div></div>');

          var types = Object.keys(cal[years[y]][c_months[m]][days[d]]);
          for (var t = 0; t < types.length; t++) {
            if (cal[years[y]][c_months[m]][days[d]][types[t]] != 0) {

              if ( obj['vote'] != null && obj['vote'][years[y]][c_months[m]][days[d]][types[t]] != 0 ) {
                $('.add-vote-cnt .y_'+years[y]+' .m_'+c_months[m]+' .w_'+w+' .days:last-child() .type_'+types[t]).html('<div class="types v'+obj['vote'][years[y]][c_months[m]][days[d]][types[t]]+'"><div class="'+years[y]+'_'+c_months[m]+'_'+days[d]+'_'+types[t]+'"></div></div>');
              } else {
                $('.add-vote-cnt .y_'+years[y]+' .m_'+c_months[m]+' .w_'+w+' .days:last-child() .type_'+types[t]).html('<div class="types"><div class="'+years[y]+'_'+c_months[m]+'_'+days[d]+'_'+types[t]+'"></div></div>');
              }

            }
          }

        }

        var date = new Date(years[y], c_months[m], 0);
        var fill = 6 - ((date.getDay() + 6) % 7);
        for (var f = 0; f < fill; f++) {
          $('.add-vote-cnt .y_'+years[y]+' .m_'+c_months[m]+' .weeks:last-child').append('<div class="fills"></div>');
        }

      }

    }

    $('.weeks').click(function() {
      $('.week-list .week-list-cnt').html( $(this).html() );
      $('.week-list .week-list-cnt > div').each(function(i) {
        $(this).prepend('<div class="titles">'+shortdays[i]+'</div>');
      });

      var m = $(this).siblings().first().text();
      var y = $(this).parent().siblings().first().text();

      $('.week-list .week').each(function() {
        $(this).html( '<div>'+y+' '+m+' uge '+$(this).text()+'</div>' + '<div></div><div>DV</div><div>AV</div><div>NV</div>' );
      });
      $('.week-list .types > div').html('<button value="1">1</button><button value="2">2</button><button value="3">3</button>');
      $('.week-list .types > div button').click(function() {
        if ( $(this).hasClass("select") ) {

          $(this).removeClass("select");

          var cc = $(this).parent().attr("class");
          var val = $(this).val();
          $('.add-vote .'+cc).parent().attr("class", "types");

        } else {

          $(this).parent().children().removeClass("select");
          $(this).addClass("select");

          var cc = $(this).parent().attr("class");
          var val = $(this).val();
          $('.add-vote .'+cc).parent().attr("class", "types v"+val);

        }
      });

      $('.week-list').append( '<button>Tilbage</button>' );
      $('.week-list > button').click(function() { showpage('add-vote'); });

      $('.week-list .v1 button:nth-child(1)').addClass('select');
      $('.week-list .v2 button:nth-child(2)').addClass('select');
      $('.week-list .v3 button:nth-child(3)').addClass('select');

      showpage('week-list');
    });

    showpage('add-vote');
  });
}
function addvotes() {

  showpage('loading');

  var v1 = [];
  var v2 = [];
  var v3 = [];
  var id = $('.vote-menu input:nth-of-type(1)').val();
  var pass = $('.vote-menu input:nth-of-type(2)').val();
  var initials = $('.vote-menu input:nth-of-type(3)').val();

  $('.add-vote .v1 div').each(function() { v1.push( $(this).attr("class") ); $(this).parent().remove(); });
  $('.add-vote .v2 div').each(function() { v2.push( $(this).attr("class") ); $(this).parent().remove(); });
  $('.add-vote .v3 div').each(function() { v3.push( $(this).attr("class") ); $(this).parent().remove(); });

  if ( v1.length > 0 || v2.length > 0 || v3.length > 0 ) {
    $$.post('http://davidsvane.com/roster/vote.php', {r1: v1, r2: v2, r3: v3, d: id, p: pass, i: initials }, function (d) {

      console.log(d);

      $('.success').html('<h3></h3><h3>'+d+'</h3><h3></h3>')
      showpage('success');

    });
  } else {

    showpage('add-vote');

  }

}
function calcresult(id, admin, lock) {
  showpage('loading');
  $$.post('http://davidsvane.com/roster/results.php', {i: id, a: admin, l: lock}, function (d) {
    if (d.length < 10) {
      showpage('calc-menu');
      return;
    } else if (d.length < 42) {
      $('.success').html('<h3></h3><h3>'+d+'</h3><h3></h3>')
      showpage('success');
      return;
    }

    var obj = JSON.parse(d);
    var cal = obj.plan;

    $('.see-result-cnt').empty();
    var counter = -1;

    var years = Object.keys(cal);
    for (var y = 0; y < years.length; y++) {
      $('.see-result-cnt').append('<div class="years y_'+years[y]+'"><div>'+years[y]+'</div></div>');

      var c_months = Object.keys(cal[years[y]]);
      for (var m = 0; m < c_months.length; m++) {
        $('.see-result-cnt .y_'+years[y]).append('<div class="c_months m_'+c_months[m]+'"><div>'+months[c_months[m]-1]+'</div><div class="titles"><div>Uge</div><div>M</div><div>T</div><div>O</div><div>T</div><div>F</div><div>L</div><div>S</div><div>Type</div></div></div>');

        for (var w = 0; w < weeksinmonth(years[y], c_months[m]); w++) {
          var curr = new Date(years[y], c_months[m]-1, 1);
          $('.see-result-cnt .y_'+years[y]+' .m_'+c_months[m]).append('<div class="weeks w_'+(curr.getWeekNumber()+w)+'"><div class="week">'+(curr.getWeekNumber()+w)+'</div></div>');
        }

        var date = new Date(years[y], c_months[m]-1, 1);
        var fill = (date.getDay() + 6) % 7;
        for (var f = 0; f < fill; f++) {
          $('.see-result-cnt .y_'+years[y]+' .m_'+c_months[m]+' .weeks:nth-child(3)').append('<div class="fills"></div>');
        }

        var days = Object.keys(cal[years[y]][c_months[m]]);
        for (var d = 0; d < days.length; d++) {
          var curr = new Date(years[y], c_months[m]-1, days[d]);
          var w = curr.getWeekNumber();

          $('.see-result-cnt .y_'+years[y]+' .m_'+c_months[m]+' .w_'+w).append('<div class="days d_'+days[d]+'"></div>');

          var types = Object.keys(cal[years[y]][c_months[m]][days[d]]);
          for (var t = 0; t < types.length; t++) {
            $('.see-result-cnt .y_'+years[y]+' .m_'+c_months[m]+' .w_'+w+' .d_'+days[d]).append('<div class="types type_'+types[t]+'"></div>');

            var persons = cal[years[y]][c_months[m]][days[d]][types[t]];
            if (persons != 0) {
              for (var p = 0; p < persons.length; p++) {
                $('.see-result-cnt .y_'+years[y]+' .m_'+c_months[m]+' .w_'+w+' .d_'+days[d]+' .type_'+types[t]).append('<div class="person rated'+persons[p][1]+'">'+persons[p][0]+'</div>');
              }
            }
          }
        }

        var date = new Date(years[y], c_months[m], 0);
        var fill = 6 - ((date.getDay() + 6) % 7);
        for (var f = 0; f < fill; f++) {
          $('.see-result-cnt .y_'+years[y]+' .m_'+c_months[m]+' .weeks:last-child').append('<div class="fills"></div>');
        }
      }
    }

    $('.see-result-cnt .weeks').append('<div class="legend"><div>DV</div><div>AV</div><div>NV</div></div>');

    showpage('see-result');
  });
}
function getpersonalplan(id, initials) {
  showpage('loading');
  $$.post('http://davidsvane.com/roster/personal.php', {i: id, initi: initials}, function (d) {
    if (d.length < 10) {
      showpage('user-menu');
      return;
    } else if (d.length < 42) {
      $('.success').html('<h3></h3><h3>'+d+'</h3><h3></h3>')
      showpage('success');
      return;
    }

    var obj = JSON.parse(d);
    var cal = obj.result.plan;
    var initi = obj.user;

    $('.see-personal-cnt').empty();
    var counter = -1;

    var years = Object.keys(cal);
    for (var y = 0; y < years.length; y++) {
      $('.see-personal-cnt').append('<div class="years y_'+years[y]+'"><div>'+years[y]+'</div></div>');

      var c_months = Object.keys(cal[years[y]]);
      for (var m = 0; m < c_months.length; m++) {
        $('.see-personal-cnt .y_'+years[y]).append('<div class="c_months m_'+c_months[m]+'"><div>'+months[c_months[m]-1]+'</div><div class="titles"><div>Uge</div><div>M</div><div>T</div><div>O</div><div>T</div><div>F</div><div>L</div><div>S</div><div>Type</div></div></div>');

        for (var w = 0; w < weeksinmonth(years[y], c_months[m]); w++) {
          var curr = new Date(years[y], c_months[m]-1, 1);
          $('.see-personal-cnt .y_'+years[y]+' .m_'+c_months[m]).append('<div class="weeks w_'+(curr.getWeekNumber()+w)+'"><div class="week">'+(curr.getWeekNumber()+w)+'</div></div>');
        }

        var date = new Date(years[y], c_months[m]-1, 1);
        var fill = (date.getDay() + 6) % 7;
        for (var f = 0; f < fill; f++) {
          $('.see-personal-cnt .y_'+years[y]+' .m_'+c_months[m]+' .weeks:nth-child(3)').append('<div class="fills"></div>');
        }

        var days = Object.keys(cal[years[y]][c_months[m]]);
        for (var d = 0; d < days.length; d++) {
          var curr = new Date(years[y], c_months[m]-1, days[d]);
          var w = curr.getWeekNumber();

          $('.see-personal-cnt .y_'+years[y]+' .m_'+c_months[m]+' .w_'+w).append('<div class="days d_'+days[d]+'"></div>');

          var types = Object.keys(cal[years[y]][c_months[m]][days[d]]);
          for (var t = 0; t < types.length; t++) {
            $('.see-personal-cnt .y_'+years[y]+' .m_'+c_months[m]+' .w_'+w+' .d_'+days[d]).append('<div class="types type_'+types[t]+'"></div>');

            var persons = cal[years[y]][c_months[m]][days[d]][types[t]];
            if (persons != 0) {

              for (var p = 0; p < persons.length; p++) {
                if (persons[p][0] == initi) {
                  $('.see-personal-cnt .y_'+years[y]+' .m_'+c_months[m]+' .w_'+w+' .d_'+days[d]+' .type_'+types[t]).append('<div class="person rated'+persons[p][1]+'">'+persons[p][0]+'</div>');
                }
              }
            }
          }
        }

        var date = new Date(years[y], c_months[m], 0);
        var fill = 6 - ((date.getDay() + 6) % 7);
        for (var f = 0; f < fill; f++) {
          $('.see-personal-cnt .y_'+years[y]+' .m_'+c_months[m]+' .weeks:last-child').append('<div class="fills"></div>');
        }
      }
    }

    $('.see-personal-cnt .weeks').append('<div class="legend"><div class="d"></div><div class="a"></div><div class="n"></div></div>');
    $('.see-personal-cnt .person').each(function() {
      var leg = $(this).parent().index();
      var type = ['DV','AV','NV'];
      $(this).parent().parent().parent().find('.legend div:nth-child('+(leg+1)+')').text(type[leg]);
    });

    showpage('see-personal');
  });
}



$$(document).on('deviceready', function() {

  // ADD THIS AND TWO SUBSEQUENT YEARS AS OPTIONS
  var d = new Date();
  var y = d.getFullYear();
  $('.a-year button').each(function(i) {
    $(this).text(y+i);
    $(this).val(y+i);
  });


  // MENU CONTROLS
  $('.main-menu button').click(function() { showpage( $(this).val() ); });


  // CONTROLS FOR ADDING NEW PLAN
  $('.add-menu button').click(function() {
    var initials = $('.add-menu input:nth-of-type(1)').val();
    var admin = $('.add-menu input:nth-of-type(2)').val();
    var pass = $('.add-menu input:nth-of-type(3)').val();

    if ( initials.length > 0 && admin.length > 0 && pass.length > 0 ) {
      showpage('add-plan');
    }
  });
  $('.add-plan button').click(function() {
    if ($(this).parent().hasClass("add-plan")) {
      if ($('.a-year .select').length > 0
          && $('.a-month .select').length > 0
          && $('.a-week .select').length > 0
          && $('.a-day .select').length > 0
          && $('.a-type .select').length > 0
          && parseInt($('.stepper :nth-child(2)').text()) > 0) {
        var r = [];
        $('.add-plan .select').each(function() {
           r.push( $(this).parent().attr("class") +":"+ $(this).val() );
        });
        r.push( 'a-num' +":"+ $('.stepper :nth-child(2)').text() );
        subplan(r);
      }
      showpage('plan-list');
      return;
    } else if ($(this).parent().hasClass("a-week")) {
      if ($(this).hasClass("select")) {
        $(this).removeClass("select");
      } else {
        $('.a-week button').each(function() {
          $(this).removeClass("select");
        });
        $(this).toggleClass("select");
      }
    } else {
      $(this).toggleClass("select");
    }
  });
  $('.stepper :nth-child(1)').click(function() {
    var c = parseInt( $('.stepper :nth-child(2)').text() );
    if (c > 0) { $('.stepper :nth-child(2)').text( c-1 ); }
    if (c == 1) { $('.add-plan > button').text('Vis tilføjede'); }
  });
  $('.stepper :nth-child(3)').click(function() {
    var c = parseInt( $('.stepper :nth-child(2)').text() );
    $('.stepper :nth-child(2)').text( c+1 );
    if (c == 0) { $('.add-plan > button').text('Tilføj'); }
  });


  // CONTROLLING THE LIST OF SUB-PLANS
  $('.plan-list > button').click(function() {
    if ( $(this).val() == 'more' ) {
      clearplan();
      showpage('add-plan');
    } else if ( $(this).val() == 'enough' && $('plan-list-cnt > div').length > 0 ) {
      var list = $('plan-list-cnt > div i').text();
      addplan( $('#in').val(), $('#ak').val(), $('#bk').val(), true, list);
    }
  });
  $('.vote-menu button').click(function() {
    var id = $('.vote-menu input:nth-of-type(1)').val();
    var pass = $('.vote-menu input:nth-of-type(2)').val();
    var initials = $('.vote-menu input:nth-of-type(3)').val();

    if ( id.length > 0 && pass.length > 0 && initials.length > 0 ) {
      getplan(id, pass, initials);
    }
  });
  $('.add-vote > button').click(function() { addvotes(); });


  // RESULT CONTROLS
  $('#beregn').click(function() {
    var id = $('.calc-menu input:nth-of-type(1)').val();
    var admin = $('.calc-menu input:nth-of-type(2)').val();
    var mail = $('.calc-menu input:nth-of-type(3)').val();
    var lock = $('#lock').val();

    if ( id.length > 0 && admin.length > 0 && mail.length > 0 ) {
      calcresult(id, admin, lock);
    }
  });
  $('#lock').click(function() {
    if ($(this).val() == 1) {
      $(this).val(0);
      $(this).text('Låst');
      $(this).addClass("select");
    } else {
      $(this).val(1);
      $(this).text('Ulåst');
      $(this).removeClass("select");
    }
  });
  $('.see-result > button').click(function() {
    showpage('loading');

    var id = $('.calc-menu input:nth-of-type(1)').val();
    var mail = encodeURI($('.calc-menu input:nth-of-type(3)').val());

    $$.post('http://davidsvane.com/roster/mailer.php', {i: id, e: mail}, function (d) { showpage('see-result'); });
  });
  $('.user-menu button').click(function() {
    var id = $('.user-menu input:nth-of-type(1)').val();
    var initials = $('.user-menu input:nth-of-type(2)').val();
    var email = $('.user-menu input:nth-of-type(3)').val();

    if ( id.length > 0 && initials.length > 0 && email.length > 0 ) {
      getpersonalplan(id, initials);
    }
  });
  $('.see-personal > button').click(function() {
    showpage('loading');

    var id = $('.user-menu input:nth-of-type(1)').val();
    var initials = $('.user-menu input:nth-of-type(2)').val();
    var mail = encodeURI($('.user-menu input:nth-of-type(3)').val());

    $$.post('http://davidsvane.com/roster/mailer_personal.php', {i: id, e: mail, initi: initials}, function (d) { showpage('see-personal'); });
  });

});
