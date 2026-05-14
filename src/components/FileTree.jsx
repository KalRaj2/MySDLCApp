import React, {
  useMemo,
  useState,
} from "react";

/*
  BUILD TREE
*/

function buildTree(files) {

  const root = {};

  files.forEach((file) => {

    const path =
      file.file_name ||
      file.fileName;

    const parts =
      path.split("/");

    let current = root;

    parts.forEach(
      (part, index) => {

        const isFile =
          index ===
          parts.length - 1;

        if (!current[part]) {

          current[part] = isFile
            ? file
            : {};
        }

        current =
          current[part];
      }
    );
  });

  return root;
}

/*
  TREE NODE
*/

function TreeNode({

  name,

  node,

  level = 0,

  onSelect,

}) {

  const [open, setOpen] =
    useState(true);

  const isFile =
    node?.fileName ||
    node?.file_name;

  /*
    FILE
  */

  if (isFile) {

    return (

      <div
        onClick={() =>
          onSelect(node)
        }
        className="
          px-2
          py-1
          cursor-pointer
          hover:bg-gray-800
          text-sm
        "
        style={{
          paddingLeft:
            `${level * 16}px`,
        }}
      >

        📄 {name}

      </div>
    );
  }

  /*
    FOLDER
  */

  return (

    <div>

      <div
        onClick={() =>
          setOpen(!open)
        }
        className="
          px-2
          py-1
          cursor-pointer
          hover:bg-gray-800
          font-semibold
          text-sm
        "
        style={{
          paddingLeft:
            `${level * 16}px`,
        }}
      >

        {open ? "📂" : "📁"} {name}

      </div>

      {open && (

        <div>

          {Object.entries(node).map(

            ([childName, childNode]) => (

              <TreeNode

                key={childName}

                name={childName}

                node={childNode}

                level={level + 1}

                onSelect={onSelect}

              />
            )
          )}

        </div>
      )}

    </div>
  );
}

export default function FileTree({

  files = [],

  onSelect,

}) {

  const tree =
    useMemo(() => {

      return buildTree(files);

    }, [files]);

  return (

    <div
      className="
        bg-gray-900
        text-white
        h-full
        overflow-auto
      "
    >

      <div
        className="
          p-3
          border-b
          border-gray-800
          font-bold
        "
      >

        Explorer

      </div>

      <div className="p-2">

        {Object.entries(tree).map(

          ([name, node]) => (

            <TreeNode

              key={name}

              name={name}

              node={node}

              onSelect={onSelect}

            />
          )
        )}

      </div>

    </div>
  );
}