let js_content creation update names = Printf.sprintf {|import { effect } from './runtime.js';

export function create(container, ctx) {
	%s
	return { %s };
}

export function update(refs, ctx) {
	%s
}
|} (String.concat "\n\t" creation)
   (String.concat ", " names)
   (String.concat "\n\t" update)

let html_page js_name = Printf.sprintf {|<!doctype html>
<html>
<head><meta charset="utf-8"><title>%s</title></head>
<body>
  <div id="app"></div>
  <script type="module">
    import { ctx } from './ctx.js';
    import { create, update } from './%s';

    update(create(document.getElementById('app'), ctx), ctx);
  </script>
</body>
</html>
|} js_name js_name

let write_file path content =
	Out_channel.with_open_text path (fun oc ->
		Out_channel.output_string oc content
	)

let write name (creation, update, names) =
	let js_file = name ^ ".js" in
	let html_file = name ^ ".html" in
	let final = js_content creation update names in
	Printf.printf "%s" final;
	write_file js_file final;
	write_file html_file (html_page js_file)