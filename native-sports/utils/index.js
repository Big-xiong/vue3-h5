import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';

dayjs.extend(duration);

export function getPlayingTime(time) {
  const now = dayjs();
  const start = dayjs(time).add(8, 'hours');
  const duration = dayjs.duration(now.diff(start));

  return `${duration.get('hour') ? `${duration.get('hours')}:` : ''}${duration.minutes()}:${duration.seconds()}`;
}
