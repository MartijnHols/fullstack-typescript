# Architecture decisions

The following decisions were made and why.

## Root level work spaces

I chose to make 2 root level folders for ease of use. This does mean you have to manually specify each workspace in the [package.json](./package.json) file. Seeing as adding new workspaces should be rare, this shouldn't be a big deal.

## Extensibility

The setup is made with the idea that you can add new folders for new types of apps. For instance for a React Native app you might want to make an `app` or `mobile-app` folder. It should probably use the same backend as the (web) frontend.

## Shared compilation settings

For the sake of consistency both workspaces use the exact same (as far as possible) configuration for compiling and checking code. This also reduces the amount of maintenance required to keep everything up-to-date, and allows us to keep the configuration out of the workspaces.
