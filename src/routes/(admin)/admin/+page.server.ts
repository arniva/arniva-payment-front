import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, url }) => {
    let offset = url.searchParams.get('offset') || '0';
    let limit = url.searchParams.get('limit') || '10';
    console.log("offset, limit", offset, limit);

    let baseUrl = "https://payment-api.arniva.tr/v1/hareketler"

    // Construct the API URL with query parameters
    let apiUrl = `${baseUrl}?offset=${offset}&limit=${limit}`;
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