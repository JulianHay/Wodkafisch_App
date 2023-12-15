import * as FileSystem from 'expo-file-system';

const saveToLocal = async (key, value) => {
  try {
    await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + `${key}.json`, JSON.stringify(value), {
      encoding: FileSystem.EncodingType.UTF8,
    });
  } catch (error) {
    console.error('Error saving to local storage:', error);
    throw error;
  }
};

const getFromLocal = async (key) => {
  try {
    const path = FileSystem.documentDirectory + `${key}.json`;
    const exists = await FileSystem.getInfoAsync(path);
    if (exists.exists) {
      const content = await FileSystem.readAsStringAsync(path, { encoding: FileSystem.EncodingType.UTF8 });
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.error('Error getting from local storage:', error);
    throw error;
  }
};

const downloadData = async (url) => {
    

    const downloadURL = 'https:www.wodkafis.ch/media/' + url
    const { uri } = await FileSystem.downloadAsync(downloadURL, FileSystem.documentDirectory+url.replace('/', '_'));
    return uri;
};

const fileExists = async (filename) => {
  try {
    const filePath = FileSystem.documentDirectory + filename;

    const fileInfo = await FileSystem.getInfoAsync(filePath);

    if (fileInfo.exists) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
};

const clearStorage = async () => {
  try {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);

    for (const file of files) {
      const filePath = FileSystem.documentDirectory + file;
      await FileSystem.deleteAsync(filePath, { idempotent: true });
    }

    console.log('Entire storage cleared successfully.');

  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
const deleteFromLocal = async (key) => {
  try {
    const path = FileSystem.documentDirectory + `${key}.json`;
    await FileSystem.deleteAsync(path, { idempotent: true });
    console.log(`Deleted ${key} cleared successfully.`);

  } catch (error) {
    console.error(`Error while deleting ${key}:`, error);
  }
}
export {saveToLocal,getFromLocal,clearStorage,deleteFromLocal,fileExists,downloadData}