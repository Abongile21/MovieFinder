// Function to fetch data from API and store as JSON file
async function fetchAndStoreData() {
    try {
      const response = await fetch('https://dummyapi.online/api/movies');
      const data = await response.json();
  
      const jsonData = JSON.stringify(data);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'movies.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Call fetchAndStoreData to fetch from API and store as JSON
  fetchAndStoreData();
  