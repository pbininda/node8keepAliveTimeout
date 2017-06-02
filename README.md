# Short Description

Node 8 introduced a change in the handling of http keep-alive connections. IMHO, this is (at least) a breaking change. When an http server does long-running requests (>5s), and the client requests a `Connection: keep-alive` connection, the http server closes the connection after 5s. This potentially causes browsers to re-send the request even if it is a `POST` request.

# To Reproduce

        npm test

Starts a little express server (`server.js`) and a client. 
* The server is a standard express server with a long running post request (`/longpost` takes 10s).
* The client calls the `POST /longpost` with a preflight `OPTIONS /longpost`.

The test runs through fine on node 6 and node 7:
<pre>
> node test.js

got request OPTIONS /longpost
got options response 200
sending post request
got request POST /longpost
got post response 200 { status: 'OK' }
</pre>
 but fails on node 8 with
<pre>
> node test.js

got request OPTIONS /longpost
got options response 200
sending post request
got request POST /longpost
C:\Users\pbininda\projects\ATRON\node8keepAliveTimeout\client.js:39
            throw err;
            ^

Error: socket hang up
    at createHangUpError (_http_client.js:343:15)
    at Socket.socketOnEnd (_http_client.js:435:23)
    at emitNone (events.js:110:20)
    at Socket.emit (events.js:207:7)
    at endReadableNT (_stream_readable.js:1045:12)
    at _combinedTickCallback (internal/process/next_tick.js:102:11)
    at process._tickCallback (internal/process/next_tick.js:161:9)
</pre>

# Browser Retries

It seems, all major browsers implement [https://www.w3.org/Protocols/rfc2616/rfc2616-sec8.html#sec8.2.4](). Since the server closes the connection on which it received the POST request before sending an answer, the Browsers re-send the POST. Note that you don't see the re-send in chrome dev tools but using Wireshark shows the retransmission. To have a look at this, run

        npm start

which launches the server (`server.js`) and then load `browsertest.html` in chrome. This runs `browsertest.js` in the browser which does a simple $.ajax request against the server. On the server side you will see:

<pre>
> node server.js

got request OPTIONS /longpost
got request POST /longpost
got request POST /longpost
format called 5003ms after previous
</pre>

This shows, that the server received two POST requests the second one 5s after the first one, even though the browser client code only does one request.

# Bug or Breaking Change?

I'm not sure if this is a bug or a breaking change. It probably got introduced through [#2534](https://github.com/nodejs/node/pull/2534). It only seems to happen when two connections are used (that's why the prefight OPTIONS is forced to happen in my code), so it may be that the wrong connection is being closed here.

