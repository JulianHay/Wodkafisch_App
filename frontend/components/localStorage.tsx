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

const downloadData = async (url, localPath) => {
    const downloadURL = url.includes("wodkafisch") ? url : 'https:www.wodkafis.ch/media/' + url
    const { uri } = await FileSystem.downloadAsync(downloadURL, localPath);
    return uri;
};

const checkLocalData = async (newData,key:string) => {
  try {
    const existingData = await getFromLocal(key) || [];

    const uniqueNewItems = newData.filter((newItem) => {
      return !existingData.some((existingItem) => existingItem.id === newItem.id);
    });

    Object.keys(existingData).forEach((key) => {
      if (!newData.hasOwnProperty(key)) {
        delete existingData[key];
      }
    });

    await saveToLocal(key, existingData);

    return {existingData:existingData,newData:uniqueNewItems}
  } catch (error) {
    console.error('Error checking local data:', error);
  }
 }

const updateLocalData = async (newData,existingData,key:string,url:string) => {
  try {
    
    // const existingData = await getFromLocal(key) || [];

    // const uniqueNewItems = newData.filter((newItem) => {
    //   return !existingData.some((existingItem) => existingItem.id === newItem.id);
    // });

    const newItems = await Promise.all(
      newData.map(async (newItem) => {

        const localImagePath = `${FileSystem.documentDirectory}${newItem.id}.jpg`;

        const isImageDownloaded = await FileSystem.getInfoAsync(localImagePath);

        if (!isImageDownloaded.exists) {
          const localUri = await downloadData(newItem[url], localImagePath);
          newItem.localPath = localUri;
        } else {
          newItem.localPath = `${localImagePath}`;
        }
        return newItem;
      })
    );

    const updatedData = [...existingData, ...newItems];
    await saveToLocal(key, updatedData);

  } catch (error) {
    console.error('Error updating local data:', error);
  }
};

export {updateLocalData,saveToLocal,getFromLocal,checkLocalData}