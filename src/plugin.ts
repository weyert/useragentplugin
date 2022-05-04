import { detect } from 'detect-browser'
import { PluginEvent, Meta } from '@posthog/plugin-scaffold'

export type UserAgentPluginConfiguration = {
    enable: string
    enableSegmentAnalyticsJs?: string
    overrideUserAgentDetails?: string
}

export type UserAgentMetaInput = {
    config: UserAgentPluginConfiguration
    global: {
        enabledPlugin: boolean
        enableSegmentAnalyticsJs: boolean
        overrideUserAgentDetails: boolean
    }
}

interface PluginEventExtra extends PluginEvent {
    $useragent?: string
}

/**
 * Setup of the plugin
 * @param param0 the meta data of the plugin
 */
export function setupPlugin({ config, global }: Meta<UserAgentMetaInput>) {
    try {
        global.enableSegmentAnalyticsJs = config.enableSegmentAnalyticsJs === 'true'
        global.overrideUserAgentDetails = config.overrideUserAgentDetails === 'true'
    } catch (e: unknown) {
        throw new Error('Failed to read the configuration')
    }
}

/**
 * Process the event
 */
export async function processEvent(event: PluginEventExtra, { global }: Meta<UserAgentMetaInput>) {
    const availableKeysOfEvent = Object.keys(event.properties)

    let userAgent = ''

    if (global.enableSegmentAnalyticsJs) {
        // If the segment integration is enabled and the segment_userAgent is missing, we skip the processing of the event
        const hasSegmentUserAgentKey = availableKeysOfEvent.includes('segment_userAgent')
        if (!hasSegmentUserAgentKey) {
            console.warn(`UserAgentPlugin.processEvent(): Event is missing segment_userAgent`)
            return event
        }

        // Extract user agent from event properties
        userAgent = `${event.properties.segment_userAgent}`
    } else {
        // If the magical property name $useragent is missing, we skip the processing of the event
        const hasUserAgentKey =
            availableKeysOfEvent.includes('$user-agent') || availableKeysOfEvent.includes('$useragent')
        if (!hasUserAgentKey) {
            console.warn(`UserAgentPlugin.processEvent(): Event is missing $useragent or $user-agent`)
            return event
        }

        // Extract user agent from event properties
        userAgent = `${event.properties.$useragent ?? event.properties['$user-agent']}`

        // Remove the unnecessary $useragent or $user-agent user property
        delete event.properties.$useragent
        delete event.properties['$user-agent']
    }

    if (!userAgent || userAgent === '') {
        console.warn(`UserAgentPlugin.processEvent(): $useragent is empty`)
        return event
    }

    const agentInfo = detect(userAgent)

    const eventProperties = Object.keys(event.properties)
    const hasBrowserProperties = eventProperties.some((value: string) =>
        ['$browser', '$browser_version', '$os'].includes(value)
    )

    if (!global.overrideUserAgentDetails && hasBrowserProperties) {
        console.warn(
            `UserAgentPlugin.processEvent(): The event has $browser, $browser_version or $os but the option 'overrideUserAgentDetails' is not enabled.`
        )
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
