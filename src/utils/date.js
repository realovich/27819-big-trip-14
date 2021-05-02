import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const calculateDuration = (dateFrom, dateTo) => {
  const durationValue = dateTo - dateFrom;
  const days = dayjs.duration(durationValue).$d.days;
  const hours = dayjs.duration(durationValue).$d.hours;
  const minutes = dayjs.duration(durationValue).$d.minutes;

  if (minutes && !hours && !days) {
    return `${minutes}M`;
  } else if (minutes && hours && !days) {
    return `${hours}H ${minutes}M`;
  }

  return `${days}D ${hours}H ${minutes}M`;
};

export const formatDate = (date, format) => {
  if (!date || !format) {
    return null;
  }

  return dayjs(date).format(format);
};

export const currentDate = () => {
  return dayjs();
};

export const convertDateToISO = (date) => {
  return dayjs(date).toISOString();
};
