import * as fs from "fs";

export interface Row {
    staff_pass_id: string;
    team_name: string;
}

/**
 * A function to filter the mapping csv data based on staffID and store the data in an array.
 * @param results The array to store the filtered data in
 * @param filePath The path of the mapping csv file
 * @param staffID The staffID to filter the data by
 */
export function findRelevantDataMapping(results: Row[], filePath: any, staffID: String): void {
    try {
        const rows = fs.readFileSync(filePath, 'utf8').split('\n');
        const trimmedRows = rows.map(row => row.trim());
        const splitRows = trimmedRows.map(row => row.split(','));

        const staffHeader = splitRows[0].indexOf('staff_pass_id');
        const teamHeader = splitRows[0].indexOf('team_name');

        splitRows.slice(1, rows.length).forEach((row: string[]) => {
            const currStaffID = row[staffHeader];
            if (currStaffID === staffID) {
                // form new Row object
                const rowObj: Row = { team_name: row[teamHeader], staff_pass_id: currStaffID };
                results.push(rowObj);
            }
        });
    } catch (error) {
        console.error('Error reading file:', error);
    }
}


/**
 * A function to filter the redemption data based on teamName
 * @param filePath The file path of the redemption csv file
 * @param teamName The team name to filter the data by
 * @returns true if we cannot find the team name in the csv file; false otherwise
 */
export function findRelevantDataRedemption(filePath: any, teamName: String): boolean | undefined {
    try {
        const rows = fs.readFileSync(filePath, 'utf8').split('\n');
        const trimmedRows = rows.map(row => row.trim());
        const splitRows = trimmedRows.map(row => row.split(','));
        const teamHeader = splitRows[0].indexOf('team_name');

        for (let row of splitRows) {
            const currTeamName = row[teamHeader];
            if (currTeamName !== undefined) {
                if (currTeamName.trim() === teamName.trim()) {
                    // team name is already in csv file
                    console.log("Your team has already collected your gifts!");
                    return true;
                }
            }
        }
        return false;
    } catch (error) {
        console.log("Error reading file: ", error);
    }
}


/**
 * Function to look up the mapping files for the staffID
 * @param staffID the staffID to be found
 * @returns the row in the csv file with the staffID
 */
export function lookUp(staffID: string): Row | undefined {
    const results: Row[] = [];
    const mappingShort = "staff-id-to-team-mapping.csv";
    // check the short mapping for the staff ID first
    findRelevantDataMapping(results, mappingShort, staffID);

    const mappingLong = "staff-id-to-team-mapping-long.csv";
    // if the results array is still empty
    // check the long mapping for the staff ID next
    if (results.length == 0) {
        findRelevantDataMapping(results, mappingLong, staffID);
    }

    // if results array is empty or has more than one element
    // the query is invalid because staffID should be unique
    if (results.length == 0 || results.length > 1) {
        return undefined;
    }
    return results[0];
}


/**
 * Function to verify if the staff's team has collected the gifts.
 * Checks the redemption.csv file for the team name.
 * If team name does not exist, write the team name into the csv file.
 * @param row The row of details comprising the staffID and the team name to be searched for
 * @returns true if the team name does not exist in redemption.csv, false otherwise
 */
export function verify(row: Row | undefined): boolean {
    // undefined value of row, invalid result
    if (row === undefined) {
        return false;
    }

    const redemptionFilePath = "redemption.csv";
    const teamName = row.team_name;
    const staffPassID = row.staff_pass_id;
    const headers = ["staff_pass_id", "team_name", "redeemed_at"];
    const csvHeader = headers.join(',') + '\n';
    // check if there is a redemption file
    // if does not exist, create a new file with headers "team_name" and "redeemed_at"
    if (!fs.existsSync(redemptionFilePath)) {
        fs.writeFileSync(redemptionFilePath, csvHeader);
        // then we can add new redemption records in the file
        const timeNow = Date.now().toString();
        const csvRow = `${staffPassID}, ${teamName}, ${timeNow}\n`;
        fs.appendFileSync(redemptionFilePath, csvRow);
        return true;
    }

    // if there is a redemption file existing
    // check if the team_name has collected the gift
    const isCollected: boolean | undefined = findRelevantDataRedemption(redemptionFilePath, teamName);
    // if the team has collected the gift or the result is undefined, do not add anything to csv file and return false
    if (isCollected === undefined || isCollected) {
        return false;
    }
    const timeNow = Date.now().toString();
    const csvRow = `${staffPassID}, ${teamName}, ${timeNow}\n`;
    fs.appendFileSync(redemptionFilePath, csvRow);

    return true;
}


/**
 * Function to delete the redemption.csv file
 * @param filePath The file path to redemption.csv
 */
export function deleteRedemptionFile(filePath: string): void {
    try {
        fs.unlinkSync(filePath);
        console.log('File deleted successfully');
    } catch (err) {
        console.error('Error deleting file: ', err);
    }
}


/**
 * Function to check if the redemption.csv file exists.
 * @param filePath The file path to redemption.csv
 * @returns true if the file exists, false otherwise
 */
export function isRedemptionFileExists(filePath: string): boolean {
    if (fs.existsSync(filePath)) {
        return true;
    }
    return false;
}

