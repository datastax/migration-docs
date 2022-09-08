# DataStax Zero Downtime Migration (ZDM) documentation

Since September 2021, the ZDM team has provided detailed internal documentation for the DataStax Services team. So far, migrations have been Services-led engagements using the Cloudgate Proxy (now, the “DataStax ZDM Proxy”), related tools, and advice from the extended ZDM team. 

POCs, refinements to the instructions, and evolving sets of tools have resulted in several successful Cassandra or DSE migrations to cloud-native Astra DB environments, with double writes to origin and target clusters. 

Now it’s time to assemble the details into external documentation for the ZDM 2.0 release.

## Local builds

This repo contains source Asciidoc (*.adoc) files and uses Antora to build Html5 files and related resources. 

To build the docs site locally, `cd` to the repo's top-level directory. Then run:

```
./build-locally.sh zdm
Do you need to rebuild the APIs? (Y or N)N
...
(ok to ignore warnings)
...
   ┌──────────────────────────────────────────────────┐
   │                                                  │
   │   Serving!                                       │
   │                                                  │
   │   - Local:            http://localhost:3000      │
   │   - On Your Network:  http://192.168.0.72:3000   │
   │                                                  │
   │   Copied local address to clipboard!             │
   │                                                  │
   └──────────────────────────────────────────────────┘
```

From the running `localhost:3000`, navigate into the `build/zdm/docs` subdir, which will open the index.html page.

## Production builds and deployments

`Bsys` scripts run in a Docker container to build, deploy, and sync the content to DataStax internal servers (coppi, docs-preview), and ultimately to docs.datastax.com.  TODO: setup `bsys` to work with migration-docs content.

Built output is temporarily [here](https://coppi.sjc.dsinternal.org/en/zdm/docs/index.html) on the internal coppi review server. You'll need to set up the GlobalProtect app from IT to access it via VPN.
