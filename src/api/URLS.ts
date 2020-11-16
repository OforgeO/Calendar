import { BaseRouter } from "@react-navigation/native";

const BASE_URL = 'http://3.15.170.230/api';
const BASE_LINK = 'http://3.15.170.230';
export const URLS = {
    image: BASE_URL + '/images/',
    stamp: 'http://3.15.170.230/api/images/stamps/',

    LOGIN: BASE_URL + '/users/login',
    UPDATE_PROFILE: BASE_URL + '/users',

    GET_CALENDAR: BASE_URL + '/calendars/?organized=true',
    GET_CALENDAR_ALARM: BASE_URL + '/calendars/mine/alarms',
    GET_CALENDAR_UNORGANIZED: BASE_URL + '/calendars',
    CALENDAR_CREATE: BASE_URL + '/calendars',
    CALENDAR_UPDATE: BASE_URL + '/calendars/',
    CALENDAR_DELETE: BASE_URL + '/calendars/',

    GET_EVENTS: BASE_URL + '/calendars/',
    EVENT_CREATE: BASE_URL + '/calendars/',
    EVENT_UPDATE: BASE_URL + '/calendars/',
    EVENT_DELETE: BASE_URL + '/calendars/',

    INVITE: BASE_URL + '/calendars/',
    SHARE: BASE_LINK + '/calendars/',
    CHANGE_DISPLAY_ORDER: BASE_URL + '/calendars/orders/',

    INVITED_CALENDER: BASE_URL + '/calendars/',

    CALENDER_DETAILS: BASE_URL + '/calendars/',


};
