import addressService from '../src/services/address.service';

const mockFetch = (response: any, ok = true, statusText = 'OK') => {
    return jest.spyOn(global, 'fetch').mockResolvedValue({
        ok,
        statusText,
        json: async () => response,
    } as any);
};

const mockFetchReject = (err: Error) => {
    return jest.spyOn(global, 'fetch').mockRejectedValue(err);
};

afterEach(() => {
    jest.restoreAllMocks();
});

describe('AddressService.count', () => {
    test('positive: returns count from upstream array', async () => {
        mockFetch([{ city: 'A' }, { city: 'B' }, { city: 'C' }]);
        const result = await addressService.count({ body: { city: 'Rochester' } });
        expect(result).toEqual({ count: 3 });
    });

    test('negative: returns count 0 when request is null', async () => {
        const fetchSpy = jest.spyOn(global, 'fetch');
        const result = await addressService.count(null);
        expect(result).toEqual({ count: 0 });
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    test('negative: returns count 0 when request is undefined', async () => {
        const result = await addressService.count(undefined);
        expect(result).toEqual({ count: 0 });
    });

    test('negative: returns count 0 when upstream returns non-array', async () => {
        mockFetch({ error: 'something weird' });
        const result = await addressService.count({ body: { city: 'X' } });
        expect(result).toEqual({ count: 0 });
    });

    test('error: throws Internal Service Error when upstream is down', async () => {
        mockFetchReject(new Error('ECONNREFUSED'));
        await expect(
            addressService.count({ body: { city: 'X' } })
        ).rejects.toThrow('Internal Service Error');
    });
});

describe('AddressService.request', () => {
    test('positive: returns parsed json from upstream', async () => {
        const data = [{ city: 'Rochester', zipcode: '14623' }];
        mockFetch(data);
        const result = await addressService.request({ body: { city: 'Rochester' } });
        expect(result).toEqual(data);
    });

    test('positive: handles missing body by sending empty object', async () => {
        const fetchSpy = mockFetch([]);
        await addressService.request(undefined);
        expect(fetchSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({ body: JSON.stringify({}) })
        );
    });

    test('error: throws when upstream responds non-ok', async () => {
        mockFetch(null, false, 'Internal Server Error');
        await expect(
            addressService.request({ body: { city: 'X' } })
        ).rejects.toThrow('Upstream error: Internal Server Error');
    });

    test('error: propagates fetch network failure', async () => {
        mockFetchReject(new Error('Network down'));
        await expect(
            addressService.request({ body: { city: 'X' } })
        ).rejects.toThrow('Network down');
    });
});

describe('AddressService.distance', () => {
    test('positive: returns object with KM and M for two valid coordinates', async () => {
        // Two points roughly 111km apart at the equator (1 degree lat)
        mockFetch([
            { latitude: '0', longitude: '0' },
            { latitude: '1', longitude: '0' },
        ]);
        const result = await addressService.distance({ body: { city: 'X' } });
        expect(result).toHaveProperty('KM');
        expect(result).toHaveProperty('M');
        expect(result.KM).toBeCloseTo(111.19, 1);
        expect(result.M).toBeCloseTo(69.09, 1);
    });

    test('positive: distance between identical points is zero', async () => {
        mockFetch([
            { latitude: '40', longitude: '-77' },
            { latitude: '40', longitude: '-77' },
        ]);
        const result = await addressService.distance({ body: { city: 'X' } });
        expect(result.KM).toBe(0);
        expect(result.M).toBe(0);
    });

    test('error: rejects when upstream returns fewer than 2 addresses', async () => {
        mockFetch([{ latitude: '0', longitude: '0' }]);
        await expect(
            addressService.distance({ body: { city: 'X' } })
        ).rejects.toThrow();
    });

    test('error: rejects when upstream is unreachable', async () => {
        mockFetchReject(new Error('Upstream down'));
        await expect(
            addressService.distance({ body: { city: 'X' } })
        ).rejects.toThrow('Upstream down');
    });
});

describe('AddressService.distUrl', () => {
    test('positive: returns parsed json array from upstream', async () => {
        const data = [{ latitude: '1', longitude: '2' }];
        mockFetch(data);
        const result = await addressService.distUrl({ body: { city: 'X' } });
        expect(result).toEqual(data);
    });

    test('error: rejects when fetch fails', async () => {
        mockFetchReject(new Error('Network failure'));
        await expect(
            addressService.distUrl({ body: { city: 'X' } })
        ).rejects.toThrow('Network failure');
    });
});
