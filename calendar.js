/****
TODO:

- Passar classe para dias passados
- Abrir eventos do dia de hoje
***/
 (function ( $ ) {

 	// default localization object in PT_BR
	var dflt_l10n = {
		month_names: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
					   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
		weekdays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
		weekdays_short: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
	}

    $.fn.calendarjs = function( options ) {

        var settings = $.extend({
            width: 400,
            height: 230,
            auto_render: true,
            l10n: dflt_l10n,
            date: new Date(),
            short_weekdays: true,
            next_link: '<a href="#"> >> </a>',
            prev_link: '<a href="#" class="prev"> << </a>',

            day_click_cb: function(){},
            month_change_cb: function(){}
        }, options );

		var l10n = settings.l10n
        var date = settings.date
        var month = date.getMonth()
        var year = date.getFullYear()
        var today = new Date()
        var el = this
        var self = this
        var already_render = false

        //public properties
        this.events_list = {}

        // store each day html element so we can manipulate it easily
        var $days_els = []

        function pad(str) {
            max = 2
            return str.length < max ? pad("0" + str, max) : str
        }

        // check if year is bissextile
        function is_bis() {
        	return ((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0)))
        }

        function get_month_nodays() {
        	return (32 - new Date(year, month, 32).getDate())
        }

        function get_month_name() {
        	return l10n.month_names[month]
        }

        function get_days_week() {
        	if(settings.short_weekdays)
        		return l10n.weekdays_short
        	else
        		return l10n.weekdays
        }

        // get the size of a collumn
        function get_col_width() {
        	return settings.width / 7
        }

        // render the month name line
        function render_month_line() {
            if(!$(settings.next_link).hasClass('next'))
                settings.next_link = $(settings.next_link).addClass('next')[0].outerHTML
        	return '<p class="month_name">' + settings.prev_link + get_month_name() + ' ' + date.getFullYear() + settings.next_link + '</p>'
        }

        // render de weekdays line
        function render_weekdays() {
        	var weekdays = get_days_week()
        	var cellwidth = get_col_width()
        	var $output  = $('<p/>').css({'display': 'table-row'})
        	for(var i=0; i < weekdays.length; i++) {
        		weekday = $("<span class='weekday " + weekdays[i] + "'>" + weekdays[i] + '</span>')
        		weekday.css({width: cellwidth, display: 'table-cell'})
        		$output.append(weekday)
        	}
        	return $output
        }

        // render all days of a month
        function render_days() {
        	var nodays = get_month_nodays()
        	var cellwidth = get_col_width()
        	var per_line = 7
        	var counter = 0
        	var weekday_start_month = new Date(date.getFullYear(), date.getMonth(), '1').getDay()

            // init calendar month/year and today month/year/day
            var cmonth = date.getMonth(), cyear = date.getFullYear()
            var imonth = today.getMonth(), iyear = today.getFullYear(), iday = today.getDate()

            $days_els = []

            //css
            line_css = {'display': 'table-row'}
            day_css = {
                'display': 'table-cell',
                'width': cellwidth
            }

        	$div_days = $('<div class="days_of_month"/>')

        	for(var i = 1; i <= nodays; i++) {
				if(counter == 0)
        			$line = $('<p/>').css(line_css)

                // if is the first day of month, lets print it below its weekname
        		if(i == 1 && (i-1) != weekday_start_month) {
        			while(counter < weekday_start_month) {
        				$day = $("<span class='day-empty'/>").html('-').css(day_css)
        				$line.append($day)
        				counter++
        			}
        		}

        		$day = $("<span class='day'/>").html(i).css(day_css)
                $day.data('date', pad(i.toString()) + '/' + (month+1) + '/' + year)

                if(cmonth == imonth && cyear == iyear && i == iday)
                    $day.addClass('today')
                else if(cmonth < imonth || cyear < iyear || i < iday)
                    $day.addClass('past')

        		$days_els.push($day)
        		$line.append($day)
        		counter++

        		if(counter == 7) {
        			$div_days.append($line)
        			counter = 0
        		}
			}
			if(counter != 0)
				$div_days.append($line)

			return $div_days
        }

        // render the calendar
        function render_calendar() {
            el.html('')
            el.append(render_month_line())
            el.append(render_weekdays())
            el.append(render_days())
            already_render = true
        }

        function set_next_prev_links() {
        	$( el ).on( "click", "a.next, a.prev", function(e) {
                e.preventDefault()
        		month = date.getMonth()
        		year = date.getFullYear()

                var old_date = new Date(date)

        		if($(this).hasClass('next'))
        			month += 1
        		else
        			month -= 1

        		if( month < 0) {
					year--
                    month = 11
        			date.setFullYear(year)
        		}
                else if(month > 11) {
                    year++
                    month = 0
                    date.setFullYear(year)
                }
                date.setDate(1)
        		date.setMonth(month)
        		render_calendar()
                settings.month_change_cb(old_date, date)
			});
        }

        function set_days_click_callback() {
            $( el ).on( "click", "span", function() {
                var events_list = self.events_list
                var index = $(this).data('event_list_index');
                if(index !== undefined) {
                    if(typeof(index) == 'number')
                        evt = events_list[index]
                    else {
                        var range = index.split(';')
                        var start = parseInt(range[0])
                        var end = parseInt(range[range.length-1])
                        evt = events_list.slice(start, end+1)
                    }
                }
                else
                    evt = false

                settings.day_click_cb(this, $(this).data('date'), evt)
            });
        }

        function add_event(evt, index, first) {
            var evt_date = evt.date
            var evt_day = evt_date.getDate()
            if(first) {
                if(date.getMonth() != evt_date.getMonth()
                    || date.getFullYear() != evt_date.getFullYear())
                    self.set_date(evt_date)
                else if(!already_render)
                    render_calendar()
            }

            var $day = $($days_els[evt_day-1]).addClass('event')

            if($day.data('event_list_index') !== undefined) {
                start_index = $day.data('event_list_index')
                end_index = index
                index = start_index + ';' + end_index
            }
            $day.data('event_list_index', index)
        }

        this.set_date = function(new_date) {
            date = new_date
            month = date.getMonth()
            year = date.getFullYear()
            render_calendar()
        }

        this.set_events = function(events_list) {
            var first = true
            for(var i=0; i < events_list.length; i++) {
                add_event(events_list[i], i, first)
                first = false
            }
            self.events_list = events_list
        }

        if( settings.auto_render )
            render_calendar()

        set_next_prev_links()
        set_days_click_callback()

        this.css({
            width: settings.width,
            height: settings.height
        });

        return this
    };

}( jQuery ));
