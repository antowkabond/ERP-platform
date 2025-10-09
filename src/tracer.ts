import tracer from 'dd-trace';
import { MANUAL_DROP } from 'dd-trace/ext/tags';

tracer.init({
  profiling: true,
  runtimeMetrics: true,
  env: process.env.APP_ENV,
});

tracer.use('express', {
  hooks: {
    request: (span, _req) => {
      if (['/', '/health'].includes(_req['originalUrl'])) {
        span.setTag(MANUAL_DROP, true);
      }
    },
  },
});

export default tracer;

