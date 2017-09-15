const {app, BrowserWindow, TouchBar} = require('electron')
const {TouchBarButton, TouchBarLabel, TouchBarSpacer} = TouchBar

const TogglClient = require('toggl-api');

const toggl = new TogglClient({apiToken: ''});
current_entry = null;
running = false;

let window

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

    console.log('Current entry: ' + current_entry);
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

function getTitles(start_date, end_date, callback) {
    buttons = [];
    toggl.getTimeEntries(start_date, end_date, function(err, timeEntries) {
        timeEntries.forEach(function(entry) {
            console.log('Entry: ' + entry);
            button_title = entry['description'].slice(0, 7);
            button = new TouchBarButton({
                label: button_title
            });
            buttons.push(button);
        });
        callback(buttons);
    });
}

function setTouchBarButtons(buttons) {
    console.log('Keys: ' + Object.keys(buttons[0]));
    button_titles = [];
    buttons.forEach(function(button) {
        if(!button_titles.includes(button.label)) {
            button_titles.push(button.label);
        }
    });
    console.log('Buttons: ' + button_titles);
    const touchBar = new TouchBar(buttons);
    window.setTouchBar(touchBar);
}

const toggl_start_button = new TouchBarButton({
    label: 'Start Toggl',
    click: () => {
        start_date = new Date('2017-09-14');
        end_date = new Date('2017-09-16');

        console.log('Fetching list of most recently used timers');
        getTitles(start_date, end_date, setTouchBarButtons);
    },
});

const toggl_button = new TouchBarButton({
    label: 'Stop Toggl!',
    click: () => {
        getCurrEntry(stopEntry);
    }
});

const touchBar = new TouchBar([toggl_button, toggl_start_button]);

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
