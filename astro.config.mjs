// @ts-check
import { defineConfig } from 'astro/config';
import zero from 'zero-astro'

// https://astro.build/config
export default defineConfig({
  integrations: [zero({
    name: 'my-integration', 
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        // Your config setup logic here
      },
      "astro:server:start": ({ address, logger }) => { 
        // Your server start logic using 'address' and 'logger' here
        console.log('Server started at:', address);
      },
    }
  })]
});
