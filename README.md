# Robin

A different way to see your timeline by showing your following people by round-robin.
This ensures you see everyone you follow, not just the noisiest ones.

# How it works

Using the Twitter API, given a user, it will fetch all the people that account is following, then fetch their timelines, creates a feed of just the latest tweets from everyone of those.

# Setup

Apologies, this is a hack I made in a few hours time, so it isn't really easily clonable. Here's the rough instructions.

```
npm install
```

Get a Bearer Token from https://developer.twitter.com/en/portal/dashboard
and create a file called credentials-twitter.json in the root of the checkout

```
{
  "API_KEY": "A2....",
  "API_SECRET_KEY": "M06E3...",
  "BEARER_TOKEN": "AAAAAAAAAAAAAAAAAAAAAGBb..."
}
```

Run the server

```
npm serve
```

# Command Line

```
node main.js get-following liquidx --output following.json
node main.js get-following-timelines liquidx --output public/data --following-list public/data/following.json
node main.js latest-tweets liquidx public/data --following-list public/data/following.json  --output public/data/latest.json
```

# Web Interface

Using Vue, the files generated from the above command is used as the data source for the viewer.

# About

Created as a proof of concept for an alternative way to use Twitter that is not chronoloigcal or ML-algorithm based.

It's called Robin, after the queuing concept called Round-Robin.

By [@liquidx](https://twitter.com/liquidx)
