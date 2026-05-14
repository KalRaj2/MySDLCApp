export default function WorkspaceTabs({

  files = [],

  activeFile,

  onSelect,

  onClose,

}) {

  return (

    <div
      className="
        flex
        bg-gray-900
        border-b
        border-gray-800
        overflow-x-auto
      "
    >

      {files.map((file) => (

        <div
          key={file.fileName}
          className={`
            flex
            items-center
            gap-2
            px-4
            py-2
            cursor-pointer
            border-r
            border-gray-800
            min-w-fit

            ${
              activeFile?.fileName ===
              file.fileName
                ? "bg-gray-800 text-white"
                : "bg-gray-900 text-gray-400"
            }
          `}
          onClick={() =>
            onSelect(file)
          }
        >

          <span>

            {
              file.fileName
                ?.split("/")
                ?.pop()
            }

          </span>

          <button
            onClick={(e) => {

              e.stopPropagation();

              onClose(file);

            }}
            className="
              text-red-400
              hover:text-red-300
            "
          >

            ×

          </button>

        </div>

      ))}

    </div>
  );
}