# Types of Macros

There are two types of macros that are present in the AFC system. These can be divided to be either `internal` or 
`external` macros.

Internal macros are macros that are present within the python code of the AFC system. These macros usually will not 
show up in GUIs such as Mainsail or Fluidd, due to the way that these systems detect macros. To expose these macros 
to the end-user, they are commonly wrapped with an `external` macro.

An example of this is the `LANE_MOVE` macro. An external macro called `BT_LANE_MOVE` is wrapped around this internal 
macro in order to make it easier to use.

The `internal` macros are subdivided into categories based on their functionality. These categories are:

- **Spool Macros**: These macros are used to manage the spool and its properties.
- **Calibration Macros**: These macros are used to help calibrate the AFC system. Most of them will provide a guided prompt to help you through the process.
- **Tip Forming Macros**: These macros are used to manage the tip forming process.
- **Buffer Macros**: These macros are used to manage the buffer and its properties.
- **Lane / Movement Macros**: These macros are used to manage the lane and its properties.
- **Miscellaneous Macros**: These macros are used for various purposes, including error handling, tool changes, and AFC status updates.




