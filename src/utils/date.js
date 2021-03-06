import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const formatDuration = (duration) => {
  const days = dayjs.duration(duration).asDays().toFixed(0);
  const hours = dayjs.duration(duration).hours();
  const minutes = dayjs.duration(duration).minutes();

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

export const getCurrentDate = () => {
  return dayjs().toDate();
};

export const convertDateToISO = (date) => {
  return dayjs(date).toISOString();
};

export const sortDates = (dateA, dateB) => dayjs(dateA).diff(dayjs(dateB));

export const isDatesEqual = (dateA, dateB) => dayjs(dateA).isSame(dateB, 'D');
