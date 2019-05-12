# Pleroma Mod Misskey Catears

This script adds catears to the users avatar, that meets certain requirements. i stole it partly from misskey. 
Sadly, we don't have a cat flag in our profiles in pleroma, so this script uses the displayname as well as the username to determine if a user is a cat or not.

## Install

do this in your pleroma-mods directory

```
sudo -u pleroma git clone https://github.com/absturztaube/pleroma-mod-catify.git
```

copy `config.json.example` to `config.json`

add `catify` to your pleroma-mod-loader config

## Configuration

### Triggers

the `triggers` section in the config defines which users are transformed into cats.
the mod can either choose from certain features in the display name or handle.

### Nyanification

A little additional feature of this mod is, that it replaces な with にゃ in posts written by cats.
you can disable, enable and customize it in the `nya` section of `config.json`.

#### How it works

the matcher is used to determine which sections of a post will be altered. on those sections the replacer replaces the `source` string with the `dest` string.

# MEW MEW

You can find me on fediverse: @absturztaube@fedi.absturztau.be

Have fun
