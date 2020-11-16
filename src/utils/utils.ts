import * as Sentry from '@sentry/react-native';

export function padLeft(nr, n, str?) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}

export function sentryMessage(message: string, extra: any) {
    Sentry.withScope(scope => {
        scope.setExtras(extra);
        Sentry.captureMessage(message);
    })
}