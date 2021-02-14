export const getLocationByPostCode = (postCode) =>{
    const url = `https://coronavirus.data.gov.uk/api/v1/code?category=postcode&search=${postCode}`;
    return(url);
}

export const getDailyStatsByArea = (areaCode) =>{
    const url = `https://coronavirus.data.gov.uk/api/v1/soa?filters=&areaType=msoa&areaCode=${areaCode}&structure=%7B%22areaCode%22:%22areaCode%22,%22release%22:%22release%22,%22newCasesBySpecimenDate%22:%5B%7B%22date%22:%22date%22,%22rollingSum%22:%22rollingSum%22,%22rollingRate%22:%22rollingRate%22,%22change%22:%22change%22,%22direction%22:%22direction%22,%22changePercentage%22:%22changePercentage%22%7D%5D%7D`;
    return(url);
}

export const getHistoricStatsByArea = (areaName) =>{
    const url = `https://api.coronavirus.data.gov.uk/v1/data?filters=areaType%3Dltla%3BareaName%3D${areaName}&structure=%7B%22date%22%3A%22date%22%2C%22name%22%3A%22areaName%22%2C%22code%22%3A%22areaCode%22%2C%22cases%22%3A%7B%22daily%22%3A%22newCasesByPublishDate%22%2C%22cumulative%22%3A%22cumCasesByPublishDate%22%7D%2C%22deaths%22%3A%7B%22daily%22%3A%22newDeathsByDeathDate%22%2C%22cumulative%22%3A%22cumDeathsByDeathDate%22%7D%7D`;
    return(url);
}

