import { detect } from 'detect-browser'
import { PluginEvent, PluginMeta, PluginConfigSchema } from '@posthog/plugin-scaffold'

export type UserAgentPluginConfiguration = {
    enable: string
    overrideUserAgentDetails?: string
}

export type PluginConfiguration = { config: UserAgentPluginConfiguration }

export function setupPlugin({ attachments, global }) {
    console.log('UserAgentPlugin.setupPlugin() global: ', global)
    console.log('UserAgentPlugin.setupPlugin() attachments: ', attachments)
}

/**
 * Process the event
 */
export async function processEvent(event: PluginEvent, meta: PluginMeta & PluginConfiguration) {
    const enabledPlugin = meta.config.enable === 'true'
    const overrideUserAgentDetails = meta.config.overrideUserAgentDetails === 'true'

    // If the plugin is not enable, we skip the processing of the event
    if (!enabledPlugin) {
        console.warn('The useragent-plugin is not enabed.')
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
