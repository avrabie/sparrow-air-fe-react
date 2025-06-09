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
 * Fetches airports from the API with pagination support
 * @param {number} page - Page number (zero-based)
 * @param {number} size - Number of items per page
 * @param {string} searchTerm - Optional search term to filter airports
 * @returns {Promise<Object>} - Promise resolving to paginated airports data
 */
export const getAirports = async (page = 0, size = 20, searchTerm = '') => {
  try {
    // If the search term is exactly 4 characters (likely an ICAO code), try to get the specific airport
    if (searchTerm && searchTerm.length === 4) {
      try {
        const airport = await getAirportByIcaoCode(searchTerm);
        // If we successfully got the airport, return it in a format compatible with pagination
        return {
          content: [airport],
          totalElements: 1,
          totalPages: 1,
          size: 1,
          number: 0
        };
      } catch (err) {
        // If we couldn't find the airport by ICAO code, continue with the regular search
        console.log(`No airport found with ICAO code ${searchTerm}, continuing with regular search: ${err.message}`);
      }
    }

    let url = `${API_URL}/airportsnew?page=${page}&size=${size}`;

    // Add search parameter if provided
    if (searchTerm) {
      // Try different parameter names that the API might support
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }

    const response = await apiFetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching airports: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch airports:', error);
    throw error;
  }
};

/**
 * Fetches a single airport by its ICAO code
 * @param {string} icaoCode - The ICAO code of the airport
 * @returns {Promise<Object>} - Promise resolving to the airport object
 */
export const getAirportByIcaoCode = async (icaoCode) => {
  try {
    const response = await apiFetch(`${API_URL}/airportsnew/${icaoCode}`);

    if (!response.ok) {
      throw new Error(`Error fetching airport: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch airport with ICAO code ${icaoCode}:`, error);
    throw error;
  }
};
