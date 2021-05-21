import dayjs from 'dayjs';
import {FilterType} from './common';

const currentDate = dayjs();
const isCurrentDay = (dayA, dayB) => currentDate.isAfter(dayA, 'D') && currentDate.isBefore(dayB, 'D');

export const filter = {
  [FilterType.FUTURE]: (points) => points.filter((point) => {
    const isFuture = currentDate.isBefore(point.dateFrom, 'D') || currentDate.isSame(point.dateFrom, 'D');

    return isFuture || isCurrentDay(point.dateFrom, point.dateTo);
  }),
  [FilterType.PAST]: (points) =>
    points.filter((point) => {
      const isPast = currentDate.isAfter(point.dateTo, 'D');

      return isPast || isCurrentDay(point.dateFrom, point.dateTo);
    }),
};
