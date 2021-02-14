export const ValidEmail = (email) =>{
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
}

export const ValidPassword = (password) =>{
        return ((password != '') && (password.length > 8));
}

/**
 * @see https://en.wikipedia.org/wiki/Postcodes_in_the_United_Kingdom#Validation
 * @param string postcode 
 */
export const ValidPostcode = (postcode) =>{
        postcode = postcode.replace(/\s/g, "");
        var regex = /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/;
        return regex.test(postcode);
}

export const ValidDate = dateString => {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0,10) === dateString;
}

export const ValidDOB = (DOB) =>{

        let bIsValid = ValidDate(DOB);
        return(bIsValid);
}
