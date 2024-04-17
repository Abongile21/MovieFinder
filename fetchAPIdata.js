import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';

async function fetchAndStoreData() {
    try {
        const response = await fetch('https://dummyapi.online/api/movies');
        const data = await response.json();

        const jsonData = JSON.stringify(data);
        await writeFile('movies.json', jsonData);

        console.log('Data fetched and stored as movies.json');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call fetchAndStoreData to fetch from API and store as JSON
fetchAndStoreData();
