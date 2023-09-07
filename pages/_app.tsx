import Script from "next/script";
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-QCNYSWXVGM" />
      <Script strategy="lazyOnload" id="google_analytics">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N45PRD5');
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-QCNYSWXVGM');
`}</Script>

      <Script strategy="lazyOnload" id="segment">{`
!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="CqNYSAW7IN6mk3psB5M7tb4FS6BD9fJx";analytics.SNIPPET_VERSION="4.13.2";
analytics.load("CqNYSAW7IN6mk3psB5M7tb4FS6BD9fJx");
analytics.page();
}}();
`}</Script>

      <Script strategy="lazyOnload" src="https://leadbooster-chat.pipedrive.com/assets/loader.js" />

      <Script strategy="lazyOnload" id="outfunnel">{`
window.OFID = "619cd60794500205bf055239";
(function(){
var script = document.createElement('script');
var url = 'https://cdn.outfunnel.com/c.js?v='+ new Date().toISOString().substring(0,10);
script.setAttribute('src', url);
document.getElementsByTagName('head')[0].appendChild(script);
})();
`}</Script>

      <Script strategy="lazyOnload" id="linkedin">{`
_linkedin_partner_id = "2463025";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
(function(){var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type="text/javascript";b.async=true;
b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b,s);})();
`}</Script>

      <Script src="//static.ads-twitter.com/oct.js" />
      <Script strategy="lazyOnload" id="twitter">{`
twttr.conversion.trackPid('o8ess', { tw_sale_amount: 0, tw_order_quantity: 0 });
`}</Script>

      <Script strategy="lazyOnload" id="reddit">{`
!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','t2_lrrq2wp9');rdt('track', 'PageVisit');
`}</Script>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
