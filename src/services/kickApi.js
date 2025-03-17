export const fetchClipsPage = async (channelName, cursor = null, sortBy = 'view', timeFilter = 'all') => {
  let apiUrl = `https://kick.com/api/v2/channels/${channelName}/clips?sort=${sortBy}&time=${timeFilter}`;
  if (cursor) {
    apiUrl += `&cursor=${cursor}`;
  }
  
  console.log(`Fetching clips URL: ${apiUrl}`);
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    console.log(`Fetched ${data.clips?.length || 0} clips, nextCursor: ${data.nextCursor || 'none'}`);
    return data;
  } catch (error) {
    console.error("Error fetching clips:", error);
    throw error;
  }
};
