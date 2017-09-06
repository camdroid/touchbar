const {app, BrowserWindow, TouchBar} = require('electron')
const {TouchBarButton, TouchBarLabel, TouchBarSpacer} = TouchBar

const TogglClient = require('toggl-api');

const toggl = new TogglClient({apiToken: ''});
current_entry = null;
running = false;

function getCurrEntry() {
    toggl.getCurrentTimeEntry(function(err, timeEntry) {
        if(timeEntry) {
            current_entry = timeEntry;
            running = true;
        } else {
            running = false;
            current_entry = null;
        }
    })
}

function stopCurrentEntry() {
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


getCurrEntry();
const toggl_button = new TouchBarButton({
    label: 'Stop Toggl!',
    click: () => {
        getCurrEntry()
        console.log('Running: '+running);
        console.log('Entry');
        console.log(current_entry);
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

})

const touchBar = new TouchBar([toggl_button]);

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
