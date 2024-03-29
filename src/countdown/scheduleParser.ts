import _ from "lodash";
import { AlarmSchedule, AlarmScheduleTable } from "./types";

const THIRTY_MINUTES = 30;

export const parseSchedule = (protocol: string) => {
  const scheduleList = JSON.parse(protocol);

  const pre30AlarmList = _.chain(scheduleList)
    .map((list) => _.last(list))
    .map(getPreAlarmTime(THIRTY_MINUTES))
    .map(toLocaleString)
    .map(splitLocaleString)
    .reduce(toTable, {})
    .value();

  const endAlarmList = _.chain(scheduleList)
    .map((list) => _.last(list))
    .map((localeString: string) => new Date(localeString))
    .map(toLocaleString)
    .map(splitLocaleString)
    .reduce(toTable, {})
    .value();

  return [pre30AlarmList, endAlarmList];
};

const toTable = (acc: AlarmScheduleTable, cur: any) => {
  acc[cur.toString()] = cur as AlarmSchedule;
  return acc;
};

const getPreAlarmTime = (gapMinutes: number) => (time: string) => {
  const preAlarmDate = new Date(time);
  preAlarmDate.setMinutes(preAlarmDate.getMinutes() - gapMinutes);

  return preAlarmDate;
};

const toLocaleString = (date: Date) => {
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const splitLocaleString = (localeDate: string) => {
  const [time, ampm] = localeDate.split(" ");
  const [minute, second] = time.split(":");

  return [minute, second, ampm.toLowerCase()];
};
