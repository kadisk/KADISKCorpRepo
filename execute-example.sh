#!/bin/bash

ECOSYSTEM_DATA_PATH="/home/kadisk/EcosystemData"
ECOSYSTEM_DEFAULT="/home/kadisk/EcosystemData/config-files/ecosystem-defaults.json"
NODEJS_DEPS_PATH="/home/kadisk/EcosystemData/npm-dependencies"


SUPERVISOR_SOCKET_PATH="unix:/home/kadisk/EcosystemData/supervisor-sockets/kadisk-transit-proxy.sock"
PACKAGE_PATH="/home/kadisk/EcosystemData/repos/KADISKCorpRepo/VirtualDesk.Module/Applications.layer/kadisk-transit-proxy.app"
STARTUP_JSON="/home/kadisk/EcosystemData/repos/KADISKCorpRepo/VirtualDesk.Module/Applications.layer/kadisk-transit-proxy.app/metadata/startup-params.json"

pkg-exec \
  --package "$PACKAGE_PATH" \
  --startupJson "$STARTUP_JSON" \
  --ecosystemDefault "$ECOSYSTEM_DEFAULT" \
  --ecosystemData "$ECOSYSTEM_DATA_PATH" \
  --nodejsProjectDependencies "$NODEJS_DEPS_PATH" \
  --verbose \
  --supervisorSocket "$SUPERVISOR_SOCKET_PATH"