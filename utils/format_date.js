function formatDate(datetime) {
    const inputDatetimeString = datetime;

    // Extract components from the input string
    const year = parseInt(inputDatetimeString.substr(0, 4), 10);
    const month = parseInt(inputDatetimeString.substr(4, 2), 10) - 1; // Months are zero-indexed
    const day = parseInt(inputDatetimeString.substr(6, 2), 10);
    const hour = parseInt(inputDatetimeString.substr(9, 2), 10);
    const minute = parseInt(inputDatetimeString.substr(11, 2), 10);
    const second = parseInt(inputDatetimeString.substr(13, 2), 10);

    // Create a Date object
    const originalDate = new Date(year, month, day, hour, minute, second);
    console.log(originalDate);
    // Add 7 hours
    originalDate.setHours(originalDate.getHours() + 7);

    // Format the date
    const formattedTime = originalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = originalDate.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Combine the formatted time and date
    const formattedDatetime = `${formattedTime} ${formattedDate}`;
    return formattedDatetime;
}

module.exports = {
    formatDate
}