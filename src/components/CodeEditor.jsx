import Editor from "@monaco-editor/react";

export default function CodeEditor({

  file,
  onChange,

}) {

  if (!file) {

    return (

      <div className="p-4 text-gray-400">

        Select a file

      </div>
    );
  }

  return (

    <div className="h-full">

      <Editor
        height="80vh"
        theme="vs-dark"
        language={getLanguage(
          file.fileName
        )}
        value={file.code}
        onChange={(value) =>
          onChange(value)
        }
      />

    </div>
  );
}

function getLanguage(name) {

  if (name.endsWith(".jsx"))
    return "javascript";

  if (name.endsWith(".js"))
    return "javascript";

  if (name.endsWith(".ts"))
    return "typescript";

  if (name.endsWith(".tsx"))
    return "typescript";

  if (name.endsWith(".css"))
    return "css";

  if (name.endsWith(".html"))
    return "html";

  if (name.endsWith(".json"))
    return "json";

  return "plaintext";
}