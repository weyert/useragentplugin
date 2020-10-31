import { detect } from 'detect-browser'

export type PosthogEvent = {
    properties: Record<string, string>
}

export type UserAgentPluginConfiguration = {
    enable: boolean
    overrideUserAgentDetails?: boolean
}

export type PluginConfiguration<T> = {
    config: T
}

/**
 * Process the event
 */
async function processEvent(event: PosthogEvent, { config }: PluginConfiguration<UserAgentPluginConfiguration>) {
    const { enable = false, overrideUserAgentDetails = false } = config

    // If the plugin is not enable, we skip the processing of the event
    if (!enable) {
        return event
    }

    // If the magical property name $useragent is missing, we skip the processing of the event
    if (!event.properties.hasOwnProperty('$useragent')) {
        return event
    }

    // Extrat user agent from event properties
    const userAgent = event.properties.$useragent

    // Remove the unnecessary $useragent user property
    delete event.properties.$useragent

    if (!userAgent || userAgent === '') {
        return event
    }

    const agentInfo = detect(userAgent)
    const eventProperties = Object.keys(event.properties)
    const hasBrowserProperties = eventProperties.some((value: string) =>
        ['$browser', '$browser_version', '$os'].includes(value)
    )
    if (!overrideUserAgentDetails && hasBrowserProperties) {
        return event
    }

    // The special Posthog property names are retrieved from:
    // https://github.com/PostHog/posthog/blob/d92e533dd557694936c469f9fb1acb5d6f759334/frontend/src/lib/components/PropertyKeyInfo.js
    event.properties['$browser'] = agentInfo.name
    event.properties['$browser_version'] = agentInfo.version
    event.properties['$os'] = agentInfo.os
    // Custom
    event.properties['$browser_type'] = agentInfo.type
    return event
}

export { processEvent }
