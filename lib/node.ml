type expr = 
	| PropertyRead of string
	| MethodCall of string * expr list
and node = 
	| Interpolation of string list * expr list
	| Element of string * node list
	| Static of string
[@@deriving show]
