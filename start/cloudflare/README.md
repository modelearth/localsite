# Cloudflare setup

Cloudflare provides free and easy DNS managment, proxy service for fast page loading, https routing and URL redirects.  Using CNAME records, you can point one domain at multiple Github repos. ([See step 4](../start/))

You may want to leave off the proxy service for some domains. (With the proxy on, you may need to used the cache clearing button to view recent file changes.)

During setup, Cloudflare will provide nameservers to enter at your current registrar.  
You can transfer an existing domain to Cloudflare for cheaper hosting.  

### Configuration

- Select "Full"
- Always Use HTTPS - On
- Auto Minify - All 3
- Brotli compression - On (the default)  
(Under "Speed > Optimization")  

### Go to "SSL/TLS > Edge Certificates"  

<!--
The following set-up steps from the three videos here: https://httpsiseasy.com

Video 2: Under the same tab

https://www.youtube.com/watch?time_continue=1&v=mVzdEl5G0iM
-->

Click "Enable HSTS" - Turn on all 4, set Max Age Header to 12 months. (6 months is too short for hstspreload.org)  

- Minimum TLS Version: Minimum TSL 1.2  
- Leave the default of "TLS 1.3" as "On"  
- Keep on "Automatic HTTPS Rewrites" (ON by default) - Allows Cloudflare to automatically change all links in the HTML to https when appropriate, including links to external sites.  

Go to [hstspreload.org](https://hstspreload.org) and click two checkboxes here so browsers always preload as https.  

Optional: Test with ssllabs.com (after 24 hours)  

### You won't be able to add a true wildcard redirect under "Page Rule"

Redirects only works for subdomains that are entered in the Cloudflare DNS list.  

Choose "Forwarding URL"  

\*.yourdomain.com/\*  
https://yourdomain.com/#go=$2  

