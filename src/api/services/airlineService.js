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
 * Fetches a list of countries that have airlines
 * @returns {Promise<Array<string>>} - Promise resolving to an array of country names
 */
export const getCountries = async () => {
  try {
    const response = await apiFetch(`${API_URL}/gds/countries`);

    if (!response.ok) {
      throw new Error(`Error fetching countries: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    // Fallback to empty array if API call fails
    return [];
  }
};

/**
 * Fetches airlines by country from the API with pagination support
 * @param {string} country - The country to filter airlines by
 * @param {number} page - Page number (zero-based)
 * @param {number} size - Number of items per page
 * @returns {Promise<Object>} - Promise resolving to paginated airlines data
 */
export const getAirlinesByCountry = async (country, page = 0, size = 20) => {
  try {
    const url = `${API_URL}/airlinesnew/country/${encodeURIComponent(country)}?page=${page}&size=${size}`;

    const response = await apiFetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching airlines by country: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch airlines for country ${country}:`, error);
    throw error;
  }
};

/**
 * Fetches airlines from the API with pagination support
 * @param {number} page - Page number (zero-based)
 * @param {number} size - Number of items per page
 * @param {string} searchTerm - Optional search term to filter airlines
 * @returns {Promise<Object>} - Promise resolving to paginated airlines data
 */
export const getAirlines = async (page = 0, size = 20, searchTerm = '') => {
  try {
    // If the search term is exactly 3 characters (likely an ICAO code), try to get the specific airline
    if (searchTerm && searchTerm.length === 3) {
      try {
        const airline = await getAirlineByIcaoCode(searchTerm);
        // If we successfully got the airline, return it in a format compatible with pagination
        return {
          content: [airline],
          totalElements: 1,
          totalPages: 1,
          size: 1,
          number: 0
        };
      } catch (err) {
        // If we couldn't find the airline by ICAO code, continue with the regular search
        console.log(`No airline found with ICAO code ${searchTerm}, continuing with regular search: ${err.message}`);
      }
    }

    let url = `${API_URL}/airlinesnew?page=${page}&size=${size}`;

    // Add search parameter if provided
    if (searchTerm) {
      // Try different parameter names that the API might support
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }

    const response = await apiFetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching airlines: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch airlines:', error);
    throw error;
  }
};

/**
 * Fetches a single airline by its ICAO code
 * @param {string} icaoCode - The ICAO code of the airline
 * @returns {Promise<Object>} - Promise resolving to the airline object
 */
export const getAirlineByIcaoCode = async (icaoCode) => {
  try {
    const response = await apiFetch(`${API_URL}/airlinesnew/icao/${icaoCode}`);

    if (!response.ok) {
      throw new Error(`Error fetching airline: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch airline with ICAO code ${icaoCode}:`, error);
    throw error;
  }
};

/**
 * Fetches airlines by active status
 * @param {string} active - Active status ('Y' for active, 'N' for inactive)
 * @param {number} page - Page number (zero-based)
 * @param {number} size - Number of items per page
 * @returns {Promise<Object>} - Promise resolving to paginated airlines data
 */
export const getAirlinesByActiveStatus = async (active, page = 0, size = 20) => {
  try {
    const url = `${API_URL}/airlinesnew/active/${active}?page=${page}&size=${size}`;

    const response = await apiFetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching airlines by active status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch airlines with active status ${active}:`, error);
    throw error;
  }
};

/**
 * Fetches airlines by name containing a specific string
 * @param {string} nameContains - String to search for in airline names
 * @param {number} page - Page number (zero-based)
 * @param {number} size - Number of items per page
 * @returns {Promise<Object>} - Promise resolving to paginated airlines data
 */
export const getAirlinesByNameContaining = async (nameContains, page = 0, size = 20) => {
  try {
    const url = `${API_URL}/airlinesnew/name/${encodeURIComponent(nameContains)}?page=${page}&size=${size}`;

    const response = await apiFetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching airlines by name: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch airlines with name containing ${nameContains}:`, error);
    throw error;
  }
};
