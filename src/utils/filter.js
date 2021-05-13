import dayjs from 'dayjs';
import {FilterType} from './common';

const currentDate = dayjs();
const isCurrentDay = (dayA, dayB) => currentDate.isAfter(dayA, 'D') && currentDate.isBefore(dayB, 'D');

export const filter = {
  [FilterType.FUTURE]: (points) => points.filter((point) => {
    const isFuture = currentDate.isBefore(point.date_from, 'D') || currentDate.isSame(point.date_from, 'D');

    return isFuture || isCurrentDay(point.date_from, point.date_to);
  }),
  [FilterType.PAST]: (points) =>
    points.filter((point) => {
      const isPast = currentDate.isAfter(point.date_to, 'D');

      return isPast || isCurrentDay(point.date_from, point.date_to);
    }),
};
