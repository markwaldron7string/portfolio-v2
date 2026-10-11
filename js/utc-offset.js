const cheyenneOffset = document.getElementById('cheyenne-offset');
if(cheyenneOffset){
  const timeZone = cheyenneOffset.dataset.timeZone || 'America/Denver';

  const formatUtcOffset = (date) => {
    try{
      const offsetPart = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'shortOffset',
        hour: 'numeric'
      }).formatToParts(date).find((part) => part.type === 'timeZoneName');

      if(offsetPart?.value){
        return offsetPart.value.replace('GMT', 'UTC');
      }
    }catch(error){
      // Fall through to manual offset calculation when shortOffset is unsupported.
    }

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(date).reduce((acc, part) => {
      if(part.type !== 'literal') acc[part.type] = Number(part.value);
      return acc;
    }, {});

    const zoneTimeAsUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second
    );
    const offsetMinutes = Math.round((zoneTimeAsUtc - date.getTime()) / 60000);
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absoluteMinutes = Math.abs(offsetMinutes);
    const hours = Math.floor(absoluteMinutes / 60);
    const minutes = absoluteMinutes % 60;

    return `UTC${sign}${hours}${minutes ? `:${String(minutes).padStart(2, '0')}` : ''}`;
  };

  const updateCheyenneOffset = () => {
    const now = new Date();
    cheyenneOffset.textContent = formatUtcOffset(now);
    cheyenneOffset.title = `Louisville, OH (${timeZone}) currently ${cheyenneOffset.textContent}`;
  };

  updateCheyenneOffset();
  setInterval(updateCheyenneOffset, 15 * 60 * 1000);
}
