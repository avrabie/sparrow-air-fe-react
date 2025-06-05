const API_URL = 'http://localhost:8080';

/**
 * Fetches all aircraft types from the API
 * @param {string} searchTerm - Optional search term to filter aircraft types
 * @returns {Promise<Array>} - Promise resolving to an array of aircraft types
 */
export const getAllAircraftTypes = async (searchTerm = '') => {
  try {
    let url = `${API_URL}/aircraft-types`;
    
    // Add search parameter if provided
    if (searchTerm) {
      url += `?search=${encodeURIComponent(searchTerm)}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching aircraft types: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch aircraft types:', error);
    throw error;
  }
};

/**
 * Fetches a single aircraft type by its ICAO code
 * @param {string} icaoCode - The ICAO code of the aircraft type
 * @returns {Promise<Object>} - Promise resolving to the aircraft type object
 */
export const getAircraftTypeByIcaoCode = async (icaoCode) => {
  try {
    const response = await fetch(`${API_URL}/aircraft-types/${icaoCode}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching aircraft type: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch aircraft type with ICAO code ${icaoCode}:`, error);
    throw error;
  }
};

/**
 * Creates a new aircraft type
 * @param {Object} aircraftType - The aircraft type object to create
 * @returns {Promise<Object>} - Promise resolving to the created aircraft type
 */
export const createAircraftType = async (aircraftType) => {
  try {
    const response = await fetch(`${API_URL}/aircraft-types`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aircraftType),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating aircraft type: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to create aircraft type:', error);
    throw error;
  }
};