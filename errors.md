how can i login as admin?
locally i can access the admin page by navigating to this http://localhost:3000/admin
but after its deployed on vercel i can't access the admin page.
also when i access the admin page locally here is the browser console error. 
installHook.js:1 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <HotReload globalError={[...]} webSocket={WebSocket} staticIndicatorState={{pathname:null, ...}}>
      <AppDevOverlayErrorBoundary globalError={[...]}>
        <ReplaySsrOnlyErrors>
        <DevRootHTTPAccessFallbackBoundary>
          <HTTPAccessFallbackBoundary notFound={<NotAllowedRootHTTPFallbackError>}>
            <HTTPAccessFallbackErrorBoundary pathname="/admin" notFound={<NotAllowedRootHTTPFallbackError>} ...>
              <RedirectBoundary>
                <RedirectErrorBoundary router={{...}}>
                  <Head>
                  <__next_root_layout_boundary__>
                    <SegmentViewNode type="layout" pagePath="layout.tsx">
                      <SegmentTrieNode>
                      <link>
                      <script>
                      <script>
                      <script>
                      <RootLayout>
                        <html lang="en" className="inter_5901...">
                          <body
                            className="min-h-screen flex flex-col"
-                           cz-shortcut-listen="true"
                          >
                  ...


after i signin in the hosted (https://spotless-beauty.vercel.app/checkout) here is the browser console
Failed to load resource: net::ERR_SSL_PROTOCOL_ERROR
1475pv-fbgary.js:1 [next-auth][error][CLIENT_FETCH_ERROR] 
https://next-auth.js.org/errors#client_fetch_error Failed to fetch Object
error @ 1475pv-fbgary.js:1
cart:1 [Intervention] Images loaded lazily and replaced with placeholders. Load events are deferred. See https://go.microsoft.com/fwlink/?linkid=2048113
api/orders:1  Failed to load resource: the server responded with a status of 500 ()

i think i tested this morning and it was working i can see the order in my orders page and it says order confirmed and pending but now i cant create any order so please check and fix