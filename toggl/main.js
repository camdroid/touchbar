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

function stopCurrentEntry(current_entry) {
    if(current_entry != null) {
        console.log('Stopping time entry');
        toggl.stopTimeEntry(current_entry.id, function(err, obj) {
                if(err != null) {
                    console.log('couldn\'t stop entry');
                    console.log(err);
                } else {
                    console.log('stopped entry');
                }
            });
    }
}

const toggl_start_button = new TouchBarButton({
    label: 'Start Toggl',
    click: () => {
        console.log('Fetching list of most recently used timers');
        toggl.getTimeEntries('2017-09-13', '2017-09-14', function(err, timeEntries) {
            console.log(timeEntries);
        });
    },
});

const toggl_button = new TouchBarButton({
    label: 'Stop Toggl!',
    click: () => {
        getCurrEntry(stopCurrentEntry);
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
