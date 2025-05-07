export const updateNullFields = (existingData: any, newData: any) => {
    const updatedFields: any = {};

    for (const key in newData) {
        if (
            newData[key] !== null && // La nouvelle donnée n'est pas null
            newData[key] !== undefined && // La nouvelle donnée n'est pas undefined
            (existingData[key] === 'Inconnu' || existingData[key] === undefined) // L'ancienne donnée est null ou undefined
        ) {
            updatedFields[key] = newData[key];
        }
    }

    return updatedFields;
};