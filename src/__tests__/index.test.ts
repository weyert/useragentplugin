import { PosthogEvent, processEvent } from '../plugin'

describe('useragent-plugin', () => {
    test('should not process event when disabled', async () => {
        const event: PosthogEvent = {}
        expect(await processEvent(event, { config: { enable: false } })).toStrictEqual(event)
    })

    test('should not process event when $userAgent is missing', async () => {
        const event: PosthogEvent = {
            properties: {
                $lib: 'posthog-node',
            },
        }

        const processedEvent = await processEvent(Object.assign({}, event), { config: { enable: true } })
        expect(Object.keys(processedEvent.properties)).toStrictEqual(['$lib'])
    })

    test('should not process event when $userAgent is empty', async () => {
        const event: PosthogEvent = {
            properties: {
                $useragent: '',
                $lib: 'posthog-node',
            },
        }

        const processedEvent = await processEvent(Object.assign({}, event), { config: { enable: true } })
        expect(Object.keys(processedEvent.properties)).toStrictEqual(['$lib'])
    })

    test('should add user agent details when $useragent property exists', async () => {
        const event: PosthogEvent = {
            properties: {
                $useragent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
                $lib: 'posthog-node',
            },
        }

        const processedEvent = await processEvent({ ...event }, { config: { enable: true } })
        expect(Object.keys(processedEvent.properties)).toStrictEqual([
            '$lib',
            '$browser',
            '$browser_version',
            '$os',
            '$browser_type',
        ])
        expect(processedEvent.properties).toStrictEqual(
            expect.objectContaining({
                $browser: 'safari',
                $browser_version: '14.0.0',
                $os: 'Mac OS',
            })
        )
    })

    test('should not override existing properties when overrideUserAgentDetails is disabled', async () => {
        const event: PosthogEvent = {
            properties: {
                $browser: 'safari',
                $browser_version: '14.0',
                $os: 'macos',
                $useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:82.0) Gecko/20100101 Firefox/82.0',
                $lib: 'posthog-node',
            },
        }

        const processedEvent = await processEvent(
            { ...event },
            { config: { enable: true, overrideUserAgentDetails: false } }
        )
        expect(processedEvent.properties).toStrictEqual(
            expect.objectContaining({
                $browser: 'safari',
                $browser_version: '14.0',
                $os: 'macos',
            })
        )
    })
})
