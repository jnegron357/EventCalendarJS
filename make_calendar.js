var event_list = {
  january : [
    {
      date: new Date('2013', '10', '01'),
      object: {'title': 'Teste 11', 'desc': 'Minhas grandes descobertas no jquery11'},
    },
    {
      date: new Date('2013', '10', '01'),
      object: {'title': 'Teste 12', 'desc': 'Minhas grandes descobertas no jquery12'},
    },
    {
      date: new Date('2013', '10', '01'),
      object: {'title': 'Teste 13', 'desc': 'Minhas grandes descobertas no jquery13'},
    },
    {
      date: new Date('2013', '10', '12'),
      object: {'title': 'Teste 22', 'desc': 'Minhas grandes descobertas no jquery22'},
    },
    {
      date: new Date('2013', '10', '12'),
      object: {'title': 'Teste 23', 'desc': 'Minhas grandes descobertas no jquery23'},
    },
    {
      date: new Date('2013', '10', '19'),
      object: {'title': 'Teste 33', 'desc': 'Minhas grandes descobertas no jquery3'},
    },
    {
      date: new Date('2013', '10', '21'),
      object: {'title': 'Teste 44', 'desc': 'Minhas grandes descobertas no jquery44'},
    },
    {
      date: new Date('2013', '10', '21'),
      object: {'title': 'Teste 45', 'desc': 'Minhas grandes descobertas no jquery45'},
    }
  ],
  december : [
    {
      date: new Date('2013', '11', '25'),
      object: {'title': 'Natal parte1', 'desc': 'Feliz natal, hoho'},
    },
    {
      date: new Date('2013', '11', '25'),
      object: {'title': 'Natal parte2', 'desc': 'Feliz natal, hoho2'},
    },
    {
      date: new Date('2013', '11', '31'),
      object: {'title': 'Feliz Ano Novo!', 'desc': 'Grandes conquistas para 2014'},
    }
  ]
};
var months = {
  1 : "january",
  2 : "february",
  3 : "march",
  4 : "april",
  5 : "may",
  6 : "june",
  7 : "july",
  8 : "august",
  9 : "september",
  10: "october",
  11: "november",
  12: "december"
};

$("#date_to_go").mask('99/99/9999');

var eventListContent = $("#event_list_content");

var day_click = function(cl, date, evt) {
  eventListContent.fadeOut('fast', function() {
    $(this).html('');
    if(!evt) return;
    if($.isArray(evt)) {
      $(evt).each(function(i, el) {
        show_event(el.object);
      })
    }
    else {
      show_event(evt.object);
    }
    $(this).fadeIn('fast');
  })
};

var show_event = function(evt) {
  eventListContent.append('<div class="event">');
  eventListContent.append('<h3>' + evt.title + '</h3>');
  eventListContent.append('<p class="evt-desc">' + evt.desc + '</p>');
  eventListContent.append('</div>');
};

var month_change = function(now) {
  if(now === undefined) now = new Date();
  calendar.set_events(event_list[now.getMonth()]);
};

var calendar = $('.calendar').eventCalendar({
  day_click_cb: day_click,
  month_change_cb: month_change,
});

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
calendar.set_events(event_list[months[currentMonth]]);

$("form").submit(function() {
  var date = $('#date_to_go').val().split('/');
  if(date.length < 3) return false;
  calendar.set_date(new Date(date[2], date[1]-1, date[0]));
});
