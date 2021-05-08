import dayjs from 'dayjs';
import {FilterType} from './common';

export const filter = {
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs().isAfter(point.date_from, 'D') && dayjs(point.date_from).isSame(dayjs(), 'D')),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs().isBefore(point.date_to, 'D')),
};
