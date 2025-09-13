export const formatTimeForInput = (utcTimeString) => {
  if (!utcTimeString) return "";

  try {
    const utcDate = new Date(utcTimeString);
    if (isNaN(utcDate.getTime())) return "";

    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting time for input:", error);
    return "";
  }
};

export const convertToUTCTime = (localTimeString) => {
  if (!localTimeString) return "";

  try {
    const localDate = new Date(localTimeString);
    if (isNaN(localDate.getTime())) return "";
    return localDate.toISOString();
  } catch (error) {
    console.error("Error converting to UTC time:", error);
    return localTimeString;
  }
};

export const displayInLocalTime = (utcTimeString, options = {}) => {
  if (!utcTimeString) return "";

  try {
    const utcDate = new Date(utcTimeString);
    if (isNaN(utcDate.getTime())) return "";

    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      ...options
    };

    return utcDate.toLocaleString(undefined, defaultOptions);
  } catch (error) {
    console.error("Error displaying local time:", error);
    return utcTimeString;
  }
};

export const displayInTimezone = (utcTimeString, timeZone, options = {}) => {
  if (!utcTimeString) return "";

  try {
    const utcDate = new Date(utcTimeString);
    if (isNaN(utcDate.getTime())) return "";

    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timeZone,
      ...options
    };

    return utcDate.toLocaleString(undefined, defaultOptions);
  } catch (error) {
    console.error(`Error displaying time in timezone ${timeZone}:`, error);
    return utcTimeString;
  }
};

export const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error("Error getting user timezone:", error);
    return 'UTC';
  }
};

export const getTimezoneOffset = () => {
  const offset = new Date().getTimezoneOffset();
  return -offset / 60;
};

export const formatTimeWithTimezone = (utcTimeString) => {
  if (!utcTimeString) return "";

  try {
    const utcDate = new Date(utcTimeString);
    if (isNaN(utcDate.getTime())) return "";

    const localTime = utcDate.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const timezone = getUserTimezone();
    const offset = getTimezoneOffset();
    const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;

    return `${localTime} (${timezone}, UTC${offsetStr})`;
  } catch (error) {
    console.error("Error formatting time with timezone:", error);
    return utcTimeString;
  }
};

export const formatCountdown = (utcTimeString) => {
  if (!utcTimeString) return "Unknown";

  try {
    const utcDate = new Date(utcTimeString);
    const now = new Date();
    const duration = utcDate.getTime() - now.getTime();
    
    if (duration <= 0) return "Started";
    
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return "Starting soon";
    }
  } catch (error) {
    console.error("Error formatting countdown:", error);
    return "Unknown";
  }
};

export const isInPast = (utcTimeString) => {
  try {
    const utcDate = new Date(utcTimeString);
    return utcDate < new Date();
  } catch (error) {
    return false;
  }
};

export const isToday = (utcTimeString) => {
  try {
    const utcDate = new Date(utcTimeString);
    const now = new Date();
    return utcDate.getFullYear() === now.getFullYear() &&
           utcDate.getMonth() === now.getMonth() &&
           utcDate.getDate() === now.getDate();
  } catch (error) {
    return false;
  }
};

export const formatMobileDateTime = (utcTimeString) => {
  if (!utcTimeString) return "";

  try {
    const utcDate = new Date(utcTimeString);
    if (isNaN(utcDate.getTime())) return "";

    const day = utcDate.getDate();
    const month = utcDate.toLocaleDateString('en-US', { month: 'short' });
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');

    return `(${day} ${month}) (${hours}:${minutes})`;
  } catch (error) {
    console.error("Error formatting mobile date time:", error);
    return "";
  }
};