import { detect } from 'detect-browser'
import { PluginEvent, Meta } from '@posthog/plugin-scaffold'

export type UserAgentPluginConfiguration = {
    enable: string
    enableSegmentAnalyticsJs?: string
    overrideUserAgentDetails?: string
    debugMode?: string
}

export type UserAgentMetaInput = {
    config: UserAgentPluginConfiguration
    global: {
        enabledPlugin: boolean
        enableSegmentAnalyticsJs: boolean
        overrideUserAgentDetails: boolean
        debugMode: boolean
    }
}

interface PluginEventExtra extends PluginEvent {
    $useragent?: string
}

/**
 * Setup of the plugin
 * @param param0 the metadata of the plugin
 */
export function setupPlugin({ config, global }: Meta<UserAgentMetaInput>) {
    try {
        global.enableSegmentAnalyticsJs = config.enableSegmentAnalyticsJs === 'true'
        global.overrideUserAgentDetails = config.overrideUserAgentDetails === 'true'
        global.debugMode = config.debugMode === 'true'
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
            if (global.debugMode) {
                console.warn(`UserAgentPlugin.processEvent(): Event is missing segment_userAgent`)
            }

            return event
        }

        // Extract user agent from event properties
        userAgent = `${event.properties.segment_userAgent}`
    } else {
        // If the magical property name $useragent is missing, we skip the processing of the event
        const hasUserAgentKey =
            availableKeysOfEvent.includes('$user-agent') || availableKeysOfEvent.includes('$useragent') || availableKeysOfEvent.includes('$user_agent')
        if (!hasUserAgentKey) {
            if (global.debugMode) {
                console.warn(`UserAgentPlugin.processEvent(): Event is missing $useragent or $user-agent`)
            }

            return event
        }

        // Extract user agent from event properties
        if (event.properties.$useragent) {
            userAgent = event.properties.$useragent
        } else if (event.properties['$user-agent']) {
            userAgent = event.properties['$user-agent']
        } else if (event.properties.$user_agent) {
            userAgent = event.properties.$user_agent
        }

        // Remove the unnecessary $useragent or $user-agent user property
        delete event.properties.$useragent
        delete event.properties['$user-agent']
        delete event.properties.$user_agent
    }

    if (!userAgent || userAgent === '') {
        if (global.debugMode) {
            console.warn(`UserAgentPlugin.processEvent(): $useragent is empty`)
        }

        return event
    }

    const agentInfo = detect(userAgent)
    const device = detectDevice(userAgent)
    const deviceType = detectDeviceType(userAgent)

    const eventProperties = Object.keys(event.properties)
    const hasBrowserProperties = eventProperties.some((value: string) =>
        ['$browser', '$browser_version', '$os', '$device', '$device_type'].includes(value)
    )

    if (!global.overrideUserAgentDetails && hasBrowserProperties) {
        if (global.debugMode) {
            console.warn(
                `UserAgentPlugin.processEvent(): The event has $browser, $browser_version, $os, $device, or $device_type but the option 'overrideUserAgentDetails' is not enabled.`
            )
        }

        return event
    }

    // The special Posthog property names are retrieved from:
    // https://github.com/PostHog/posthog/blob/master/frontend/src/lib/components/PropertyKeyInfo.tsx
    event.properties['$device'] = device
    event.properties['$device_type'] = deviceType

    if (agentInfo) {
        event.properties['$browser'] = agentInfo.name
        event.properties['$browser_version'] = agentInfo.version
        event.properties['$os'] = agentInfo.os
        // Custom property
        event.properties['$browser_type'] = agentInfo.type
    }

    return event
}

// detectDevice and detectDeviceType from https://github.com/PostHog/posthog-js/blob/9abedce5ac877caeb09205c4b693988fc09a63ca/src/utils.js#L808-L837
function detectDevice(userAgent: string) {
    if (/Windows Phone/i.test(userAgent) || /WPDesktop/.test(userAgent)) {
        return 'Windows Phone'
    } else if (/iPad/.test(userAgent)) {
        return 'iPad'
    } else if (/iPod/.test(userAgent)) {
        return 'iPod Touch'
    } else if (/iPhone/.test(userAgent)) {
        return 'iPhone'
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(userAgent)) {
        return 'BlackBerry'
    } else if (/Android/.test(userAgent) && !/Mobile/.test(userAgent)) {
        return 'Android Tablet'
    } else if (/Android/.test(userAgent)) {
        return 'Android'
    } else {
        return ''
    }
}

function detectDeviceType(userAgent: string) {
    const device = detectDevice(userAgent)
    if (device === 'iPad' || device === 'Android Tablet') {
        return 'Tablet'
    } else if (device) {
        return 'Mobile'
    } else {
        return 'Desktop'
    }
}
