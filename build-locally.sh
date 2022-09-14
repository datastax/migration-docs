#!/bin/bash

# get the product docset that is going to be run

case $1 in
  ( 'zdm' ) echo "product: $1";;
  (*) echo "pick zdm" && exit;;
esac

echo "checking prerequisites"

# check if nvm is running and up-to-date

. ~/.nvm/nvm.sh
. ~/.profile
. ~/.bashrc

nvmversion=$(nvm --version)
echo "nvm version: ${nvmversion}"

if [ $nvmversion != 0.39.0 ]; then
  # update homebrew list of packages and either update or install nvm
  echo "Updating/installing nvm - please be patient, this takes time"
  brew update
  brew install nvm
fi

# check if node is running and the version

nodeversion=$(node -v)
echo "node version: ${nodeversion}"

if [ $nodeversion != 'v16.13.1' ]; then
  # use nvm to install version 16 and change nvm to use it
  nvm install 16
  nvm use 16
fi

# check if npm is running and the version

npmversion=$(npm -v)
echo "npm version: ${npmversion}"

if [ $npmversion != '8.5.5' ]; then
  npm install
fi

# check the antora version

antoraversion=$(npm info antora version)
echo "antora version: ${antoraversion}"

if [$antoraversion != 3.0.1 ]; then
  npm install antora
fi

# remove the antora symlinks that exist
# and set the antora symlinks to the correct product docset
# finally, run the corresponding product docset playbook

case $1 in

  zdm)
    echo "product is zdm"
    echo "make antora.yml links"
    cd docs-src/zdm-core
    rm antora.yml; ln -s antora-zdm.yml antora.yml
    cd ../..
    echo "run the build"
    npm run build:local:zdm
    ;;

esac

echo
read -p "Do you want to start a local web server for viewing the generated docs? (Y or N)" server

if [ $server = "Y" ] || [ $server = "y" ];
  then
    npm i -g serve; serve
  else
    exit;
fi
