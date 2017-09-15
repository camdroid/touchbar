const {app, BrowserWindow, TouchBar} = require('electron')
const {TouchBarButton, TouchBarLabel, TouchBarSpacer} = TouchBar

const TogglClient = require('toggl-api');

const toggl = new TogglClient({apiToken: ''});
current_entry = null;
running = false;

function getCurrEntry(callback) {
    toggl.getCurrentTimeEntry(function(err, timeEntry) {
        if(timeEntry) {
            current_entry = timeEntry;
            running = true;
        } else {
            running = false;
            current_entry = null;
        }
    });
    callback(current_entry);
}

function stopEntry(entry) {
    if(entry != null) {
        console.log('Stopping time entry');
        toggl.stopTimeEntry(entry.id, function(err, obj) {
                if(err != null) {
                    console.log('couldn\'t stop entry');
                    console.log(err);
                } else {
                    console.log('stopped entry');
                }
            });
    } else {
        console.log('No time entry to stop.');
    }
}

const toggl_start_button = new TouchBarButton({
    label: 'Start Toggl',
    click: () => {
        start_date = new Date('2017-09-10');
        end_date = new Date('2017-09-13');

        console.log('Start date: ' + start_date);
        console.log('End date: ' + end_date);
        console.log('Fetching list of most recently used timers');
        toggl.getTimeEntries(start_date, end_date, function(err, timeEntries) {
            /*
             *console.log(timeEntries);
             */
            titles = [];
            timeEntries.forEach(function(entry) {
                titles.push(entry['description'].slice(0, 7));
            });
            console.log(titles);
        });
        console.log('End');
    },
});

const toggl_button = new TouchBarButton({
    label: 'Stop Toggl!',
    click: () => {
        getCurrEntry(stopEntry);
    }
});

const touchBar = new TouchBar([toggl_button, toggl_start_button]);

let window

app.once('ready', () => {
  window = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hidden-inset',
    width: 200,
    height: 200,
    backgroundColor: '#000'
  })
  window.loadURL('about:blank')
  window.setTouchBar(touchBar)
})
