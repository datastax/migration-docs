# DataStax Zero Downtime Migration (ZDM) documentation

Since September 2021, the ZDM team has provided detailed internal documentation for the DataStax Services team. So far, migrations have been Services-led engagements using the Cloudgate Proxy (now, the “DataStax ZDM Proxy”), related tools, and advice from the extended ZDM team. 

POCs, refinements to the instructions, and evolving sets of tools have resulted in several successful Cassandra or DSE migrations to cloud-native Astra DB environments, with double writes to origin and target clusters. 

Now it’s time to assemble the details into external documentation for the ZDM 2.0 release. 

This repo contains the source Asciidoc files and uses the Antora server to build Html5 and related resources. 

"Bsys" scripts that run in a Docker container build, deploy, and sync the content to DataStax internal servers (coppi, docs-preview), and ultimately to docs.datastax.com.  TODO: setup `bsys` to work with zdm content.

Built output is temporarily [here](https://coppi.sjc.dsinternal.org/en/zdm/docs/index.html) on the internal coppi review server. You'll need to set up the GlobalProtect app from IT to access it via VPN.
