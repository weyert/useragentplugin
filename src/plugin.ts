import { detect } from 'detect-browser'
import { PluginEvent, Meta } from '@posthog/plugin-scaffold'

export type UserAgentPluginConfiguration = {
    enable: string
    overrideUserAgentDetails?: string
}

export type UserAgentMetaInput = {
    config: UserAgentPluginConfiguration
    global: {
        enabledPlugin: boolean
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
        global.enabledPlugin = config.enable === 'true'
        global.overrideUserAgentDetails = config.overrideUserAgentDetails === 'true'
    } catch (e: unknown) {
        throw new Error('Failed to read the configuration')
    }
}

/**
 * Process the event
 */
export async function processEvent(event: PluginEventExtra, { global }: Meta<UserAgentMetaInput>) {
    // If the plugin is not enable, we skip the processing of the event
    if (!global.enabledPlugin) {
        console.warn('The useragent-plugin is not enabed.')
        return event
    }

    // If the magical property name $useragent is missing, we skip the processing of the event
    if (!event.properties.hasOwnProperty('$useragent')) {
        console.warn(`UserAgentPlugin.processEvent(): Event is missing $useragent`)
        return event
    }

    // Extrat user agent from event properties
    const userAgent = `${event.properties.$useragent}`

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

    if (!global.overrideUserAgentDetails && hasBrowserProperties) {
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
