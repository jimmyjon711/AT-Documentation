# Overview of features

This section goes over the features that can be found in Armored Turtle Automated Filament Control (AFC) Software.

## TurtleNeck Buffer Ram Sensor

AFC allows the use of using the TurtleNeck Buffers as a ram sensor for detecting when filament is loaded to the toolhead
extruder. This can be used inplace of a toolhead filament sensor. To learn more about this feature please
see [Buffer Ram Sensor](installation/buffer-ram-sensor.md) document.

## Bypass

By default, if a hardware sensor is not setup for a bypass AFC will create a virtual bypass filament sensor. 
Enabling the virtual filament sensor disables AFC functionality and enabled state persists across reboots.

You can also enable AFC bypass with a hardware sensor by printing out a [bypass](https://github.com/ArmoredTurtle/AFC-Accessories/tree/main/AFC_Bypass) 
accessory, connecting inline it after your buffer and adding a bypass filament sensor to klipper config like below. 
Once filament is inserted into the bypass side, the switch disables AFC functionality so you can print like normal.

```
[filament_switch_sensor bypass]
switch_pin: <replace with MCU pin that switch is connected to>
pause_on_runout: False
```

When either bypass is enabled/filament detect all AFC functionality with loading to the toolhead is disabled. Calling
the `TOOL_UNLOAD` macro will call the `UNLOAD_FILAMENT` macro if it exists so that filament can still be manually unload
from the toolhead.

## Lower stepper current when printing

For longer prints you may want to have the ability to lower BoxTurtles steppers current as they can get hot when engaged
for a long period of time.

Enabling lower current during printing can be enabled two ways:

1. Set `global_print_current` in AFC.cfg file
2. Set `print_current` for each AFC_stepper, this will override `global_print_current` in AFC.cfg

During testing, it was found that 0.6A worked well during printing and kept the steppers warms to the touch. We 
would not suggest going lower than this or the TurtleNeck buffers may not work as intended when using BOM spec steppers.

## Enabling switches to show up in Mainsail/Fluidd GUIs

AFC has the ability to add sensors as filament switches so they show up in Mainsail/Fluidd web gui. This can either be
enabled globally by adding/uncommenting `enable_sensors_in_gui: True` in AFC.cfg file or enabled/disabled in individual
sections in your config file. Enabling this globally is useful for debugging purposes, but setting in individual
sections will override the global setting.

AFC_buffer, AFC_extruder, AFC_hub, and AFC_stepper sections in your AFC_hardware.cfg or AFC_Turtle(n).cfg have the
ability to enable sensor by adding `enable_sensors_in_gui: True`. There is an extra config value for AFC_stepper to
allow you to either show both sensors or just prep/load sensors by using `sensor_to_show: prep` or
`sensor_to_show: load`, leaving out sensor_to_show will show both sensors.

## Tool change count

AFC has the ability to keep track of number of tool changes when doing multicolor prints. Number of toolchanges
will be pulled from files metadata stored in moonraker. AFC will keep track of tool changes and print out the 
current tool change number when a T(n) command is called from gcode. Make sure moonraker version is at least v0.9.3-64 to
utilize this feature

If you have setup your `Change filament G-code` section to use `SET_AFC_TOOLCHANGES` in your slicer please remove
the following lines:

```cfg
{ if toolchange_count == 1 }SET_AFC_TOOLCHANGES TOOLCHANGES=[total_toolchanges]{endif }
```

Also remove the following if added to your `PRINT_END` section as number of toolchanges will now automatically reset back
once print is done/canceled.

`SET_AFC_TOOLCHANGES TOOLCHANGES=0`

## Setting extruder temp

AFC has the ability to automatically set extruder temperature based off filament material type loaded or spoolman
extruder temperature if its set.

If not using spoolman make sure the material is set for your lanes and the temperature values will be pulled from
`default_material_temps` variable in `AFC.cfg` file. This list can also be updated/added to, just make sure new entries
have a comma inbetween and follow current format when adding new variable.

If spoolman extruder temperature or material type is not defined AFC default's to `min_extrude_temp` variable defined in
`[extruder]` section in `printer.cfg`

```cfg
default_material_temps: PLA:210, ABS:235, ASA:235 # Default temperature to set extruder when loading/unloading lanes.
```

## Loading filament to hub

For users that have a hub not located in their Box Turtle, AFC has the ability to load filament to their hub once its
inserted. This is turned on by default and this will happen even if your hub is located in your Box Turtle. This can be
disabled by setting `load_to_hub: False` in your `AFC.cfg` file. Also individual lanes can be turn on/off by setting
`load_to_hub: True/False` under `[AFC_stepper <lane_name>]` section in your config.

## Variable purge length on filament change

AFC has the ability to purge different lengths with orcas flush volumes when doing filament changes with T(n) macros. To
use this feature update your Change Filament G-Code section in your orca slicer to the following:

`T[next_extruder] PURGE_LENGTH=[flush_length]`

Could also be added to your PRINT_START macro with a specific length, this would be ideal for if your first filament is
not currently loaded as the PURGE_LENGTH from Orca for the first change would be zero

`T{initial_tool} PURGE_LENGTH=100`

**NOTE: If your first filament is not currently loaded and needs to change, `PURGE_LENGTH` will be zero and the poop
macro will then use `variable_purge_length` from AFC_Macro_Vars.cfg file, so make sure this is set correctly for
your printer**

## Spoolman

AFC has the ability to integrate with Spoolman. This is as simple as ensuring that the following information is 
present in your `moonraker.conf` file:

```ini
[spoolman]
server: http://<ip>:<port>
sync_rate: 5
```

For example:

```ini
[spoolman]
server: http://192.168.1.184:7912
sync_rate: 5
```

## Direct Drive

AFC has the ability to use direct loading straight to the extruder/toolhead. There should be no hub in-between that 
lane and the extruder when this option is used. Using `direct` will disable the ability to use the automatic 
calibration functions.

To enable `direct` mode, the following line needs to be added to the `[AFC_stepper <lane_name>]` section in your 
configuration:

``` cfg
hub: direct
```

## Espooler Print Assist

AFC has the ability to activate espooler forward movement when printing to help aid in spools from
walking around and riding up wheels when they get low. This is enabled by default and can be turned off
by adding `enable_assist: False` to you `[AFC_BoxTurtle Turtle_(n)]` config section.

## Quiet Mode

AFC has the ability to run motors at slower speed when doing loads to reduce motor noise. This is helpful for
those that may have a printer in their bedroom and would like to run multicolor prints overnight. To enabled
quiet mode there is a filament switch under your filament sensor, once this is enabled AFC will do long moves at
a slower speed(default: 50mm/s). Quiet mode speed does not apply to PTFE calibrations and lane resets.<br>

Speed for quiet mode can be updated by setting `quiet_moves_speed` variable in either `[AFC]` section, or 
`[AFC_stepper <name>]` [section](configuration/AFC_UnitType_1.cfg.html#afc_stepper-section) (adding here override setting in `[AFC]` [section](configuration/AFC.cfg.html#afc-section)).

## Tracking Toolchange Statistics

AFC tracks all toolchanges, lane loading/unloading, number of changes since last load error, total number
of cuts performed, number of cuts since blade last changed and how long N20 motors have been active if
N20 are configured in your setup.
<br><br>
AFC will also start warning in console when your number of blade cuts is 1k less than the tool cut threshold letting you know that its getting close to change blade. Once number of cuts exceed threshold AFC start printing out error message in console. If blade is changed use `AFC_CHANGE_BLADE` macro to reset count and date blade was changed

Use the following macros to print out statistics in console, update when blade has been changes and reset
N20 active time:<br>
- [AFC_STATS](klipper/internal/misc.html#AFC.afc.AFC_STATS) - prints statistics to console<br>
- [AFC_CHANGE_BLADE](klipper/internal/misc.html#AFC.afc.AFC_CHANGE_BLADE) - run macro when blade is changed, sets date that blade was changes and resets `Total since changed` count<br>
- [AFC_RESET_MOTOR_TIME](klipper/internal/lane.html#AFC_assist.Espooler.AFC_RESET_MOTOR_TIME) - run macro when N20 motor has been swapped out in a lane

Both variables can be added/updated in `[AFC]` [section](configuration/AFC.cfg.html#afc-section) :<br>
- `print_short_stats`: Add/uncomment to have the statistics printout to be skinner. Useful for those that have consoles that are skinner( eg. Klipperscreen )<br>
- `tool_cut_threshold`: Defaults to 10000 cuts, update to if you want threshold to be larger. This controls when AFC prints out warning/errors when number of cuts since changed reaches/exceeds this number.

Examples of what statistics printout looks like:<br>
![stats_normal](../assets/images/afc_stats_wide.png)
![stats_short](../assets/images/afc_stats_short.png)<br>