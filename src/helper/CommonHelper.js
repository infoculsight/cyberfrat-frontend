export const formatToIST = (utcDateString) => {
  const date = new Date(utcDateString);

  const datePart = date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const timePart = date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <>
      {datePart}
      <br />
      <span style={{color:"orange"}}>At</span> {timePart}
    </>
  );
};
