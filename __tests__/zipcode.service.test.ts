import zipcodeService from '../src/services/zipcode.service';

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

describe('ZipcodeService.getCityByZipcode', () => {
    test('positive: returns city for valid zipcode', async () => {
        mockFetch([{ city: 'Rochester', zipcode: '14623' }]);
        const result = await zipcodeService.getCityByZipcode({ zipcode: '14623' });
        expect(result).toBe('Rochester');
    });

    test('positive: only sends zipcode upstream, not extra fields', async () => {
        const fetchSpy = mockFetch([{ city: 'Rochester' }]);
        await zipcodeService.getCityByZipcode({ zipcode: '14623', city: 'IGNORED', state: 'NY' });
        expect(fetchSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                body: JSON.stringify({ zipcode: '14623' }),
            })
        );
    });

    test('positive: still returns city when extra fields are present (warns and continues)', async () => {
        mockFetch([{ city: 'Rochester' }]);
        const result = await zipcodeService.getCityByZipcode({ zipcode: '14623', street: 'Main' });
        expect(result).toBe('Rochester');
    });

    test('positive: coerces numeric zipcode to string', async () => {
        const fetchSpy = mockFetch([{ city: 'Rochester' }]);
        await zipcodeService.getCityByZipcode({ zipcode: 14623 });
        expect(fetchSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                body: JSON.stringify({ zipcode: '14623' }),
            })
        );
    });

    test('negative: throws when request body is null', async () => {
        await expect(
            zipcodeService.getCityByZipcode(null)
        ).rejects.toThrow('zipcode is required');
    });

    test('negative: throws when request body is undefined', async () => {
        await expect(
            zipcodeService.getCityByZipcode(undefined)
        ).rejects.toThrow('zipcode is required');
    });

    test('negative: throws when zipcode is missing from body', async () => {
        await expect(
            zipcodeService.getCityByZipcode({ city: 'Rochester' })
        ).rejects.toThrow('zipcode is required');
    });

    test('negative: throws when zipcode is empty string', async () => {
        await expect(
            zipcodeService.getCityByZipcode({ zipcode: '   ' })
        ).rejects.toThrow('zipcode cannot be empty');
    });

    test('negative: throws when zipcode is null', async () => {
        await expect(
            zipcodeService.getCityByZipcode({ zipcode: null })
        ).rejects.toThrow('zipcode is required');
    });

    test('error: throws when upstream returns non-ok status', async () => {
        mockFetch(null, false, 'Service Unavailable');
        await expect(
            zipcodeService.getCityByZipcode({ zipcode: '14623' })
        ).rejects.toThrow('Upstream error: Service Unavailable');
    });

    test('error: throws when upstream returns empty array', async () => {
        mockFetch([]);
        await expect(
            zipcodeService.getCityByZipcode({ zipcode: '99999' })
        ).rejects.toThrow('No city found for zipcode: 99999');
    });

    test('error: throws when upstream returns non-array', async () => {
        mockFetch({ unexpected: 'shape' });
        await expect(
            zipcodeService.getCityByZipcode({ zipcode: '14623' })
        ).rejects.toThrow('No city found for zipcode: 14623');
    });

    test('error: throws when upstream record is missing city field', async () => {
        mockFetch([{ zipcode: '14623' }]);
        await expect(
            zipcodeService.getCityByZipcode({ zipcode: '14623' })
        ).rejects.toThrow('City data unavailable for zipcode: 14623');
    });

    test('error: propagates network failure (uncaught upstream exception)', async () => {
        mockFetchReject(new Error('ECONNREFUSED'));
        await expect(
            zipcodeService.getCityByZipcode({ zipcode: '14623' })
        ).rejects.toThrow('ECONNREFUSED');
    });
});
