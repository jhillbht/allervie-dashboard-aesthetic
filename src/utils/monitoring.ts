import * as Sentry from "@sentry/react";

export const logError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    Sentry.captureException(error);
  });
};

export const logEvent = (name: string, data?: Record<string, any>) => {
  Sentry.captureEvent({
    message: name,
    level: "info",
    extra: data,
  });
};

export const startPerformanceTransaction = (name: string, op: string) => {
  const transaction = Sentry.startTransaction({
    name,
    op,
  });
  
  return {
    transaction,
    finish: () => {
      transaction.finish();
    },
  };
};

export const setUserContext = (userId: string, email?: string) => {
  Sentry.setUser({
    id: userId,
    email,
  });
};

export const clearUserContext = () => {
  Sentry.setUser(null);
};