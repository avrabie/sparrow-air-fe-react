const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Custom fetch wrapper that adds required headers to all API requests
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - The fetch response
 */
const apiFetch = async (url, options = {}) => {
  // Ensure headers object exists
  const headers = options.headers || {};

  // Add the ngrok-skip-browser-warning header
  headers['ngrok-skip-browser-warning'] = 'any value';

  // Return fetch with updated options
  return fetch(url, {
    ...options,
    headers,
  });
};

/**
 * Fetches all aircraft from the API
 * @param {string} searchTerm - Optional search term to filter aircraft
 * @returns {Promise<Array>} - Promise resolving to an array of aircraft
 */
export const getAllAircraftTypes = async (searchTerm = '') => {
  try {
    let url = `${API_URL}/aircraft`;

    // Add search parameter if provided
    if (searchTerm) {
      url += `?search=${encodeURIComponent(searchTerm)}`;
    }

    const response = await apiFetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching aircraft: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch aircraft:', error);
    throw error;
  }
};

/**
 * Fetches a single aircraft by its ICAO code
 * @param {string} icaoCode - The ICAO code of the aircraft
 * @returns {Promise<Object>} - Promise resolving to the aircraft object
 */
export const getAircraftTypeByIcaoCode = async (icaoCode) => {
  try {
    const response = await apiFetch(`${API_URL}/aircraft/${icaoCode}`);

    if (!response.ok) {
      throw new Error(`Error fetching aircraft: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch aircraft with ICAO code ${icaoCode}:`, error);
    throw error;
  }
};

/**
 * Creates a new aircraft
 * @param {Object} aircraft - The aircraft object to create
 * @returns {Promise<Object>} - Promise resolving to the created aircraft
 */
export const createAircraftType = async (aircraft) => {
  try {
    const response = await apiFetch(`${API_URL}/aircraft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aircraft),
    });

    if (!response.ok) {
      throw new Error(`Error creating aircraft: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create aircraft:', error);
    throw error;
  }
};
