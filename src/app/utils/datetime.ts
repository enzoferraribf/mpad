export const handleServerDateTime = (datetime: string | null) => {
  return datetime ? new Date(datetime).toLocaleString() : "";
};
