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
      <span style={{ color: "orange" }}>At</span> {timePart}
    </>
  );
};



export const nameRegex = /^[A-Za-z\s]+$/;
export const MAX_NAME_LENGTH = 50;

export const PINCODE_REGEX = /^[0-9]+$/;
export const PINCODE_LENGTH = 6;


export const MAX_ADDRESS_WORDS = 300;

export const getWordCount = (text = "") =>
  text ? text.length : 0;
;

