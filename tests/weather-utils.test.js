const assert = require('node:assert/strict')
const { test } = require('node:test')
const geocode = require('../src/utils/geocode')
const forecast = require('../src/utils/forecast')

process.env.MAPBOX_ACCESS_TOKEN = 'test-mapbox-token'
process.env.WEATHERSTACK_ACCESS_KEY = 'test-weatherstack-key'

const withFetch = async (handler, run) => {
    const originalFetch = global.fetch
    global.fetch = handler
    try {
        await run()
    } finally {
        global.fetch = originalFetch
    }
}

const withoutEnv = async (name, run) => {
    const value = process.env[name]
    delete process.env[name]
    try {
        await run()
    } finally {
        if (value === undefined) {
            delete process.env[name]
        } else {
            process.env[name] = value
        }
    }
}

const call = (fn, ...args) => new Promise(resolve => {
    fn(...args, (error, data) => resolve({ error, data }))
})

test('geocode returns coordinates and location for a matching address', async () => {
    await withFetch(async () => ({
        json: async () => ({
            features: [{ center: [-73.9, 40.7], place_name: 'New York' }]
        })
    }), async () => {
        assert.deepEqual(await call(geocode, 'New York'), {
            error: undefined,
            data: {
                latitude: 40.7,
                longitude: -73.9,
                location: 'New York'
            }
        })
    })
})

test('geocode reports an address that has no result', async () => {
    await withFetch(async () => ({
        json: async () => ({ features: [] })
    }), async () => {
        assert.deepEqual(await call(geocode, 'unknown'), {
            error: 'Unable to find location. Please type valid location',
            data: undefined
        })
    })
})

test('forecast formats current weather data', async () => {
    await withFetch(async () => ({
        json: async () => ({
            current: {
                weather_descriptions: ['Sunny'],
                temperature: 72,
                feelslike: 73,
                humidity: 45
            }
        })
    }), async () => {
        assert.deepEqual(await call(forecast, 40.7, -73.9), {
            error: undefined,
            data: 'Sunny. It is currently 72  fahrenheit(s) out there. It feels like 73 out here. And 45 is the humidity'
        })
    })
})

test('weather utilities report network failures', async () => {
    await withFetch(async () => {
        throw new Error('network failure')
    }, async () => {
        assert.deepEqual(await call(geocode, 'New York'), {
            error: 'Unable to connect to location services',
            data: undefined
        })
        assert.deepEqual(await call(forecast, 40.7, -73.9), {
            error: 'unable to connect to location services',
            data: undefined
        })
    })
})

test('weather utilities report missing provider credentials', async () => {
    await withoutEnv('MAPBOX_ACCESS_TOKEN', async () => {
        assert.deepEqual(await call(geocode, 'New York'), {
            error: 'MAPBOX_ACCESS_TOKEN is not configured',
            data: undefined
        })
    })
    await withoutEnv('WEATHERSTACK_ACCESS_KEY', async () => {
        assert.deepEqual(await call(forecast, 40.7, -73.9), {
            error: 'WEATHERSTACK_ACCESS_KEY is not configured',
            data: undefined
        })
    })
})
