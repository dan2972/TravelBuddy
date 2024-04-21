import * as FileSystem from 'expo-file-system';

async function writeJsonToFile(fileName, jsonString) {
    fileName = FileSystem.documentDirectory + fileName;
    try {
        await FileSystem.writeAsStringAsync(fileName, jsonString);
        console.log('file written successfully');
    } catch (error) {
        console.log('failed to write file', error);
    }
}

async function readJsonFromFile(fileName) {
    fileName = FileSystem.documentDirectory + fileName;
    try {
        const data = await FileSystem.readAsStringAsync(fileName);
        const jsonObject = JSON.parse(data);
        return jsonObject;
    } catch (error) {
        console.log('failed to read file', error);
        return null;
    }
}

export { writeJsonToFile, readJsonFromFile };