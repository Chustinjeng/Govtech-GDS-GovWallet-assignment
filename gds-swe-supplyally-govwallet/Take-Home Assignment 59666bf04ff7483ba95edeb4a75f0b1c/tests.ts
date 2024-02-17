import * as fs from 'fs';
import { Row, deleteRedemptionFile, insertInRedemptionFile, isRedemptionFileExists, lookUp, verify } from ".";

const REDEMPTION_PATH = "redemption.csv";
const BOSS_ID_1 = "BOSS_T000000001P";
const MANAGER_ID_1 = "MANAGER_P49NK2CS3B5G"
const BOSS_ID_2 = "BOSS_6FDFMJGFV6YM";

function isExistsInCSV(filePath: string, elemToFind: string): boolean {
    const rows = fs.readFileSync(filePath, 'utf8').split('\n');
    const trimmedRows = rows.map(row => row.trim());
    const splitRows = trimmedRows.map(row => row.split(','));
    for (const row of splitRows) {
        if (row.includes(elemToFind)) {
            return true;
        }
    }
    return false;
}

/**
 * Test case to check if we are able to delete the redemption.csv file.
 * Should return true.
 * @returns true if the redemption.csv file is deleted, false is if the file is still there
 */
function test1(): boolean {
    if (isRedemptionFileExists(REDEMPTION_PATH)) {
        deleteRedemptionFile(REDEMPTION_PATH);
    }
    if (isRedemptionFileExists(REDEMPTION_PATH)) {
        return false;
    }
    return true;
}

/**
 * Test case to check if we are able to verify that a staff has not collected his/her team's gifts.
 * Should return true.
 * @returns true if the staff has not collected it, false if the staff has collected it 
 */
function test2(): boolean {
    const row: Row | undefined = lookUp(BOSS_ID_1);
    if (row == undefined) {
        return false;
    }
    const res = verify(row);
    insertInRedemptionFile(row, res);
    return res;
}

/**
 * Test case to check if the staff's details are added into the redemption csv file
 * Should return true.
 * @returns true if the staff's details are inside the file, false otherwise
 */
function test3(): boolean {
    return isExistsInCSV(REDEMPTION_PATH, BOSS_ID_1);
}

/**
 * Test case to check if we are able to verify that a staff from a different team has not collected his/her team's gifts.
 * Should return true.
 * @returns true if the staff has not collected it, false if the staff has collected it
 */
function test4(): boolean {
    const row: Row | undefined = lookUp(MANAGER_ID_1);
    if (row == undefined) {
        return false;
    }
    const res = verify(row);
    insertInRedemptionFile(row, res);
    return res;
}

/**
 * Test case to check if we are able to verify that a staff from a same team has collected his/her team's gifts.
 * Should return false.
 * @returns true if the staff has not collected it, false if the staff has collected it
 */
function test5(): boolean {
    const row: Row | undefined = lookUp(BOSS_ID_2);
    if (row == undefined) {
        return false;
    }
    const res = verify(row);
    insertInRedemptionFile(row, res);
    return res;
}

/**
 * Test case to check if the staff's details from the same team is added into the redemption.csv file.
 * Should return false.
 * @returns true if the staff's details are inside the file, false otherwise
 */
function test6(): boolean {
    return isExistsInCSV(REDEMPTION_PATH, BOSS_ID_2);
}


console.log("Result of test 1 is: expected true, actual", test1());
console.log("Result of test 2 is: expected true, actual", test2());
console.log("Result of test 3 is: expected true, actual", test3());
console.log("Result of test 4 is: expected true, actual", test4());
console.log("Result of test 5 is: expected false, actual", test5());
console.log("Result of test 6 is: expected false, actual", test6());


