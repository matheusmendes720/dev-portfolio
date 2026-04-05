/* 
 * netlify/functions/sync-intel.js
 * The "Intelligence BFF" (Backend For Frontend)
 * Acts as the tactical bridge between raw datasets and the UI.
 */

import { COMPETITIONS_DATA } from '../../src/data/competitionsData.js';

export const handler = async (_event, _context) => {
    try {
        console.log('[BFF] Inbound synchronization request...');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                status: 'SYNC_COMPLETE',
                intel_node: 'Netlify_Edge_v2',
                data: COMPETITIONS_DATA
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'BFF_CRASHED', message: error.message })
        };
    }
};
