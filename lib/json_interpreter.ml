open Yojson.Basic.Util

let rec expr_of_json json =
	match json |> member "args" with
	| `Null ->
		Node.PropertyRead (json |> member "name" |> to_string)
	| `List arg_list ->
		let name = json |> member "receiver" |> member "name" |> to_string in
		Node.MethodCall (name, List.map expr_of_json arg_list)
	| _ -> failwith "unexpected expr shape"

and node_of_json json =
	match json |> member "name" with
	| `Null ->
		let return = match json |> member "value" with 
			| `String value -> 
				Node.Static (value)
			| `Assoc _ as obj ->
				let ast = obj |> member "ast" in 
				let strings =  ast |> member "strings" |> to_list |> List.map to_string in
				let expressions = ast |> member "expressions" |> to_list |> List.map expr_of_json in
				Node.Interpolation (strings, expressions)

			| _ -> failwith "unexpected value shape"
		in
		return
	| `String tag ->
		let children = json |> member "children" |> to_list |> List.map node_of_json in
		Node.Element (tag, children)
	| _ -> failwith "unexpected node shape"