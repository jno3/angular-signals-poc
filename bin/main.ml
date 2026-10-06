open Yojson.Basic.Util

let usage_msg = "PLACEHOLDER"

let input_files = ref []

let output_file = ref "result"

let signals_as_method = ref false

let anon_fun filename = input_files := filename :: !input_files

let speclist =
  [
    ("-o", Arg.Set_string output_file, "Set output file name");
    ("-s", Arg.Set signals_as_method, "Treat signals as true");
  ]

let () = 
	Arg.parse speclist anon_fun usage_msg;
	let curr_path = Sys.getcwd () in
	let reader = Ast_to_js.Json_reader.make (curr_path ^ "/resources/ast.json") in
	let json = Ast_to_js.Json_reader.read reader in
	let ast = Ast_to_js.Json_interpreter.generate_node_ast json in
	(ignore (Ast_to_js.Generator.load_signals (curr_path ^ "/resources/signals.json")));
	(ignore (Ast_to_js.Generator.generate ast !signals_as_method));
	(ignore (Ast_to_js.Writer.write !output_file (Ast_to_js.Generator.return_lists())));
	Printf.printf "\n";