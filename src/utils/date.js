import dayjs from 'dayjs';

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

export const calculateDuration = (dateFrom, dateTo) => {
  const duration = (dateTo - dateFrom);
  const minutes = (duration / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)).toFixed(0);
  const hours = (duration / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR)).toFixed(0);
  const days = (duration / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY)).toFixed(0);

  const restOfHours = hours % HOURS_PER_DAY;
  const restOfMinutes = minutes % MINUTES_PER_HOUR;

  if (minutes < MINUTES_PER_HOUR) {
    return `${minutes}M`;
  } else if (hours < HOURS_PER_DAY) {
    return `${hours}H ${restOfMinutes}M`;
  }

  return `${days}D ${restOfHours}H ${restOfMinutes}M`;
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
