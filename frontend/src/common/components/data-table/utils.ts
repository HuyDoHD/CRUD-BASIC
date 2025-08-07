import dayjs from 'dayjs';

export const defaultFilterFn = (value: any, recordValue: any, type: string) => {
  if (type === 'date') {
    return dayjs(recordValue).format('YYYY-MM-DD') === value;
  }
  if (Array.isArray(value)) {
    return value.includes(recordValue);
  }
  return recordValue?.toString().toLowerCase().includes(value.toLowerCase());
};

export const convertFiltersToQuery = (filters: Record<string, string[] | null>) => {
  const query: Record<string, string> = {};

  Object.entries(filters).forEach(([key, val]) => {
    if (!val || val.length === 0) return; // bỏ qua null hoặc mảng rỗng

    query[key] = val.join(',');
  });

  return query;
}; 
