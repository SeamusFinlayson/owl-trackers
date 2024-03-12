# Owl Trackers

System-agnostic token trackers for [Owlbear Rodeo](https://www.owlbear.rodeo/).

![OwlTrackersHeader](https://github.com/SeamusFinlayson/owl-trackers/assets/77430559/f09269a8-295e-4dca-af31-3f70c1d1bde0)

## Installing

Install this extension using the install link: https://owl-trackers.onrender.com/manifest.json

Coming soon: ~~The extension can be installed from the [store page](https://extensions.owlbear.rodeo/owl-trackers).~~

## How it Works

This extension allows you to track up to eight stats on your tokens for any gaming system you use.

### The Basics

**Right click** on a token to access the **context menu embed** and edit a token's stats.

![context menu embed](https://github.com/SeamusFinlayson/owl-trackers/assets/77430559/e5a0069d-49e0-469e-b46e-0a275d24ae99)

**Inline math** lets you do addition or subtraction inside a tracker's text field. To add 2 to your stat type +2 and press "enter" or click away. To subtract 2 from your stat type -2 and press "enter" or click away.

<img name="Use Scene Defaults" src="https://github.com/SeamusFinlayson/owl-trackers/assets/77430559/b2798de9-ce51-4381-b1fc-59e6bd5bbeb6" width=500>

The **three dots icon** in the context embed opens the **editor** which gives you more in depth control over a token's trackers. In the editor you can give a tracker a name, a colour, toggle whether or not it is displayed on the map, and toggle whether or not inline math is enabled. You should disable inline math if you want ot store negative numbers in the tracker.

![editor](https://github.com/SeamusFinlayson/owl-trackers/assets/77430559/6229be01-72e5-4af0-b89c-1f6de9b4257d)

### Scene Defaults

You can set default trackers for the scene in the **action popover** by clicking the three dots icon next to the "set scene defaults" label.

<img name="Action Menu" src="https://github.com/SeamusFinlayson/owl-trackers/assets/77430559/16e64c83-4e02-4c8c-a3c9-a05d3140b98f" width=326>

This will open the **scene defaults editor**, which is very similar to the editor but for the scene instead of a specific token. Say, for example, that you play D&D. You might want every creature to have Hit Points, Temporary Hit Points and Armor Class.

![Screenshot 2024-03-11 193035](https://github.com/SeamusFinlayson/owl-trackers/assets/77430559/42de88f5-5981-43e2-b164-4ddc308838b7)

Once you've set the defaults for the scene you can add them to any token with a single click.

<img name="Use Scene Defaults" src="https://github.com/SeamusFinlayson/owl-trackers/assets/77430559/0a13f96d-ecec-4b96-b496-2421dfb4a805" width=500>

### Uninstalling

Refresh your page after uninstalling the extension to clear trackers from the map. Token data will **not** be deleted by uninstalling.

## Feature Requests

I may accept feature requests but - as I have limited time and development plans of my own - being a paid member on [Patreon](https://www.patreon.com/SeamusFinlayson) is your best path to getting a feature implemented.

## Support

If you need support for this extension you can message me in the [Owlbear Rodeo Discord](https://discord.gg/yWSErB6Qaj) @Seamus or open an issue on [GitHub](https://github.com/SeamusFinlayson/owl-trackers).

If you like using this extension consider [supporting me on Patreon](https://www.patreon.com/SeamusFinlayson) where paid members can request features. You can also follow along there as a free member for updates.

## Building

This project uses [PNPm](https://pnpm.io/) as a package manager.

To install all the dependencies run:

`pnpm install`

To run in a development mode run:

`pnpm dev`

To make a production build run:

`pnpm build`

## License

GNU GPLv3

## Contributing

Copyright (C) 2024 Seamus Finlayson

Feel free to fork this but if you post it to the store please do not use my extension name or logo. I am unlikely to accept pull requests.
