import moment from 'moment';

export function toDateString(date: Date) {
    return moment(date).format('DD/MM/YYYY');
}

export function toTimeString(date: Date) {
    return moment(date).format('HH:mm');
}
