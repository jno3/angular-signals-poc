open Yojson.Basic.Util

let signals = ref []
let update_block = ref []
let creation_block = ref []
let var_names = ref []
let id_counter = ref 0

let return_lists () = 
	(List.rev !creation_block, List.rev !update_block, List.rev !var_names)

let emit_creation line = 
	creation_block := line :: !creation_block;
	()

let emit_update line = 
	update_block := line :: !update_block;
	()

let load_signals path =
  signals :=
    Yojson.Basic.from_file path
    |> Yojson.Basic.Util.to_list
    |> List.map Yojson.Basic.Util.to_string

let new_var_name prefix = 
	incr id_counter;
	Printf.sprintf "%s%d" prefix !id_counter

let has_signal call =
	match call with
	| Node.MethodCall (name, []) -> List.mem name !(signals)
	| _ -> false

let rec compile_node parent node signal_as_method =
	match node with
	| Node.Interpolation (elements, exprs) -> 
		let var_name = new_var_name "text" in 
		let interpolation = Printf.sprintf "`%s`" (zip elements exprs) in
		emit_creation (Printf.sprintf "const %s = document.createTextNode('');" var_name);
		emit_creation (Printf.sprintf "%s.appendChild(%s);" parent var_name);
		if ((List.exists has_signal exprs) && not(signal_as_method)) then
			emit_creation(
				Printf.sprintf "effect(() => { %s.textContent = %s; });" var_name interpolation
			)
		else begin
			var_names := var_name :: !var_names;
			emit_update(
				Printf.sprintf "refs.%s.textContent = %s;" var_name interpolation;
			)
		end
	| Node.Element (element, nodes) ->
		let var_name = new_var_name "el" in
		emit_creation (Printf.sprintf "const %s = document.createElement('%s');" var_name element);
		emit_creation (Printf.sprintf "%s.appendChild(%s);" parent var_name);
		List.iter (fun node -> compile_node var_name node signal_as_method) nodes;
	| Node.Static (text) ->
		let var_name = new_var_name "text" in
		emit_creation (Printf.sprintf "const %s = document.createTextNode('%s');" var_name text);
		emit_creation (Printf.sprintf "%s.appendChild(%s);" parent var_name);


and compile_expr expr = 
	match expr with
	| Node.PropertyRead property -> "ctx." ^ property
	| Node.MethodCall (meth, args) ->
		let arg_strings = List.map compile_expr args in
		let l = Printf.sprintf "ctx.%s(%s)" meth (String.concat ", " arg_strings) in
		(* Printf.printf "%s" l; *)
		l

and zip strings exprs = 
	match (strings, exprs) with
	| ([s], []) -> s
	| (s :: rest_s, e :: rest_e) -> (Printf.sprintf "%s${%s}" s (compile_expr e)) ^ zip rest_s rest_e
	| _ -> failwith "mismatched strings/expressions"

and generate ast signal_as_method = 
	List.iter (fun node -> compile_node "container" node signal_as_method) ast;