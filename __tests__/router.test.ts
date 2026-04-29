import request from 'supertest';
import app from '../src/app';

const mockFetch = (response: any, ok = true, statusText = 'OK') => {
    return jest.spyOn(global, 'fetch').mockResolvedValue({
        ok,
        statusText,
        json: async () => response,
    } as any);
};

afterEach(() => {
    jest.restoreAllMocks();
});

describe('Bug-fix regression: dynamic routing returns 400 on valid sub-routes', () => {
    // Original bug: getEndpointControllerPath used req.baseUrl, which was empty under
    // app.use('*', router), causing all routes to throw BadRequest. Fix mounts at '/'
    // and uses req.path. This regression test ensures valid routes no longer 400 on
    // the routing layer itself.

    test('positive: POST /address/count routes to address endpoint and returns 200', async () => {
        mockFetch([{ city: 'A' }, { city: 'B' }]);
        const res = await request(app)
            .post('/address/count')
            .send({ city: 'Rochester' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('body');
        expect(res.body.body).toEqual({ count: 2 });
    });

    test('positive: POST /address/request routes to address endpoint and returns 200', async () => {
        const data = [{ city: 'Rochester', zipcode: '14623' }];
        mockFetch(data);
        const res = await request(app)
            .post('/address/request')
            .send({ city: 'Rochester' });
        expect(res.status).toBe(200);
        expect(res.body.body).toEqual(data);
    });

    test('positive: POST /zipcode/city routes to zipcode endpoint and returns 200', async () => {
        mockFetch([{ city: 'Rochester', zipcode: '14623' }]);
        const res = await request(app)
            .post('/zipcode/city')
            .send({ zipcode: '14623' });
        expect(res.status).toBe(200);
        expect(res.body.body).toEqual({ city: 'Rochester' });
    });

    test('negative: POST /zipcode/city without zipcode returns 400', async () => {
        const res = await request(app)
            .post('/zipcode/city')
            .send({ city: 'Rochester' });
        expect(res.status).toBe(400);
        expect(res.body.body).toHaveProperty('message');
    });

    test('negative: POST /unknownresource still returns 400 (unknown sub-route)', async () => {
        const res = await request(app)
            .post('/unknownresource/anything')
            .send({});
        expect(res.status).toBe(400);
    });

    test('negative: GET /health still works (regression for non-router routes)', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.text).toBe('OK\n');
    });
});

describe('Zipcode endpoint integration', () => {
    test('positive: returns single city record only', async () => {
        mockFetch([
            { city: 'Rochester', zipcode: '14623', state: 'NY', street: 'Main St' }
        ]);
        const res = await request(app)
            .post('/zipcode/city')
            .send({ zipcode: '14623' });
        expect(res.status).toBe(200);
        expect(res.body.body).toEqual({ city: 'Rochester' });
        // Verify no extra fields leak through
        expect(res.body.body).not.toHaveProperty('zipcode');
        expect(res.body.body).not.toHaveProperty('state');
        expect(res.body.body).not.toHaveProperty('street');
    });

    test('error: upstream down returns 400 with error message (not 500 leak)', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValue(new Error('ECONNREFUSED'));
        const res = await request(app)
            .post('/zipcode/city')
            .send({ zipcode: '14623' });
        expect(res.status).toBe(400);
        expect(res.body.body.message).toContain('ECONNREFUSED');
    });

    test('error: upstream returns no results, returns 400 with helpful message', async () => {
        mockFetch([]);
        const res = await request(app)
            .post('/zipcode/city')
            .send({ zipcode: '00000' });
        expect(res.status).toBe(400);
        expect(res.body.body.message).toContain('No city found');
    });
});

describe('Address distance endpoint integration', () => {
    test('positive: returns KM and M for two upstream addresses', async () => {
        mockFetch([
            { latitude: '0', longitude: '0' },
            { latitude: '1', longitude: '0' },
        ]);
        const res = await request(app)
            .post('/address/distance')
            .send({ city: 'X' });
        expect(res.status).toBe(200);
        expect(res.body.body).toHaveProperty('KM');
        expect(res.body.body).toHaveProperty('M');
    });

    test('error: rejects with 400 when upstream returns insufficient addresses', async () => {
        mockFetch([{ latitude: '0', longitude: '0' }]);
        const res = await request(app)
            .post('/address/distance')
            .send({ city: 'X' });
        expect(res.status).toBe(400);
    });
});
