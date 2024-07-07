import {useDayjs} from '#dayjs'
const dayjs = useDayjs()
export function calcAge(birthday: string): number {
  return dayjs().diff(dayjs(birthday), 'year');
}
