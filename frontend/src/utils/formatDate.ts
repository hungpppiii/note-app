export default function formatDate(date: string): string {
  return new Date(date).toLocaleString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}
