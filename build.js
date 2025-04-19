const esbuild = require('esbuild');

const args = process.argv.slice(2);
const watch = args.includes('--watch');

const buildOptions = {
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/main.js',
  format: 'iife',
  target: ['es6'],
  platform: 'browser',
  minify: false,
  sourcemap: true,
  define: {
    'global': 'window',
    'process.env.NODE_ENV': '"development"'
  }
};

if (watch) {
  // Watch mode
  esbuild.context(buildOptions).then(context => {
    context.watch();
    console.log('Watching for changes...');
  });
} else {
  // Single build
  esbuild.build(buildOptions).catch(() => process.exit(1));
}
