export default function FileTree({

  files = [],

  selectedFile,

  onSelect,

}) {

  function buildTree(files) {

    const tree = {};

    files.forEach((file) => {

      const parts =
        file.fileName.split("/");

      let current = tree;

      parts.forEach((part, index) => {

        const isFile =
          index === parts.length - 1;

        if (!current[part]) {

          current[part] = isFile
            ? file
            : {};
        }

        current = current[part];
      });
    });

    return tree;
  }

  const tree =
    buildTree(files);

  function renderTree(node, level = 0) {

    return Object.keys(node).map((key) => {

      const item = node[key];

      const isFile =
        item.fileName;

      if (isFile) {

        return (

          <div
            key={item.fileName}
            onClick={() =>
              onSelect(item)
            }
            className={`
              px-2
              py-1
              rounded
              cursor-pointer
              text-sm
              mb-1
              ${
                selectedFile?.fileName ===
                item.fileName
                  ? "bg-blue-700"
                  : "hover:bg-gray-700"
              }
            `}
            style={{
              paddingLeft:
                `${level * 16}px`,
            }}
          >

            📄 {key}

          </div>
        );
      }

      return (

        <div key={key}>

          <div
            className="
              px-2
              py-1
              text-yellow-400
              font-bold
              text-sm
            "
            style={{
              paddingLeft:
                `${level * 16}px`,
            }}
          >

            📁 {key}

          </div>

          <div>

            {renderTree(
              item,
              level + 1
            )}

          </div>

        </div>
      );
    });
  }

  return (

    <div
      className="
        bg-gray-900
        h-full
        overflow-auto
        p-2
      "
    >

      {files.length === 0 && (

        <div
          className="
            text-gray-400
            text-sm
          "
        >

          No generated files

        </div>
      )}

      {renderTree(tree)}

    </div>
  );
}