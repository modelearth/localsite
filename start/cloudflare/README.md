# Cloudflare setup

Cloudflare provides free and easy DNS managment, proxy service for fast page loading, https routing and URL redirects.  Using CNAME records, you can point one domain at multiple Github repos. ([See step 4](../start/))

You may want to leave off the proxy service for some domains. (With the proxy on, you may need to used the cache clearing button to view recent file changes.)

During setup, Cloudflare will provide nameservers to enter at your current registrar.  
You can transfer an existing domain to Cloudflare for cheaper hosting.  

### Configuration

- Select "Full"
- Always Use HTTPS - On
- Auto Minify - All 3
- Brotli compression - On

Go to "SSL/TLS > Edge Certificates"  

<!--
The following set-up steps from the three videos here: https://httpsiseasy.com

Video 2: Under the same tab

https://www.youtube.com/watch?time_continue=1&v=mVzdEl5G0iM
-->

Enable HSTS - Turn on all 4, set Max Age Header to 12 months. (6 months is too short for hstspreload.org)  

Set to: Minimum TSL 1.2  
Below, leave the default of "TLS 1.3" as "On"  

Click two checkboxes here so browsers always preload as https: [hstspreload.org](https://hstspreload.org)  

<!--Video 3:-->
On same tab, keep on "Automatic HTTPS Rewrites" (is now already ON by default)
- Allows Cloudflare to automatically change all links in the HTML to https when appropriate, including links to external sites.  

Optional: Test with ssllabs.com (after 24 hours)  

### Add a wildcard redirect under "Page Rule"

Choose "Forwarding URL"  

*.yourdomain.com/*  
https://yourdomain.com/#go=$2  

Only works for subdomains that are in the DNS list.  