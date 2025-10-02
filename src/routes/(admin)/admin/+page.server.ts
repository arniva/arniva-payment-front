import type { PageServerLoad } from './$types';
import { convertQueryStringToObject } from '$lib/functions/query_convert.js';

export const load = (async ({ fetch, url }) => {
    let offset = url.searchParams.get('offset') || '0';
    let limit = url.searchParams.get('limit') || '10';
    console.log("offset, limit", offset, limit);

    let baseUrl = "https://payment-api.arniva.tr/v1/hareketler"

    // Parse the query string to get filter parameters
    const { filter } = convertQueryStringToObject(url.search);

    // Construct the API URL with query parameters
    let apiUrl = `${baseUrl}?offset=${offset}&limit=${limit}`;

    // Add filter parameter if filters exist
    if (Object.keys(filter).length > 0) {
        // Build filter string in the format expected by the API
        const filterParts: string[] = [];
        
        for (const [key, value] of Object.entries(filter)) {
            if (key === 'search' && typeof value === 'object' && value !== null) {
                // Handle search filter specially
                const searchObj = value as { column: string; value: string };
                const formattedValue = `'${searchObj.value.replace(/\s+/g, '%3B')}'`;
                filterParts.push(`${searchObj.column} co ${formattedValue}`);
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Handle range filters
                const rangeObj = value as any;
                if (rangeObj.min !== undefined) {
                    filterParts.push(`${key} ge ${rangeObj.min}`);
                }
                if (rangeObj.max !== undefined) {
                    filterParts.push(`${key} le ${rangeObj.max}`);
                }
                if (rangeObj.start) {
                    filterParts.push(`${key} ge ${rangeObj.start}`);
                }
                if (rangeObj.end) {
                    filterParts.push(`${key} le ${rangeObj.end}`);
                }
            } else if (Array.isArray(value)) {
                // Handle array filters
                filterParts.push(`${key} in ${value.join('|')}`);
            } else {
                // Handle simple equality filters
                filterParts.push(`${key} eq ${value}`);
            }
        }

        // Add the combined filter to the API URL
        if (filterParts.length > 0) {
            const filterString = filterParts.join(' and ');
            apiUrl += `&filter=${encodeURIComponent(filterString)}`;
        }
    }
    console.log("================================");
    console.log("API URL:", apiUrl);
    console.log("================================");

    try {
        const res = await fetch(apiUrl);
        if (res.ok) {
            const resJson = await res.json();
            console.log("data", resJson);
            let data = resJson.data || [];
            let meta = resJson.meta || {};
            let currentOffset = parseInt(offset);
            let currentLimit = parseInt(limit);
            let currentPage = Math.floor(currentOffset / currentLimit) + 1;
            return {
                movements: data,
                pagination: {
                    offset: currentOffset,
                    page: currentPage,
                    limit: currentLimit,
                    total: meta.total_records || 0,
                    totalPages: Math.ceil((meta.total_records || 0) / currentLimit)
                }
            };
        } else {
            console.error('Failed to fetch data:', res.statusText);
            return {
                movements: null,
                error: 'Failed to fetch data'
            };
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            movements: null,
            error: 'Error fetching data'
        };
    }
}) satisfies PageServerLoad;