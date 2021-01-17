import { CacheExtension, PluginEvent, PluginMeta, StorageExtension } from '@posthog/plugin-scaffold'
import { PluginConfiguration, processEvent } from '../plugin'

describe('useragent-plugin', () => {
    test('should not process event when disabled', async () => {
        const event = { properties: {} }
        const processedEvent = await processEvent(event as any, {
            cache: {} as CacheExtension,
            storage: {} as StorageExtension,
            config: { enable: 'false', overrideUserAgentDetails: 'true' },
        })
        expect(Object.keys(processedEvent.properties)).toStrictEqual(Object.keys(event.properties))
    })

    test('should not process event when $userAgent is missing', async () => {
        const event = ({
            properties: {
                $lib: 'posthog-node',
            },
        } as unknown) as PluginEvent

        const processedEvent = await processEvent(event, {
            cache: {} as CacheExtension,
            storage: {} as StorageExtension,
            config: { enable: 'true', overrideUserAgentDetails: 'true' },
        })
        expect(Object.keys(processedEvent.properties)).toStrictEqual(['$lib'])
    })

    test('should not process event when $userAgent is empty', async () => {
        const event = ({
            properties: {
                $useragent: '',
                $lib: 'posthog-node',
            },
        } as unknown) as PluginEvent

        const processedEvent = await processEvent(event, {
            cache: {} as CacheExtension,
            storage: {} as StorageExtension,
            config: { enable: 'true', overrideUserAgentDetails: 'true' },
        })
        expect(Object.keys(processedEvent.properties)).toStrictEqual(['$lib'])
    })

    test('should add user agent details when $useragent property exists', async () => {
        const event = ({
            properties: {
                $useragent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
                $lib: 'posthog-node',
            },
        } as unknown) as PluginEvent

        const processedEvent = await processEvent(event, {
            cache: {} as CacheExtension,
            storage: {} as StorageExtension,
            config: { enable: 'true', overrideUserAgentDetails: 'true' },
        })
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
        const event = ({
            properties: {
                $browser: 'safari',
                $browser_version: '14.0',
                $os: 'macos',
                $useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:82.0) Gecko/20100101 Firefox/82.0',
                $lib: 'posthog-node',
            },
        } as unknown) as PluginEvent

        const processedEvent = await processEvent(event, {
            cache: {} as CacheExtension,
            storage: {} as StorageExtension,
            config: { enable: 'true', overrideUserAgentDetails: 'false' },
        })
        expect(processedEvent.properties).toStrictEqual(
            expect.objectContaining({
                $browser: 'safari',
                $browser_version: '14.0',
                $os: 'macos',
            })
        )
    })
})
