/**
TODO:

- Test multiple clicks in prev and next links and check if months are changing accordingly
- Test is never too much, so, if you wanna write a test, do it!
**/
events = [
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
      date: new Date('2013', '10', '21'),
      object: {'title': 'Teste 44', 'desc': 'Minhas grandes descobertas no jquery44'},
    },
]

function setup(options) {

    if(options == undefined)
        options = {}

    return $('#default_calendar').calendarjs(options)
}

function get_prev_next_links(el) {
    return el.children('p.month_name').children('a')
}

function get_month_name(el) {
    return $cl.children('p.month_name').html()
}

function month_name_is(el, expected) {
    return get_month_name(el).indexOf(expected) > -1
}

test( "month name must be present", function() {
    $cl = setup({date: new Date(2013, 0, 30)});
    ok(month_name_is($cl, 'Janeiro 2013'))
});

test( "next and previous link must be present", function() {
    $cl = setup({date: new Date(2013, 0, 30)});
    $links = $cl.children('p.month_name').children('a')
    equal($links.length, 2, "Must have 2 links (next and prev)")
    ok($links[0].outerHTML.search('prev') > -1, "Prev link must be present")
    ok($links[1].outerHTML.search('next') > -1, "Next link must be present")
});

test( "month january must have 31 days", function() {
    $cl = setup({date: new Date(2013, 0, 30)});
    ndays = $cl.children('.days_of_month').find('.day').length
    equal(ndays, 31)
});

test( "prev link should work", function() {
    $cl = setup({date: new Date(2013, 0, 30)});
    links = get_prev_next_links($cl)
    $(links[0]).click()
    ok(month_name_is($cl, 'Dezembro 2012'))
});

test( "next link should work", function() {
    $cl = setup({date: new Date(2013, 0, 30)});
    links = get_prev_next_links($cl)
    $(links[1]).click()
    ok(month_name_is($cl, 'Fevereiro 2013'))
});

test( "when change month callback must be called", function() {
    $cl = setup(
        {
            date: new Date(2013, 0, 30),
            month_change_cb: function() {
                ok(true)
            }
        }
    );

    links = get_prev_next_links($cl)
    $(links[1]).click()
});

test( "when click in a day callback must be called", function() {
    $cl = setup(
        {
            date: new Date(2013, 0, 30),
            day_click_cb: function() {
                ok(true)
            }
        }
    );

    link = $cl.children('.days_of_month').find('.day')[0]
    $(link).click()
});

test( "febuary should have 29 days in bisextile years and 28 in the other years", function() {
    expect( 2 )
    $cl = setup({date: new Date(2016, 1, 1)});
    ndays = $cl.children('.days_of_month').find('.day').length
    equal(ndays, 29, 'bisextile 29 days')

    $cl = setup({date: new Date(2013, 1, 1)});
    ndays = $cl.children('.days_of_month').find('.day').length
    equal(ndays, 28, 'normal year 28 days')
});

test( "when load events they should appear", function() {
    expect( 4 )
    $cl = setup({date: new Date(2016, 1, 1)});
    $cl.set_events(events)
    ok(month_name_is($cl, 'Novembro 2013'), 'The month name is ok')

    $days = $cl.children('.days_of_month').children('p').children('span.day.event')
    equal($days[0].innerHTML, "1", "Day 1 must have an event")
    equal($days[1].innerHTML, "12", "Day 12 must have an event")
    equal($days[2].innerHTML, "21", "Day 21 must have an event")
});

test( "when click in a day with events they should be returned to callback function", function() {
    expect( 3 )

    var dayclick = function(cl, date, evt) {
        if(date == "01/11/2013")
            equal(evt.length, 3, 'Day 01 must have 3 events')

        if(date == "12/11/2013")
            equal(evt.length, 2, 'Day 12 must have 2 events')

        if(date == "21/11/2013")
            ok(evt.object.title !== '', "Day 21 must have 1 event")
    }

    $cl = setup({date: new Date(2016, 1, 1), day_click_cb: dayclick});
    $cl.set_events(events)

    $days = $cl.children('.days_of_month').children('p').children('span.day.event')
    $days[0].click()
    $days[1].click()
    $days[2].click()
});

test( "when use function 'set_date' calendar must change and show the new date", function() {
    expect( 2 )

    $cl = setup({date: new Date(2016, 1, 1)})
    ok(month_name_is($cl, 'Fevereiro 2016'), 'First render with Febuary 2016')
    $cl.set_date(new Date(1988, 11, 1))
    ok(month_name_is($cl, 'Dezembro 1988'), 'Change date to December 1988')
});
