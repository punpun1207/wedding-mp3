export function getGoogleCalendarUrl(): string {
  const title = encodeURIComponent('Lễ Cưới: Bảo Kiện & Quỳnh Anh');
  const details = encodeURIComponent(
    'Trân trọng kính mời quý khách đến tham dự lễ thành hôn của Bảo Kiện & Quỳnh Anh tại Trung tâm Hội nghị White Palace.'
  );
  const location = encodeURIComponent('White Palace, 588 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, TP. Hồ Chí Minh');
  // Date: 2020-10-23 10:00 to 2020-10-23 21:00 UTC+7 (03:00 to 14:00 UTC)
  const dates = '20201023T030000Z/20201023T140000Z';
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

export function downloadIcsFile() {
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding//BaoKienQuynhAnh//VI',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'SUMMARY:Lễ Cưới: Bảo Kiện & Quỳnh Anh',
    'DESCRIPTION:Trân trọng kính mời quý khách đến tham dự lễ cưới tại White Palace',
    'LOCATION:White Palace, 588 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, TP. Hồ Chí Minh',
    'DTSTART:20201023T030000Z',
    'DTEND:20201023T140000Z',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Dam-Cuoi-Bao-Kien-Quynh-Anh.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
