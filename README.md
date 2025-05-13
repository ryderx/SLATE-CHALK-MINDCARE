# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deployment to Hostinger Guide

Here's a general guide to deploying this Next.js project to a web hosting service like Hostinger.

**1. Prepare Your Next.js Application:**

*   **Environment Variables:** Ensure all necessary environment variables (like `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`) are properly set in your Hostinger environment. These are referenced in `next.config.ts`.
*   **Build:** Run `npm run build` or `yarn build` locally to create an optimized production build of your Next.js application.

**2. Choose a Deployment Method:**

Hostinger offers various ways to deploy applications. Here are two common methods:

*   **cPanel:** If Hostinger provides cPanel access:
    *   **Upload:** Upload the contents of your `.next` folder (created during the build process) and your `public` folder to your desired directory on the server (e.g., `public_html`).
    *   **Node.js Setup:** Use cPanel's Node.js application setup (if available) to run your Next.js server. You might need to create a `server.js` file to start the Next.js server.

*   **FTP/SFTP:**
    *   Use an FTP client like FileZilla to connect to your Hostinger account.
    *   Upload the `.next` and `public` folders to your desired directory.
    *   You'll likely need SSH access to start and manage your Node.js server.

**3. Configure a Node.js Server (if needed):**

If you are using a Node.js server, you might need to create a `server.js` file in your project's root directory. Here's a basic example:

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
```

**4. Install Dependencies:**

*   **SSH Access:**  Gain SSH access to your Hostinger server.
*   **Navigate:** Use the `cd` command to navigate to the directory where you uploaded your project files.
*   **Install:** Run `npm install` or `yarn install` to install the project's dependencies.

**5. Start Your Application:**

*   Use a process manager like PM2 to keep your application running even if the SSH session closes:

```bash
npm install -g pm2
pm2 start server.js  # or your start script
```

**6. Configure Your Domain:**

*   In your Hostinger DNS settings, point your domain or subdomain to the server's IP address.

**7. Configure Images:**

*   The `next.config.ts` file shows image configuration. Ensure that your image sources (especially if you're using local uploads) are correctly configured for production. You might need to adjust the `remotePatterns` or use a CDN.

**Important Considerations:**

*   **Hostinger Documentation:**  Refer to Hostinger's official documentation for specific instructions on deploying Node.js applications.
*   **Database:** If your application uses a database, configure the database connection settings on your Hostinger server.
*   **SSL:**  Set up SSL (HTTPS) for your domain through Hostinger.
*   **Testing:** Thoroughly test your application after deployment.

**Disclaimer:**

This is a general guide. The exact steps might vary based on your specific Hostinger plan and configuration. Always consult Hostinger's documentation for the most accurate instructions.
