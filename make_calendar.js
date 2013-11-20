// default localization object in PT_BR
var pt_br = {
  month_names: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
           'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  weekdays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
  weekdays_short: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
}

$("#date_to_go").mask('99/99/9999')

var dayclick = function(cl, date, evt) {
  $("#event_list_content").fadeOut('fast',function() {
    $("#event_list_content").html('')
    if(!evt)
      return;

    if($.isArray(evt)) {
      $(evt).each(function(i, el) {
        show_event(el.object)
      })
    }
    else {
      show_event(evt.object)
    }
    $("#event_list_content").fadeIn('fast')
  })
}

var show_event = function(evt) {
  $("#event_list_content").append('<div class="event">');
  $("#event_list_content").append('<h3>' + evt.title + '</h3>');
  $("#event_list_content").append('<p class="evt-desc">' + evt.desc + '</p>');
  $("#event_list_content").append('</div>');
}

var month_change = function(old, now) {
  month = now.getMonth()
  year = now.getFullYear()

  if(year == 2013) {
    if(month == 10)
      calendario.set_events(load_events(month))
    else if(month == 11)
      calendario.set_events(load_events(month))
  }
}

var load_events = function(mes) {
  novembro = [
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
    },
  ]

  dezembro = [
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
    },
  ]

  if( mes == 10 )
    return novembro
  else if( mes == 11 )
    return dezembro
  else
    return []
}

var calendario = $('.calendar').calendarjs({
  l10n: pt_br,
  date: new Date(2013, 0, 30),
  day_click_cb: dayclick,
  month_change_cb: month_change,
})

//calendario.set_events(load_events(10))

$("form").submit(function() {
  var date = $('#date_to_go').val().split('/')
  if(date.length < 3)
    return false

  calendario.set_date(new Date(date[2], date[1]-1, date[0]))
})
