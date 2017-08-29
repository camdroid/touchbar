from TogglPy import Toggl
import argparse
from secrets import api_token
import subprocess


def apple_alert(title, msg):
    applescript = '''
        osascript -e 'display notification "{}" with title "{}"'
    '''.format(msg, title)
    subprocess.call(applescript, shell=True)


def main():
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group()
    group.add_argument('--start', action='store_true')
    group.add_argument('--stop', action='store_true')
    args = parser.parse_args()

    toggl = Toggl()
    toggl.setAPIKey(api_token)

    if args.stop:
        currentTimer = toggl.currentRunningTimeEntry()['data']
        if currentTimer:
            res = toggl.stopTimeEntry(currentTimer['id'])['data']

            apple_alert('Toggl', 'Stopped timer `{}`'.format(res['description']))
            print(res)
        else:
            apple_alert('Toggl', 'No timer to stop')


if __name__ == '__main__':
    main()
