export const phoneValidator = (number: string):boolean =>{

    const phoneRegex = /^\d{2}\s?9\d{8}$/;
    
    const invalidNumbers: string[] = [];

    phoneRegex.test(number) ? null : invalidNumbers.push(number)

    return (invalidNumbers.length > 0 ? false : true)

}
