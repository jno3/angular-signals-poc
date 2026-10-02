let usage_msg = "test"

let verbose = ref false

let input_files = ref []

let output_file = ref ""

let anon_fun filename = input_files := filename :: !input_files

let speclist =
  [
    ("-verbose", Arg.Set verbose, "Output debug information");
    ("-o", Arg.Set_string output_file, "Set output file name");
  ]

let () = 
	Arg.parse speclist anon_fun usage_msg;
	let reader = Ast_to_js.Json_reader.make "/home/j/projetos/angular-compiler-poc/output_final.json" in
	let json = Ast_to_js.Json_reader.read reader in
	let node_ast = Ast_to_js.Json_interpreter.interpret json in
	(ignore (Ast_to_js.Interpreter.parse node_ast))