import moment from 'moment';

export const calculateDateRange = (date: string, filterType: string): { startDate: Date; endDate: Date } => {
  let startDate: moment.Moment, endDate: moment.Moment;
  
  if (filterType === 'day') {
    startDate = moment(date).utc(true);
    endDate = moment(startDate).add(1, 'day').utc(true);
  } else if (filterType === 'month') {
    startDate = moment(date).startOf('month').utc(true);
    endDate = moment(date).endOf('month').utc(true);
  } else if (filterType === 'year') {
    startDate = moment(date).startOf('year').utc(true);
    endDate = moment(date).endOf('year').utc(true);
  } else {
    throw new Error('Invalid filterType');
  }

  return { startDate: startDate.toDate(), endDate: endDate.toDate() };
};