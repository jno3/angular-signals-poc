type reader = {
	file_path: string;
}

let make file_path = {
	file_path;
}

let read reader = 
	Yojson.Basic.from_file reader.file_path

let to_pretty_string reader = 
	Yojson.Basic.pretty_to_string (read reader)