from TogglPy import Toggl
import argparse
from secrets import api_token


def main():
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group()
    group.add_argument('--start', action='store_true')
    group.add_argument('--stop', action='store_true')
    args = parser.parse_args()

    toggl = Toggl()
    toggl.setAPIKey(api_token)

    currentTimer = toggl.currentRunningTimeEntry()
    print(currentTimer)

    if args.stop:
        res = toggl.stopTimeEntry(currentTimer['data']['id'])
        print(res)

    # response = toggl.request("https://www.toggl.com/api/v8/clients")
    # for client in response:
    #     print client['name']


if __name__ == '__main__':
    main()
