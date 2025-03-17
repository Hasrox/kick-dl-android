export const fetchClipsPage = async (channelName, cursor = 0, sortBy = 'date', timeFilter = 'all') => {
    const apiUrl = `https://kick.com/api/v2/channels/${channelName}/clips?cursor=${cursor}&sort=${sortBy}&time=${timeFilter}`;
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching clips:", error);
      throw error;
    }
  };

