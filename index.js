
// Require the framework and instantiate it
console.time('startup');
console.timeLog('startup', 'init');

const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');
require('@opentelemetry/plugin-http');
require('@opentelemetry/plugin-https');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { BatchSpanProcessor } = require('@opentelemetry/tracing');
console.timeLog('startup', 'loaded dependencies');

if (!(process.env.DISABLE_TRACING === 'true')) {
  const tracingProvider = new NodeTracerProvider({
    logLevel: 'error',
    plugins: {
      http: {
        enabled: true,
        path: '@opentelemetry/plugin-http',
      },
      https: {
        enabled: true,
        path: '@opentelemetry/plugin-https',
      },
    },
  });
  console.timeLog('startup', 'tracingProvider registering...');
  // Initialize the provider
  tracingProvider.register({
  });
  console.timeLog('startup', 'tracingProvider registered');

  let providerExporter;
  // Initialize the exporter
  providerExporter = new TraceExporter({
  });
  
  if (providerExporter) {
    tracingProvider.addSpanProcessor(new BatchSpanProcessor(providerExporter));
  }
  
  const tracerInstance = tracingProvider.getTracer('default');
  console.timeLog('startup', 'Tracing initialization completed');
} else {
  console.timeLog('startup', 'Tracing disabled');
}

const fastify = require('fastify')({
})

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen(process.env.PORT, '0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.timeEnd('startup');
})

process.on('SIGINT', () => {
  process.exit();
});
