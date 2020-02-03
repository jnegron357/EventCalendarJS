/****
TODO:
 - Remove foreign language objects
 - Fix JS errors
 - Rename objects where necessary for clarity
***/
"use strict";

 (function ( $ ) {

    // default localization object in EN
     const monthsAndWeekdays = {
         months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
         weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
         weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
     };

     $.fn.eventCalendar = function(options ) {

         const settings = $.extend({
             width: 400,
             height: 230,
             auto_render: true,
             entityNames: monthsAndWeekdays,
             date: new Date(),
             short_weekdays: true,
             next_link: '<a href="#"> &gt;&gt; </a>',
             prev_link: '<a href="#" class="prev"> &lt;&lt; </a>',
             month_line_class: '',
             day_click_cb: function () {
             },
             month_change_cb: function () {
             },
             month_name_click_cb: function () {
             }
         }, options);

         let entityNames = settings.entityNames;
         let date = settings.date;
         let month = date.getMonth();
         let year = date.getFullYear();
         let today = new Date();
         let el = this;
         let self = this;
         let already_render = false;

        //public properties
        this.events_list = {};

        // store each day html element so we can manipulate it easily
        let $days_els = [];

        function pad(str) {
            let max = 2;
            return str.length < max ? pad("0" + str, max) : str
        }

        // check if year is bissextile (containing or noting the extra day of a leap year)
/*
        function is_bis() {
            return ((year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0)));
        }
*/

        function get_month_nodays() {
            return (32 - new Date(year, month, 32).getDate());
        }

        function get_month_name() {
            return entityNames.months[month]
        }

        function get_days_week() {
            if(settings.short_weekdays)
                return entityNames.weekdaysShort;
            else
                return entityNames.weekdays
        }

        // get the size of a column
        function get_col_width() {
            return settings.width / 7
        }

        // render the month name line
        function render_month_line() {
            if(!$(settings.next_link).hasClass('next'))
                settings.next_link = $(settings.next_link).addClass('next')[0].outerHTML;

            let $month_name = $('<span/>').addClass('month_name_text');
            $month_name.addClass(settings.month_line_class);
            $month_name.html(get_month_name() + ' ' + date.getFullYear());

            return '<p class="month_name">' +
                    settings.prev_link + $month_name[0].outerHTML +
                    settings.next_link + '</p>';
        }

        // render de weekdays line
        function render_weekdays() {
            let weekday;
            let weekdays = get_days_week();
            let cellwidth = get_col_width();
            let $output  = $('<p/>').css({'display': 'table-row'});
            for(let i=0; i < weekdays.length; i++) {
                weekday = $("<span class='weekday " + weekdays[i] + "'>" + weekdays[i] + '</span>');
                weekday.css({width: cellwidth, display: 'table-cell'});
                $output.append(weekday);
            }
            return $output
        }

        // render all days of a month
        function render_days() {
            let nodays = get_month_nodays();
            let cellwidth = get_col_width();
            //let per_line = 7;
            let counter = 0;
            let weekday_start_month = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

            // init calendar month/year and today month/year/day
            let cmonth = date.getMonth();
            let cyear = date.getFullYear();
            let imonth = today.getMonth();
            let iyear = today.getFullYear();
            let iday = today.getDate();

            $days_els = [];

            //css
            let line_css = {'display': 'table-row'};
            let day_css = {
                'display': 'table-cell',
                'width': cellwidth
            };

            let $div_days = $('<div class="days_of_month"/>');
            let $day;
            let $line;
            for(let i = 1; i <= nodays; i++) {
                if(counter === 0) $line = $('<p/>').css(line_css);
                // if is the first day of month, lets print it below its week name
                if(i === 1 && (i-1) !== weekday_start_month) {
                    while(counter < weekday_start_month) {
                        $day = $("<span class='day-empty'/>").html('-').css(day_css);
                        $line.append($day);
                        counter++
                    }
                }

                $day = $("<span class='day'/>").html(i).css(day_css);
                $day.data('date', pad(i.toString()) + '/' + pad((month+1).toString()) + '/' + year);

                if(cmonth === imonth && cyear === iyear && i === iday)
                    $day.addClass('today');
                else if(cmonth < imonth && cyear <= iyear)
                    $day.addClass('past');
                else if(cmonth === imonth && i < iday)
                    $day.addClass('past');
                else if(cyear < iyear)
                    $day.addClass('past');

                $days_els.push($day);
                $line.append($day);
                counter++;

                if(counter === 7) {
                    $div_days.append($line);
                    counter = 0
                }
            }
            if(counter !== 0) $div_days.append($line);
            return $div_days;
        }

        // render the calendar
        function render_calendar() {
            el.html('');
            el.append(render_month_line());
            el.append(render_weekdays());
            el.append(render_days());
            already_render = true;
        }

        function set_next_prev_links() {
            $( el ).on( "click", "a.next, a.prev", function(e) {
                e.preventDefault();
                month = date.getMonth();
                year = date.getFullYear();

                let old_date = date;

                if($(this).hasClass('next'))
                    month += 1;
                else
                    month -= 1;

                if( month < 0) {
                    year--;
                    month = 11;
                    date.setFullYear(year);
                }
                else if(month > 11) {
                    year++;
                    month = 0;
                    date.setFullYear(year);
                }
                date.setDate(1);
                date.setMonth(month);
                render_calendar();
                settings.month_change_cb(old_date, date);
            });
        }

        function set_days_click_callback() {
            let evt;
            $( el ).on( "click", "span.day", function() {
                let events_list = self.events_list;
                let index = $(this).data('event_list_index');
                if(index !== undefined) {
                    if(typeof(index) == 'number')
                        evt = events_list[index];
                    else {
                        let range = index.split(';');
                        let start = parseInt(range[0]);
                        let end = parseInt(range[range.length-1]);
                        evt = events_list.slice(start, end+1);
                    }
                }
                else {
                    evt = false;
                }
                settings.day_click_cb(this, $(this).data('date'), evt);
            });
        }

        function set_month_name_click_callback() {
            $( el ).on("click", ".month_name_text", function() {
                return settings.month_name_click_cb(date, this);
            })
        }

        function add_event(evt, index, first) {
            let evt_date = evt.date;
            let evt_day = evt_date.getDate();
            let start_index;
            let end_index;
            if(first) {
                if(date.getMonth() !== evt_date.getMonth()
                    || date.getFullYear() !== evt_date.getFullYear())
                    self.set_date(evt_date);
                render_calendar();
            }

            let $day = $($days_els[evt_day-1]).addClass('event');

            if($day.data('event_list_index') !== undefined) {
                start_index = $day.data('event_list_index');
                end_index = index;
                index = start_index + ';' + end_index;
            }
            $day.data('event_list_index', index);
        }

        this.set_date = function(new_date) {
            let old_date = date;
            date = new_date;
            month = date.getMonth();
            year = date.getFullYear();
            render_calendar();

            if(old_date !== date)
                settings.month_change_cb(old_date, date)
        };

        this.set_events = function(events_list) {
            if(events_list === undefined) return;
            let first = true;
            for(let i=1; i < events_list.length; i++) {
                add_event(events_list[i], i, first);
                first = false;
            }
            if(events_list.length === 0)
                render_calendar();
            self.events_list = events_list;
        };

        this.getDate = function() {
            return date;
        };

        if( settings.auto_render )
            render_calendar();

        set_next_prev_links();
        set_days_click_callback();
        set_month_name_click_callback();

        this.css({
            width: settings.width,
            height: settings.height
        });
        return this;
    };
}( jQuery ));
