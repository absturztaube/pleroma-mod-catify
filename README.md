# Pleroma Mod Misskey Catears

This script adds catears to the users avatar, that meets certain requirements. i stole it partly from misskey. 
Sadly, we don't have a cat flag in our profiles in pleroma, so this script uses the displayname as well as the username to determine if a user is a cat or not.

## Usage

Put the js and css file into your static directory (i have it in `priv/static/instance/pleroma-mods/`. If you're using another path, please ensure that the css is referenced in the config correctly)

Add the following to your `priv/static/index.html` right before the closing `<body>`-Tag

```
<script type="text/javascript" src="/instance/pleroma-mods/pleroma-mod-catify.js"></script>
```

Be aware, that this might break on updating pleroma.

## Configuration

In `function PleromaModCatify()` there is a config object, where you can set a few things for this script

### `stylesheet`

This is the stylesheet that gets loaded upon script execution. the stylesheet will be included into the head section.  
Default: `/instance/pleroma-mods/pleroma-mod-catify.css`

### `triggers`

Here you can define, which requirements a user has to fullfil in order to get catears. There are 2 sections here.

#### `displayName`

If a display name contains any of the string in this array, the user will get catears. This is case insensitive

#### `instances`

Here you can either add instances or single user handles, which will appear with catears.

### `interval`

This script polls the page for new posts to apply the transformation on (as well as to find new cats). Default is 1s. But you can change the value here, if it is to taxing. Value is given in ms.

# MEW MEW

You can find me on fediverse: @absturztaube@fedi.absturztau.be

Have fun
