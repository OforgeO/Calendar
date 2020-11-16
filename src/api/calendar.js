import Axios from 'axios';
import { URLS } from './URLS';

export const getCalendar = (data) => Axios.get(URLS.GET_CALENDAR, data);

export const getCalendarAlarm = (data) => Axios.get(URLS.GET_CALENDAR_ALARM, data);

export const getCalendarUnorganized = (data) => Axios.get(URLS.GET_CALENDAR_UNORGANIZED, data);

export const addCalendar = (data) => {
	const form = new FormData();
	const photo = {
		uri: data.attachment,
		type: 'image/jpeg',
		name: 'test.jpeg',
    };
    if(data.title == '')
        form.append('title', "No Title");
    else 
        form.append('title', data.title);
	
	if (data.attachment)
		form.append('attachment', photo);
	return Axios.post(URLS.CALENDAR_CREATE, form);
};

export const updateCalendar = (data) => {
	const form = new FormData();
	const photo = {
		uri: data.attachment,
		type: 'image/jpeg',
		name: 'test.jpeg',
    };
    if(data.title == '')
        form.append('title', "No Title");
    else 
        form.append('title', data.title);
	if (data.attachment) {
		form.append('attachment', photo);
	}
	if(data.muted)
		form.append('muted', data.muted)
	return Axios.put(URLS.CALENDAR_UPDATE + data.id, form);
};

export const deleteCalendar = (data) => Axios.delete(URLS.CALENDAR_DELETE + data.calendarId);

export const invitedCalender = (data) => Axios.delete(URLS.INVITED_CALENDER + `${data.calendarId}/invite/revoke`);

export const invite = (data) => Axios.post(URLS.INVITE + `${data.calendarId}/invite/` + `${data.inviteId}`);

export const updateProfile = (data) => {
	const form = new FormData();
	const photo = {
		uri: data.attachment,
		type: 'image/jpeg',
		name: 'test.jpeg'
	}
	if(data.name)
		form.append('name', data.name);
	if (data.attachment)
		form.append('attachment', photo);
	return Axios.put(URLS.UPDATE_PROFILE, form)
};

export const changDisplayOrder = (data) => Axios.put(URLS.CHANGE_DISPLAY_ORDER + `${data.srcId}/` + ` ${data.dstId}`);

export const calenderDetails = (data) => Axios.get(URLS.CALENDER_DETAILS + `${data.calendarId}`);


