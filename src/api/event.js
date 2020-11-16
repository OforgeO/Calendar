import Axios from 'axios';
import { URLS } from './URLS';

export const getEvent = (data) => {
    return Axios.get(URLS.GET_EVENTS + `${data.calendarId}/events?year=${data.year}&month=${data.month}&private=${data.private}&tzoffset=${data.tzoffset}`, data)
}

export const addEvent = (data) => Axios.post(URLS.EVENT_CREATE + `${data.calendarId}/events`, data)

export const updateEvent = (calendarId, eventId, data) => Axios.put(URLS.EVENT_UPDATE + `${calendarId}/events/${eventId}`, data)

export const deleteEvent = (data) => Axios.delete(URLS.EVENT_DELETE + `${data.calendarId}/events/${data.eventId}`)